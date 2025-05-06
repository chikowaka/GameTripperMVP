'use client';

import { useParams } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import { useState } from 'react';

export default function PlayTopPage() {
  const { teamId } = useParams();
  const members = useTeamStore((state) => state.members);

  const [ramenRecords, setRamenRecords] = useState<
    { memberName: string; shopName: string }[]
  >([]);

  const handleAddRecord = () => {
    setRamenRecords([...ramenRecords, { memberName: '', shopName: '' }]);
  };

  const handleChange = (
    index: number,
    field: 'memberName' | 'shopName',
    value: string
  ) => {
    const updated = [...ramenRecords];
    updated[index][field] = value;
    setRamenRecords(updated);
  };

  const getFakeRamenCount = (memberName: string) => {
    return ramenRecords.filter((r) => r.memberName === memberName).length;
  };

  return (
    <main className="min-h-screen bg-white p-6">
      {/* タイトル */}
      <h1 className="text-2xl font-bold text-red-500 text-center mb-6">
        ラーメン <span className="text-blue-600">はしご旅</span>
      </h1>

      {/* メンバー表示 */}
      <div className="flex justify-center gap-4 mb-8">
        {members.map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-sm text-gray-700 font-bold mb-1">
              {getFakeRamenCount(member.name)}杯
            </div>
            <div className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden mb-1">
              {member.icon && (
                <img
                  src={member.icon}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="text-xs text-center text-gray-600">{member.name}</p>
          </div>
        ))}
      </div>

      {/* ラーメン屋リスト */}
      <div className="space-y-3 mb-6">
        {ramenRecords.map((record, index) => (
          <div
            key={index}
            className="rounded-xl bg-gray-100 px-4 py-2 shadow-md"
          >
            <div className="text-sm font-semibold text-gray-600 mb-1">
              食べる人
            </div>
            <input
              type="text"
              placeholder="メンバー名"
              value={record.memberName}
              onChange={(e) =>
                handleChange(index, 'memberName', e.target.value)
              }
              className="w-full mb-2 px-3 py-1 rounded border border-gray-300"
            />
            <div className="text-sm font-semibold text-gray-600 mb-1">
              ラーメン屋
            </div>
            <input
              type="text"
              placeholder="ラーメン屋の名前"
              value={record.shopName}
              onChange={(e) => handleChange(index, 'shopName', e.target.value)}
              className="w-full px-3 py-1 rounded border border-gray-300"
            />
          </div>
        ))}
      </div>

      {/* 追加ボタン */}
      <div className="flex justify-center">
        <button
          onClick={handleAddRecord}
          className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-6 rounded"
        >
          ＋ 追加
        </button>
      </div>
    </main>
  );
}
