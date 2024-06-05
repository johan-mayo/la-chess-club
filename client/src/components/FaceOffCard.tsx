"use client";

import { Match, User } from "@/app/event/page";
import Image from "next/image";
import { Button } from "./Button";

type FaceOffCardProps = {
  player1: User;
  player2: User;
  match: Match;
};

const FaceOffCard: React.FC<FaceOffCardProps> = (props) => {
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center space-x-10 text-center">
          <PlayerCard player={props.player1} />{" "}
          <h1 className="text-center">VS</h1>
          <PlayerCard player={props.player2} />
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

      <div className="flex items-center justify-center mt-10 space-x-5">
        <select>
          <option>Player 1 Won</option>
          <option>Player 2 Won</option>
          <option>Draw</option>
          <option>Abort</option>
        </select>
        <Button>Submit</Button>
      </div>

      {/*<div className="flex items-center justify-center mt-5">
        <Button>Rematch</Button>
      </div>*/}
    </div>
  );
};

type PlayerCardProps = {
  player: User;
};

const PlayerCard: React.FC<PlayerCardProps> = (props) => {
  return (
    <div>
      <Image
        src={props.player.imgUrl}
        alt={"Picture of player."}
        width={100}
        height={100}
        className="h-32 w-32 md:h-40 md:w-40 object-contain bg-slate-900 rounded-full shadow-md"
      />
      <h1 className="mt-2 font-bold">{props.player.firstName}</h1>
    </div>
  );
};

export default FaceOffCard;
