'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { useTeamStore } from '@/lib/store/teamStore';

export default function TeamLobbyPage() {
  const router = useRouter();
  const { teamId } = useParams();
  const teamName = useTeamStore((state) => state.teamName);
  const members = useTeamStore((state) => state.members);
  const addMember = useTeamStore((state) => state.addMember);

  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState('');

  const handleStartGame = () => {
    router.push(`/play/${teamId}`);
  };

  const handleAddMember = () => {
    if (newName.trim()) {
      addMember(newName.trim());
      setNewName('');
      setShowInput(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-6">
      <h2 className="text-xl font-bold text-pink-600 mb-4">
        {teamName && <span className="block text-gray-800">チーム「{teamName}」</span>}
        メンバー 募集中
      </h2>

      <div className="mb-6 w-full max-w-xs flex flex-col gap-3">
        {members.map((member, index) => (
          <div
            key={index}
            className={`${member.color || 'bg-gray-200'} text-gray-800 rounded-lg px-4 py-2 text-center font-semibold`}
          >
            {member.name}
          </div>
        ))}

        {showInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="なまえ"
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddMember}
              className="bg-green-400 text-white px-4 rounded"
            >
              OK
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="bg-gray-200 text-gray-500 rounded-lg px-4 py-2 text-center"
          >
            + 参加者を追加
          </button>
        )}
      </div>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <button
          onClick={() => router.back()}
          className="bg-sky-400 hover:bg-sky-500 text-white py-3 rounded-lg"
        >
          もどる
        </button>

        <button
          onClick={handleStartGame}
          className="bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg"
        >
          けってい
        </button>
      </div>
    </main>
  );
}



// 'use client';

// import { useRouter } from 'next/navigation';
// import { useParams } from 'next/navigation';

// // 仮の参加メンバーリスト（MVP用）
// const dummyMembers = [
//   { name: 'もひまる', color: 'bg-pink-300' },
//   { name: 'ゆめじゃん', color: 'bg-yellow-200' },
//   { name: 'そくらてす', color: 'bg-blue-200' },
// ];

// export default function TeamLobbyPage() {
//   const router = useRouter();
//   const { teamId } = useParams();

//   const handleStartGame = () => {
//     router.push(`/play/${teamId}`);
//   };

//   return (
//     <main className="min-h-screen bg-white flex flex-col items-center p-6">
//       <h2 className="text-xl font-bold text-pink-600 mb-4">メンバー 募集中</h2>

//       <div className="mb-6 w-full max-w-xs flex flex-col gap-3">
//         {dummyMembers.map((member, index) => (
//           <div
//             key={index}
//             className={`${member.color} text-gray-800 rounded-lg px-4 py-2 text-center font-semibold`}
//           >
//             {member.name}
//           </div>
//         ))}

//         {/* 実際はここで「Waiting...」など動的表示できる */}
//         <div className="bg-gray-200 text-gray-500 rounded-lg px-4 py-2 text-center">
//           Waiting...
//         </div>
//       </div>

//       <div className="w-full max-w-xs flex flex-col gap-4">
//         <button
//           onClick={() => router.back()}
//           className="bg-sky-400 hover:bg-sky-500 text-white py-3 rounded-lg"
//         >
//           もどる
//         </button>

//         <button
//           onClick={handleStartGame}
//           className="bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg"
//         >
//           けってい
//         </button>
//       </div>
//     </main>
//   );
// }
