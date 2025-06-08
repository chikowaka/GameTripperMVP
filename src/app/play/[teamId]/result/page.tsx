'use client'

import { useRamenStore } from '@/lib/store/ramenStore'
import { useTeamStore } from '@/lib/store/teamStore'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { UserRoundPlus } from 'lucide-react'

export default function CreateTaskPage() {
  const { ramens } = useRamenStore()
  const { members, penalty } = useTeamStore()
  const [losers, setLosers] = useState<{ name: string; count: number; icon?: string }[]>([])
  const [others, setOthers] = useState<{ name: string; count: number; icon?: string }[]>([])

  useEffect(() => {
    const grouped = members.map(member => {
      const related = ramens.filter(r => r.eater === member.name)
      const finishedCount = related.filter(r => r.result === '完食').length
      const gaveUp = related.some(r => r.result === 'ギブアップ')
      return { name: member.name, count: finishedCount, icon: member.icon, gaveUp }
    })

    setLosers(grouped.filter(g => g.gaveUp))
    setOthers(grouped.filter(g => !g.gaveUp))
  }, [members, ramens])

  const renderMember = (member: { name: string; count: number; icon?: string }, isLoser = false) => (
    <div className="flex items-center gap-4 p-3 bg-white rounded-lg shadow">
      <div className={`rounded-full overflow-hidden bg-gray-200 ${isLoser ? 'w-20 h-20' : 'w-12 h-12'}`}>
        {member.icon ? (
          <Image src={member.icon} alt={member.name} width={48} height={48} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <UserRoundPlus size={24} />
          </div>
        )}
      </div>
      <div className={`text-black font-semibold ${isLoser ? 'text-xl' : ''}`}>
        {member.name}：{member.count}杯
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-2xl font-bold text-center mb-6">
        <span className="text-red-500">ラーメン</span>
        <span className="text-blue-500">はしご旅</span>
      </h1>

      <div className="w-full max-w-md space-y-3 mb-6">
        {losers.map((l, i) => (
          <div key={i} className="relative border-2 border-red-400 bg-red-100 rounded-lg shadow-lg p-2">
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg">
              敗者
            </div>
            <div className="text-center text-xl font-bold text-red-700 mb-2">【罰ゲーム】</div>
            <div className="text-center text-black text-lg font-medium mb-3">
              {penalty?.trim() || '罰ゲーム未定'}
            </div>
            {renderMember(l, true)}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md space-y-3">
        {others.map((o, i) => (
          <div key={i}>{renderMember(o)}</div>
        ))}
      </div>
      <div className="mt-10 w-full max-w-md">
        <button
          onClick={() => {
            const confirmed = window.confirm('ゲームを終了しますか？（ラーメンの記録がすべて破棄されます）')
            if (confirmed) {
              localStorage.removeItem('ramen-store')
              window.location.href = '/team/create'
            }
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white w-full py-3 rounded-lg"
        >
          ゲーム終了
        </button>
      </div>
    </main>
  )
}
