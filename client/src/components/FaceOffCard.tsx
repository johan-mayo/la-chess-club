"use client";

import { Match, User } from "@/app/event/page";
import Image from "next/image";
import { Button } from "./Button";
import { useState } from "react";

type FaceOffCardProps = {
  player1: User;
  player2: User;
  match: Match;
  submitResult: (key: string) => void;
  acceptRematch: (userId: string) => void;
  declineRematch: (userId: string) => void;
  submittedResults: boolean;
  waitingOnResults: boolean;
  oponentId: string;
};

const FaceOffCard: React.FC<FaceOffCardProps> = (props) => {
  const [result, setResult] = useState<string>("Player 1");

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResult(e.target.value);
  };
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center space-x-10 text-center">
          <PlayerCard
            player={props.player1}
            number={1}
            winner={
              !props.waitingOnResults &&
              props.submittedResults &&
              (props.match.result[0] === "Player 1" ||
                props.match.result[0] === "Draw")
            }
          />{" "}
          <h1 className="text-center">VS</h1>
          <PlayerCard
            player={props.player2}
            number={2}
            winner={
              !props.waitingOnResults &&
              props.submittedResults &&
              (props.match.result[0] === "Player 2" ||
                props.match.result[0] === "Draw")
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white shadow-lg border border-black px-4 py-2 rounded-md mt-5">
        <h1 className="text-center w-full">
          You match is in{" "}
          <span className="text-red-700 font-bold">
            Section {props.match.section}
          </span>
          ,{" "}
          <span className="text-red-700 font-bold">
            Board {props.match.board}
          </span>
        </h1>
      </div>

      {!props.submittedResults && (
        <div className="flex items-center justify-center mt-10 space-x-5">
          <select value={result} onChange={onChange}>
            <option value={"Player 1"}>Player 1 Won</option>
            <option value={"Player 2"}>Player 2 Won</option>
            <option value={"Draw"}>Draw</option>
            <option value={"Abort"}>Abort</option>
          </select>
          <Button
            onClick={() => {
              props.submitResult(result);
            }}
          >
            Submit
          </Button>
        </div>
      )}

      {props.waitingOnResults && props.submittedResults && (
        <div className="flex w-full items-center justify-center mt-10">
          <div className="flex flex-col">
            <div className="flex w-full justify-center items-center">
              <div className="border-t-transparent border-solid animate-spin rounded-full border-red-200 border-8 h-10 w-10" />
            </div>
            <h1 className="font-bold mt-5">Waiting on opponent</h1>
          </div>
        </div>
      )}

      {!props.waitingOnResults && props.submittedResults && (
        <>
          {props.oponentId !== props.match.player1 && (
            <div className="flex items-center justify-center mt-5 space-x-2">
              <Button onClick={() => props.acceptRematch(props.match.player1)}>
                Rematch
              </Button>
              <Button
                onClick={() => {
                  props.declineRematch(props.match.player1);
                }}
              >
                No Rematch
              </Button>
            </div>
          )}
          {props.oponentId === props.match.player1 && (
            <div className="flex w-full items-center justify-center mt-10">
              <div className="flex flex-col">
                <div className="flex w-full justify-center items-center">
                  <div className="border-t-transparent border-solid animate-spin rounded-full border-red-200 border-8 h-10 w-10" />
                </div>
                <h1 className="font-bold mt-5">Waiting on opponent</h1>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

type PlayerCardProps = {
  player: User;
  number: number;
  winner: boolean;
};

const PlayerCard: React.FC<PlayerCardProps> = (props) => {
  return (
    <div>
      <Image
        src={props.player?.imgUrl}
        alt={"Picture of player."}
        width={100}
        height={100}
        className={`h-32 w-32 md:h-40 md:w-40 object-contain bg-slate-900 rounded-full shadow-md ${props.winner ? "border-4 border-red-700" : ""} `}
      />
      <h1 className="mt-2 font-bold">
        {props.player.firstName}(p{props.number})
      </h1>
    </div>
  );
};

export default FaceOffCard;
