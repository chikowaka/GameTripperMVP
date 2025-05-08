'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTeamStore } from '@/lib/store/teamStore'
import { useRamenStore } from '@/lib/store/ramenStore'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'

export default function PlayTopPage({ params }: { params: { teamId: string } }) {
  const teamId = params.teamId
  const router = useRouter()
  const { members } = useTeamStore()
  const { ramenList } = useRamenStore()

  const handleAdd = () => {
    router.push(`/play/${teamId}/entry`)
  }

  const handleEdit = (id: string) => {
    router.push(`/play/${teamId}/entry?id=${id}`)
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 space-y-6">
      {/* タイトル */}
      <h1 className="text-3xl font-bold text-black">ラーメンはしご旅</h1>

      {/* メンバーと杯数表示 */}
      <div className="flex gap-4 overflow-x-auto px-2">
        {members.map((member) => {
          const count = ramenList.filter((entry) => entry.member === member.name).length
          return (
            <div key={member.name} className="flex flex-col items-center">
              <span className="text-black font-bold">{count}</span>
              <Image
                src={member.icon || '/default-icon.png'}
                alt={member.name}
                width={48}
                height={48}
                className="rounded-full border"
              />
              <span className="text-sm text-black mt-1">{member.name}</span>
            </div>
          )
        })}
      </div>

      {/* ラーメンリスト */}
      <div className="w-full max-w-[600px] space-y-4">
        {ramenList.map((entry) => (
          <div
            key={entry.id}
            onClick={() => handleEdit(entry.id)}
            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <Image
              src={entry.image}
              alt="Ramen Image"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-black text-sm font-medium">食べる人: {entry.member}</p>
              <p className="text-black text-sm">ラーメン店: {entry.shop}</p>
            </div>
          </div>
        ))}

        {/* 追加ボタン */}
        <Button onClick={handleAdd} className="w-full justify-center gap-2">
          <PlusIcon size={18} />
          ラーメンを追加
        </Button>
      </div>
    </div>
  )
}



// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useTeamStore } from '@/lib/store/teamStore';

// export default function PlayTopPage() {
//   const router = useRouter();
//   const members = useTeamStore((state) => state.members);
//   const [ramenList, setRamenList] = useState([{ eater: '', shopName: '' }]);

//   const addRamenEntry = () => {
//     setRamenList([...ramenList, { eater: '', shopName: '' }]);
//   };

//   const handleInputChange = (index: number, field: 'eater' | 'shopName', value: string) => {
//     const newList = [...ramenList];
//     newList[index][field] = value;
//     setRamenList(newList);
//   };

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-start p-4 space-y-4 bg-white">
//       {/* タイトル */}
//       <h1 className="text-2xl font-bold text-center">
//         <span className="text-red-500">ラーメン</span>{' '}
//         <span className="text-blue-500">はしご旅</span>
//       </h1>

//       {/* メンバー表示 */}
//       <div className="flex space-x-4">
//         {members.map((member, index) => (
//           <div key={index} className="flex flex-col items-center">
//             <div className="text-sm font-bold text-black">{member.ramenCount || 0}杯</div>
//             <div className="w-12 h-12 rounded-full bg-gray-300"></div>
//             <div className="text-xs mt-1 text-black">{member.name}</div>
//           </div>
//         ))}
//       </div>

//       {/* ラーメン店リスト */}
//       <div className="w-full space-y-2">
//         {ramenList.map((item, index) => (
//           <div
//             key={index}
//             className="flex items-center justify-between border rounded p-2 bg-gray-100"
//           >
//             {/* 食べる人：セレクトボックス */}
//             <select
//               value={item.eater}
//               onChange={(e) => handleInputChange(index, 'eater', e.target.value)}
//               className="w-1/3 border border-gray-300 rounded px-2 py-1 text-sm text-black"
//             >
//               <option value="">食べる人を選択</option>
//               {members.map((member, idx) => (
//                 <option key={idx} value={member.name}>
//                   {member.name}
//                 </option>
//               ))}
//             </select>

//             {/* 店舗名入力 */}
//             <input
//               type="text"
//               placeholder="ラーメン店の名前"
//               value={item.shopName}
//               onChange={(e) => handleInputChange(index, 'shopName', e.target.value)}
//               className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm text-black"
//             />
//           </div>
//         ))}
//         {/* ラーメンエントリ追加ボタン */}
//         <button
//           onClick={addRamenEntry}
//           className="w-full bg-blue-300 text-white py-2 rounded mt-2"
//         >
//           +
//         </button>
//       </div>

//       {/* 戻る */}
//       <button
//         onClick={() => router.back()}
//         className="bg-sky-300 text-white px-6 py-2 rounded"
//       >
//         もどる
//       </button>
//     </main>
//   );
// }
