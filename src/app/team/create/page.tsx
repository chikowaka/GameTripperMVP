'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore'; 

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [penalty, setPenaltyInput] = useState('');
  const router = useRouter();

  const setTeamNameGlobal = useTeamStore((state) => state.setTeamName);
  const setPenalty = useTeamStore((state) => state.setPenalty);

  const handleCreateTeam = () => {
    if (!teamName || !penalty) {
      alert('チーム名と罰ゲームを入力してください');
      return;
    }

    setTeamNameGlobal(teamName); // グローバルに保存
    setPenalty(penalty);

    const teamId = encodeURIComponent(teamName.trim().replace(/\s+/g, '-').toLowerCase());
    router.push(`/team/${teamId}/lobby`);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <h2 className="text-xl font-bold text-red-600 mb-6">チーム 新規作成</h2>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <input
          type="text"
          placeholder="チームのなまえ"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />

        {/* <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        /> */}

        <input
          type="text"
          placeholder="罰ゲーム"
          value={penalty}
          onChange={(e) => setPenaltyInput(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />

        <button
          onClick={handleCreateTeam}
          className="bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg"
        >
          けってい
        </button>

        <button
          onClick={() => router.back()}
          className="bg-sky-400 hover:bg-sky-500 text-white py-3 rounded-lg"
        >
          もどる
        </button>
      </div>
    </main>
  );
}

