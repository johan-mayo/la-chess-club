"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { User, getUser } from "../event/page";
import { Container } from "@/components/Container";
import { Layout } from "@/components/Layout";

type Entry = {
  user: string;
  score: number;
};

const getLeaderboard = async (): Promise<Entry[]> => {
  const res = await axios.get<Entry[]>(
    `${process.env.NEXT_PUBLIC_BACKEND}/api/leaderboard`,
  );

  console.log(res.data);
  return res.data;
};

const Leaderboard = () => {
  const [entries, setEntries] = useState<Array<Entry>>([]);
  const [users, setUsers] = useState<Array<User>>([]);
  useEffect(() => {
    (async () => {
      const entries = await getLeaderboard();
      const userPromises = entries.map(async (entry) => {
        const user = await getUser(entry.user);
        return { ...user, score: entry.score };
      });

      const usersWithScores = await Promise.all(userPromises);
      setUsers(usersWithScores);
      setEntries(entries);
    })();
  }, []);
  return (
    <Layout>
      <Container>
        <div className="max-w-4xl mx-auto p-4">
          <div className="overflow-y-auto max-h-96">
            <h1>Leaderboard</h1>
            <table className="min-w-full bg-white shadow-md rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left text-gray-600 font-bold">
                    User
                  </th>
                  <th className="py-2 px-4 text-left text-gray-600 font-bold">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries?.map((entry, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">
                      {users[index]?.firstName} {users[index]?.lastName}
                    </td>
                    <td className="py-2 px-4">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default Leaderboard;
