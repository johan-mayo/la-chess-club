"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "@clerk/nextjs";
import { Container } from "@/components/Container";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/Button";
import Link from "next/link";

const Event = () => {
  const [message, setMessage] = useState("");
  const [isLoadingMatchmaking, setIsLoadingMatchmaking] = useState(false);
  const [match, setMatch] = useState(false);

  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded || !userId) return;

    if (!isLoadingMatchmaking) return;

    const socket = io(process.env.NEXT_PUBLIC_BACKEND as string);

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      // Emit event to join matchmaking upon connecting
      socket.emit("join-matchmaking", userId);
    });

    socket.on("match-found", (data) => {
      console.log("Match found:", data);
      setIsLoadingMatchmaking(false);
      setMatch(true);
      // Update UI to display the matched opponent
    });

    socket.on("match-rejoined", (data) => {
      console.log("Match found:", data);
      setIsLoadingMatchmaking(false);
      setMatch(true);
      // Update UI to display the matched opponent
    });

    socket.on("message", (data) => {
      console.log("Received message:", data);
      setMessage(data);
    });

    return () => {
      socket.disconnect();
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
          {!isLoadingMatchmaking && !match && (
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
        {!isLoadingMatchmaking && match && <h1>Found Match</h1>}
      </Container>
    </Layout>
  );
};

export default Event;
