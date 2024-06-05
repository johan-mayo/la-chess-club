import mongoose from "mongoose";
import { Server as SocketIOServer, Socket } from "socket.io";
import MatchModel, { MatchStatus } from "../modules/match/match.model";
import UserModel from "../modules/user/user.model";
import MatchQueueModel from "../modules/matchQueue/matchqueue.model";

export default function handleMatchmaking(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("join-matchmaking", async (clerkUserId: string) => {
      const user = await UserModel.findOne({ clerkUserId });
      if (!user) {
        console.log("Failed to find match user", clerkUserId);
        return;
      }

      const isInMatch = await rejoinMatch(user.id, socket.id, io);
      if (!isInMatch) {
        await startMatchmaking(clerkUserId, socket.id, io);
      }
    });

    socket.on("submit-result", async ({ matchId, result }) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const match = await MatchModel.findById(matchId).session(session);
        if (!match) {
          throw new Error("Match not found");
        }

        if (match.player1SocketId === socket.id) {
          match.result[0] = result;
          match.resultSubmitted[0] = true;
        } else if (match.player2SocketId === socket.id) {
          match.result[1] = result;
          match.resultSubmitted[1] = true;
        } else {
          throw new Error("Invalid player");
        }

        if (match.resultSubmitted[0] && match.resultSubmitted[1]) {
          match.status = MatchStatus.AwaitingResult;
        }

        await match.save({ session });

        if (match.status === MatchStatus.AwaitingResult) {
          // Process the results
          await processMatchResult(match, session, io);
        } else {
          socket.emit("waiting-for-result", {
            message: "Waiting for opponent to submit result...",
          });
        }

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        console.error("Error during result submission:", error);
        socket.emit("error", "An error occurred while submitting the result");
      } finally {
        session.endSession();
      }
    });

    socket.on("disconnect", () => {
      console.log(`A user disconnected: ${socket.id}`);
    });
  });
}

async function startMatchmaking(
  clerkUserId: string,
  socketId: string,
  io: SocketIOServer,
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await UserModel.findOne({ clerkUserId });
    if (!user) {
      console.log("Failed to find match user", clerkUserId);
      return;
    }

    // Find available match or add player to queue
    const match = await findMatchOrQueue(user.id, socketId, session);
    if (!match) {
      await session.commitTransaction();
      session.endSession();
      return;
    }

    await session.commitTransaction();
    session.endSession();

    // Notify both players of found match
    io.to(socketId).emit("match-found", {
      matchId: match._id,
      opponentId: match.player1,
    });
    io.to(match.player1SocketId as string).emit("match-found", {
      matchId: match._id,
      opponentId: user.id,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error during matchmaking:", error);
    io.emit("error", "An error occurred during matchmaking");
  }
}

async function findMatchOrQueue(
  userId: string,
  socketId: string,
  session: any,
) {
  // Find an available match or add player to queue within a transaction
  let match = await MatchModel.findOneAndUpdate(
    { status: MatchStatus.Waiting },
    {
      $set: {
        status: MatchStatus.Matched,
        player2: userId,
        player2SocketId: socketId,
      },
    },
    { session, new: true },
  );

  if (!match) {
    // Check if there are less than 12 matches in total
    const totalMatches = await MatchModel.countDocuments().session(session);
    if (totalMatches < 12) {
      // Create a new match
      const { section, board } = await getAvailableSectionAndBoard(session);
      await MatchModel.create(
        [
          {
            player1: userId,
            status: MatchStatus.Waiting,
            section,
            board,
            player1SocketId: socketId,
          },
        ],
        { session },
      );
    } else {
      // No available match, add player to queue
      await MatchQueueModel.create([{ userId, socketId }], { session });
    }
  }

  return match;
}

async function getAvailableSectionAndBoard(session: any) {
  const matches = await MatchModel.find().session(session);
  const sections = 3;
  const boards = 4;

  for (let section = 1; section <= sections; section++) {
    for (let board = 1; board <= boards; board++) {
      const existingMatch = matches.find(
        (match) => match.section === section && match.board === board,
      );
      if (!existingMatch) {
        return { section, board };
      }
    }
  }

  throw new Error("No available section and board found");
}

async function rejoinMatch(
  userId: string,
  socketId: string,
  io: SocketIOServer,
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find active match for the user
    const match = await MatchModel.findOne({
      $or: [{ player1: userId }, { player2: userId }],
    }).session(session);

    if (!match) {
      await session.commitTransaction();
      session.endSession();
      return false;
    }

    if (match.player1.toString() === userId) {
      match.player1SocketId = socketId;
    } else {
      match.player2SocketId = socketId;
    }

    await match.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Notify player of rejoining match
    if (match.status !== MatchStatus.Waiting)
      io.to(socketId).emit("match-rejoined", {
        matchId: match._id,
        opponentId:
          match.player1.toString() === userId ? match.player2 : match.player1,
      });
    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error during rejoining match:", error);
    io.emit("error", "An error occurred while rejoining match");
    return false;
  }
}

async function processMatchResult(
  match: any,
  session: mongoose.ClientSession,
  io: SocketIOServer,
) {
  try {
    // Determine the result
    const resultMessage =
      match.result[0] === match.result[1]
        ? "It's a draw!"
        : match.result[0] === "player1-won"
          ? "Player 1 won!"
          : "Player 2 won!";

    // Update the match status to finished
    match.status = MatchStatus.Finished;
    await match.save({ session });

    // Notify both players about the result
    io.to(match.player1SocketId).emit("match-result", {
      result: resultMessage,
    });
    io.to(match.player2SocketId).emit("match-result", {
      result: resultMessage,
    });

    // TODO: Update the leaderboard here in the future

    // Start the next match or notify the users if no one is in the queue
    //await matchFinished(match, session, io);
  } catch (error) {
    console.error("Error during processing match result:", error);
    io.to(match.player1SocketId).emit(
      "error",
      "An error occurred while processing the result",
    );
    io.to(match.player2SocketId).emit(
      "error",
      "An error occurred while processing the result",
    );
  }
}
