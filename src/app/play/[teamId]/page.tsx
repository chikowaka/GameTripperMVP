'use client'

import { useRouter } from 'next/navigation'
import { useTeamStore } from '@/lib/store/teamStore'
import { useRamenStore } from '@/lib/store/ramenStore'
import { Button } from '@/components/ui/button'
import { PlusIcon, Soup, UserRoundPlus, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

export default function PlayTopPage({ params }: { params: { teamId: string } }) {
  const router = useRouter()
  const { members } = useTeamStore()
  const { ramens = [], addRamen, removeRamen } = useRamenStore()

  const [showForm, setShowForm] = useState(false)
  const [eater, setEater] = useState('')
  const [shop, setShop] = useState('')

  const [swipedIndex, setSwipedIndex] = useState<number | null>(null)
  const startXRef = useRef<number | null>(null)

  // スワイプ外タップで戻すためのイベントリスナー登録
  useEffect(() => {
    const handleOutsideClick = () => {
      if (swipedIndex !== null) setSwipedIndex(null)
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [swipedIndex])

  const handleAddRamen = () => {
    if (eater && shop) {
      addRamen({ id: Date.now().toString(), eater, shop, image: '' })
      setEater('')
      setShop('')
      setShowForm(false)
    }
  }

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    startXRef.current = e.touches[0].clientX
    console.log(index)
  }

  const handleTouchEnd = (e: React.TouchEvent, index: number) => {
    if (startXRef.current === null) return
    const endX = e.changedTouches[0].clientX
    const diffX = startXRef.current - endX

    if (diffX > 30) {
      setSwipedIndex(index)
    } else if (diffX < -30 && swipedIndex === index) {
      setSwipedIndex(null) // 右スワイプで戻す
    } else {
      router.push(`/play/${params.teamId}/entry?id=${ramens[index].id}`)
    }
    startXRef.current = null
  }

  return (
    <main
      className="flex flex-col items-center min-h-screen bg-white p-4"
      onClick={(e) => {
        // リスト外クリックで戻す（バブリング対策に target を確認）
        if ((e.target as HTMLElement).closest('.ramen-item') === null) {
          setSwipedIndex(null)
        }
      }}
    >
      <h1 className="text-2xl font-bold text-center mb-4">
        <span className="text-red-500">ラーメン</span>
        <span className="text-blue-500">はしご旅</span>
      </h1>

      <div className="flex gap-4 mb-6">
        {members.map((member, index) => {
          const count = ramens.filter((r) => r.eater === member.name).length
          return (
            <div key={index} className="flex flex-col items-center">
              <div className="text-black text-sm font-bold mb-1">{count}杯</div>
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {member.icon ? (
                  <Image src={member.icon} alt={member.name} width={48} height={48} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <UserRoundPlus size={24} />
                  </div>
                )}
              </div>
              <div className="text-black text-xs mt-1">{member.name}</div>
            </div>
          )
        })}
      </div>

      <h2 className="text-lg font-semibold text-black mb-2">ラーメンリスト</h2>

      <div className="w-full max-w-md space-y-2 mb-6">
        {ramens.map((ramen, index) => (
          <div key={index} className="relative ramen-item">
            <div
              className={`flex items-center justify-between bg-yellow-100 rounded-xl shadow-md p-3 transition-transform duration-300 cursor-pointer hover:opacity-90 ${swipedIndex === index ? '-translate-x-20' : 'translate-x-0'}`}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchEnd={(e) => handleTouchEnd(e, index)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {ramen.image ? (
                    <Image src={ramen.image} alt="ramen" width={48} height={48} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <Soup size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-black font-bold">{ramen.eater}</div>
                  <div className="text-black">{ramen.shop}</div>
                </div>
              </div>
              <Pencil className="w-5 h-5 text-gray-500" />
            </div>
            {swipedIndex === index && (
              <button
                className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 text-white flex items-center justify-center rounded-r-xl"
                onClick={() => removeRamen(ramen.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <Button onClick={() => setShowForm(true)} className="bg-blue-300 text-black px-6 py-2 rounded-full">
        <PlusIcon className="mr-2" /> ラーメンを追加
      </Button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-center mb-4">ラーメン追加フォーム</h3>
            <div className="mb-4">
              <label className="block text-black mb-1">食べる人</label>
              <select
                value={eater}
                onChange={(e) => setEater(e.target.value)}
                className="w-full p-2 border rounded text-black"
              >
                <option value="">選択してください</option>
                {members.map((m, i) => (
                  <option key={i} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-black mb-1">ラーメン店名</label>
              <input
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                className="w-full p-2 border rounded text-black"
                placeholder="ラーメン屋の名前"
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={handleAddRamen} className="flex-1 bg-green-500 text-white">完了</Button>
              <Button onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 text-black">キャンセル</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}


// 'use client'

// import { useRouter } from 'next/navigation'
// import { useTeamStore } from '@/lib/store/teamStore'
// import { useRamenStore } from '@/lib/store/ramenStore'
// import { Button } from '@/components/ui/button'
// import { PlusIcon, Soup, UserRoundPlus, Pencil, Trash2 } from 'lucide-react'
// import Image from 'next/image'
// import { useState, useRef, useEffect } from 'react'

// export default function PlayTopPage({ params }: { params: { teamId: string } }) {
//   const router = useRouter()
//   const { members } = useTeamStore()
//   const { ramens = [], addRamen, removeRamen } = useRamenStore()

//   // 追加フォームの表示状態
//   const [showForm, setShowForm] = useState(false)
//   const [eater, setEater] = useState('') // 入力フォーム：食べる人
//   const [shop, setShop] = useState('')   // 入力フォーム：ラーメン店名

//   const [swipedIndex, setSwipedIndex] = useState<number | null>(null) // 現在スワイプされているリスト項目
//   const startXRef = useRef<number | null>(null) // スワイプ開始位置

//   // ラーメンリストに新規エントリを追加
//   const handleAddRamen = () => {
//     if (eater && shop) {
//       addRamen({ id: Date.now().toString(), eater, shop, image: '' })
//       setEater('')
//       setShop('')
//       setShowForm(false)
//     }
//   }

//   // スワイプ開始位置を記録
//   const handleTouchStart = (e: React.TouchEvent, index: number) => {
//     startXRef.current = e.touches[0].clientX
//   }

//   // スワイプ終了時の位置と差分を比較してスライド／遷移を分岐
//   const handleTouchEnd = (e: React.TouchEvent, index: number) => {
//     if (startXRef.current === null) return
//     const endX = e.changedTouches[0].clientX
//     const diffX = startXRef.current - endX

//     if (diffX > 30) {
//       setSwipedIndex(index) // スライドと判定された場合、該当行の削除ボタンを表示
//     } else {
//       router.push(`/play/${params.teamId}/entry?id=${ramens[index].id}`) // タップだった場合は編集ページへ遷移
//     }
//     startXRef.current = null
//   }

//   return (
//     <main className="flex flex-col items-center min-h-screen bg-white p-4">
//       <h1 className="text-2xl font-bold text-center mb-4">
//         <span className="text-red-500">ラーメン</span>
//         <span className="text-blue-500">はしご旅</span>
//       </h1>

//       {/* メンバー一覧の表示。各メンバーの食べた杯数を集計して表示 */}
//       <div className="flex gap-4 mb-6">
//         {members.map((member, index) => {
//           const count = ramens.filter((r) => r.eater === member.name).length
//           return (
//             <div key={index} className="flex flex-col items-center">
//               <div className="text-black text-sm font-bold mb-1">{count}杯</div>
//               <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
//                 {member.icon ? (
//                   <Image src={member.icon} alt={member.name} width={48} height={48} />
//                 ) : (
//                   <div className="flex items-center justify-center h-full text-gray-500">
//                     <UserRoundPlus size={24} />
//                   </div>
//                 )}
//               </div>
//               <div className="text-black text-xs mt-1">{member.name}</div>
//             </div>
//           )
//         })}
//       </div>

//       {/* ラーメンリストタイトル */}
//       <h2 className="text-lg font-semibold text-black mb-2">ラーメンリスト</h2>

//       {/* ラーメンリストの描画：タップで遷移、スワイプで削除表示 */}
//       <div className="w-full max-w-md space-y-2 mb-6">
//         {ramens.map((ramen, index) => (
//           <div key={index} className="relative">
//             <div
//               className={`flex items-center justify-between bg-yellow-100 rounded-xl shadow-md p-3 transition-transform duration-300 cursor-pointer hover:opacity-90 ${swipedIndex === index ? '-translate-x-20' : 'translate-x-0'}`}
//               onTouchStart={(e) => handleTouchStart(e, index)}
//               onTouchEnd={(e) => handleTouchEnd(e, index)}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
//                   {ramen.image ? (
//                     <Image src={ramen.image} alt="ramen" width={48} height={48} />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-gray-500">
//                       <Soup size={24} />
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <div className="text-black font-bold">{ramen.eater}</div>
//                   <div className="text-black">{ramen.shop}</div>
//                 </div>
//               </div>
//               <Pencil className="w-5 h-5 text-gray-500" />
//             </div>
//             {swipedIndex === index && (
//               <button
//                 className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 text-white flex items-center justify-center rounded-r-xl"
//                 onClick={() => removeRamen(ramen.id)}
//               >
//                 <Trash2 className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* ラーメン追加ボタン（押すと入力フォームが表示される） */}
//       <Button onClick={() => setShowForm(true)} className="bg-blue-300 text-black px-6 py-2 rounded-full">
//         <PlusIcon className="mr-2" /> ラーメンを追加
//       </Button>

//       {/* ラーメン追加フォーム（モーダル） */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
//             <h3 className="text-xl font-bold text-center mb-4">ラーメン追加フォーム</h3>
//             <div className="mb-4">
//               <label className="block text-black mb-1">食べる人</label>
//               <select
//                 value={eater}
//                 onChange={(e) => setEater(e.target.value)}
//                 className="w-full p-2 border rounded text-black"
//               >
//                 <option value="">選択してください</option>
//                 {members.map((m, i) => (
//                   <option key={i} value={m.name}>{m.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-6">
//               <label className="block text-black mb-1">ラーメン店名</label>
//               <input
//                 value={shop}
//                 onChange={(e) => setShop(e.target.value)}
//                 className="w-full p-2 border rounded text-black"
//                 placeholder="ラーメン屋の名前"
//               />
//             </div>
//             <div className="flex gap-4">
//               <Button onClick={handleAddRamen} className="flex-1 bg-green-500 text-white">完了</Button>
//               <Button onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 text-black">キャンセル</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   )
// }

