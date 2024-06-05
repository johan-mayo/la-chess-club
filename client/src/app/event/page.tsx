"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "@clerk/nextjs";
import { Container } from "@/components/Container";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/Button";
import Link from "next/link";
import axios from "axios";
import FaceOffCard from "@/components/FaceOffCard";

export type Match = {
  _id: string;
  player1: string;
  player2: string;
  status: string;
  section: number;
  board: number;
  result: [string, string];
  player1SocketId: string;
  player2SocketId: string;
  resultSubmitted: [boolean, boolean];
};

export type User = {
  _id: string;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  imgUrl: string;
};

const getMatch = async (matchId: string): Promise<Match> => {
  const res = await axios.get<Match>(
    `${process.env.NEXT_PUBLIC_BACKEND}/api/match?id=${matchId}`,
  );

  return res.data;
};

const getUser = async (userId: string): Promise<User> => {
  const user = await axios.get<User>(
    `${process.env.NEXT_PUBLIC_BACKEND}/api/user?id=${userId}`,
  );
  return user.data;
};

const socket = io(process.env.NEXT_PUBLIC_BACKEND as string, {
  autoConnect: false,
});

const Event = () => {
  const [message, setMessage] = useState("");
  const [isLoadingMatchmaking, setIsLoadingMatchmaking] = useState(false);
  const [match, setMatch] = useState<Match>();
  const [player1, setPlayer1] = useState<User>();
  const [player2, setPlayer2] = useState<User>();
  const [waitingOnResults, setWaitingOnResults] = useState(false);
  const [submittedResults, setSubmittedResults] = useState(false);

  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded || !userId) return;

    if (!isLoadingMatchmaking) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      // Emit event to join matchmaking upon connecting
      socket.emit("join-matchmaking", userId);
    });

    socket.on("match-found", async (data) => {
      console.log("Match found:", data);
      setIsLoadingMatchmaking(false);
      const match = await getMatch(data.matchId);
      const player1 = await getUser(match.player1);
      const player2 = await getUser(match.player2);
      setMatch(match);
      setPlayer1(player1);
      setPlayer2(player2);
      // Update UI to display the matched opponent
    });

    socket.on("match-result", async (data) => {
      setSubmittedResults(true);
      setWaitingOnResults(false);
    });

    socket.on("waiting-for-result", (data) => {
      setSubmittedResults(true);
      setWaitingOnResults(true);
    });

    socket.on("match-rejoined", async (data) => {
      console.log("Match found:", data);
      setIsLoadingMatchmaking(false);
      const match = await getMatch(data.matchId);
      const player1 = await getUser(match.player1);
      const player2 = await getUser(match.player2);
      const submittedResults =
        data.opponentId === match.player1
          ? match.resultSubmitted[1]
          : match.resultSubmitted[0];

      const waitingOnresults =
        !match.resultSubmitted[1] || !match.resultSubmitted[0];
      setSubmittedResults(submittedResults);
      setWaitingOnResults(waitingOnresults);
      setPlayer1(player1);
      setPlayer2(player2);
      setMatch(match);
      // Update UI to display the matched opponent
    });

    socket.on("message", (data) => {
      console.log("Received message:", data);
      setMessage(data);
    });

    return () => {
      socket.connect();
    };
  }, [isLoaded, userId, isLoadingMatchmaking]);

  const sendMessage = () => {
    const socket = io("http://localhost:3000");
    socket.emit("message", "Hello from client");
  };

  return (
    <Layout>
      <Container className="mt-10 ">
        <div className="flex items-center justify-center mb-5">
          <Button>
            <Link href={"/leaderboard"}>View Leaderboard</Link>
          </Button>
        </div>
        <hr />
        <div className="flex items-center justify-center mt-5">
          {!isLoadingMatchmaking && match === undefined && (
            <Button
              onClick={() => {
                setIsLoadingMatchmaking(true);
              }}
            >
              Enter/Rejoin Matchmaking
            </Button>
          )}
          {isLoadingMatchmaking && (
            <div className="flex w-full items-center justify-center">
              <div className="flex flex-col">
                <div className="flex w-full justify-center items-center">
                  <div className="border-t-transparent border-solid animate-spin rounded-full border-red-200 border-8 h-10 w-10" />
                </div>
                <h1 className="font-bold mt-5">Looking for opponent</h1>
              </div>
            </div>
          )}
        </div>
        {!isLoadingMatchmaking && match !== undefined && (
          <>
            <FaceOffCard
              player1={player1 as User}
              player2={player2 as User}
              match={match as Match}
              waitingOnResults={waitingOnResults}
              submittedResults={submittedResults}
              submitResult={(result) => {
                console.log(match as Match, result);
                const old = { ...match, result: [result, result] };
                setMatch(old as any);
                socket.emit("submit-result", {
                  matchId: (match as Match)._id,
                  result,
                });
              }}
            />
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Event;
