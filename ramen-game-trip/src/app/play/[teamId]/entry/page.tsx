'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useTeamStore } from '@/lib/store/teamStore'
import { useRamenStore } from '@/lib/store/ramenStore'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'

export default function EntryPage({ params }: { params: { teamId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') ?? ''

  const { members } = useTeamStore()
  const { ramenList, addRamen, updateRamen } = useRamenStore()

  const existingEntry = ramenList.find((entry) => entry.id === id)

  const [image, setImage] = useState(existingEntry?.image || '')
  const [member, setMember] = useState(existingEntry?.member || '')
  const [shop, setShop] = useState(existingEntry?.shop || '')
  const [result, setResult] = useState<'完食' | 'ギブアップ'>(existingEntry?.result || '完食')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    const entry = {
      id: id || uuidv4(),
      image,
      member,
      shop,
      result,
    }
    if (id) {
      updateRamen(entry)
    } else {
      addRamen(entry)
    }
    router.push(`/play/${params.teamId}`)
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center text-black">ラーメン記録</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">写真をアップロード</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && (
          <Image
            src={image}
            alt="ラーメン画像"
            width={300}
            height={200}
            className="rounded mt-2"
          />
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">食べた人</label>
        <select
          value={member}
          onChange={(e) => setMember(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black"
        >
          <option value="">選択してください</option>
          {members.map((m, index) => (
            <option key={index} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">ラーメン店名</label>
        <input
          type="text"
          value={shop}
          onChange={(e) => setShop(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">結果</label>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => {
              setResult('完食')
              handleSubmit()
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            完食
          </Button>
          <Button
            onClick={() => {
              setResult('ギブアップ')
              handleSubmit()
            }}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            ギブアップ
          </Button>
        </div>
      </div>

      <div className="pt-4 text-center">
        <Button
          variant="outline"
          onClick={() => router.push(`/play/${params.teamId}`)}
        >
          もどる
        </Button>
      </div>
    </div>
  )
}
