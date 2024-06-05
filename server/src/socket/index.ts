import { Server as SocketIOServer, Socket } from "socket.io";
import MatchModel from "../modules/match/match.model";
import UserModel from "../modules/user/user.model";
import EventModel from "../modules/event/event.model";
import LeaderboardModel from "../modules/leaderboard/leaderboard.model";
import mongoose from "mongoose";

interface Player {
  id: string;
  username: string;
}

let waitingPlayer: Player | null = null;

export default function setupSocketHandlers(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("join-matchmaking", async (username: string) => {
      const player: Player = { id: socket.id, username };

      if (waitingPlayer) {
        // Start a match
        const opponent = waitingPlayer;
        waitingPlayer = null;

        const section = Math.floor(Math.random() * 10); // Example section number
        const board = Math.floor(Math.random() * 10); // Example board number

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          // Create a new match
          const match = await MatchModel.create(
            [
              {
                players: [player.id, opponent.id],
                section,
                board,
                result: ["pending", "pending"],
              },
            ],
            { session },
          );

          // Find today's event and update it
          const today = new Date().toISOString().split("T")[0];
          await EventModel.findOneAndUpdate(
            { date: today },
            { $push: { activeMatches: match[0]?._id } },
            { new: true, upsert: true, session },
          );

          await session.commitTransaction();
          session.endSession();

          socket.emit("match-found", { opponent, section, board });
          io.to(opponent.id).emit("match-found", {
            opponent: player,
            section,
            board,
          });
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.error("Error during matchmaking transaction:", error);
          socket.emit("error", "An error occurred during matchmaking");
        }
      } else {
        // No waiting player, add this player to the waiting list
        waitingPlayer = player;
        socket.emit("waiting", { message: "Waiting for an opponent..." });
      }
    });

    socket.on("submit-match-result", async ({ matchId, result }) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const match = await MatchModel.findById(matchId).session(session);
        if (!match) {
          throw new Error("Match not found");
        }

        match.result = result;
        await match.save();

        const player1 = await UserModel.findById(match.players[0]).session(
          session,
        );
        const player2 = await UserModel.findById(match.players[1]).session(
          session,
        );

        if (!player1 || !player2) {
          throw new Error("Players not found");
        }

        // Calculate scores based on results
        let score1 = 0;
        let score2 = 0;
        if (result[0] === "win" && result[1] === "loss") {
          score1 = 1;
          score2 = 0;
        } else if (result[0] === "loss" && result[1] === "win") {
          score1 = 0;
          score2 = 1;
        } else if (result[0] === "draw" && result[1] === "draw") {
          score1 = 0.5;
          score2 = 0.5;
        }

        // Update leaderboard
        const leaderboard = await LeaderboardModel.findOne().session(session);
        if (leaderboard) {
          const user1Index = leaderboard.users.findIndex(
            (user) => user.user.toString() === player1.id,
          );
          const user2Index = leaderboard.users.findIndex(
            (user) => user.user.toString() === player2.id,
          );

          if (user1Index >= 0) {
            (
              leaderboard.users[user1Index] as { user: any; score: number }
            ).score += score1;
          } else {
            leaderboard.users.push({ user: player1.id, score: score1 });
          }

          if (user2Index >= 0) {
            (
              leaderboard.users[user2Index] as { user: any; score: number }
            ).score += score2;
          } else {
            leaderboard.users.push({ user: player2.id, score: score2 });
          }

          await leaderboard.save();
        } else {
          // Create a new leaderboard if it doesn't exist
          await LeaderboardModel.create(
            [
              {
                users: [
                  { user: player1.id, score: score1 },
                  { user: player2.id, score: score2 },
                ],
              },
            ],
            { session },
          );
        }

        // Update event to move match from active to past matches
        const today = new Date().toISOString().split("T")[0];
        const event = await EventModel.findOneAndUpdate(
          { date: today },
          {
            $pull: { activeMatches: match._id },
            $push: { pastMatches: match._id },
          },
          { session },
        );

        if (!event) {
          throw new Error("Event not found");
        }

        await session.commitTransaction();
        session.endSession();

        io.emit("leaderboard-updated", { leaderboard: await getLeaderboard() });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error during match result submission:", error);
        socket.emit("error", "An error occurred while submitting match result");
      }
    });

    socket.on("disconnect", () => {
      console.log(`A user disconnected: ${socket.id}`);
      if (waitingPlayer?.id === socket.id) {
        waitingPlayer = null;
      }
    });
  });
}

async function getLeaderboard() {
  const leaderboard = await LeaderboardModel.findOne()
    .populate("users.user")
    .exec();
  return leaderboard ? leaderboard.users : [];
}
