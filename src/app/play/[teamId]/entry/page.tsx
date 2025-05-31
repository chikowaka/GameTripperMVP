'use client'

import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useRamenStore } from '@/lib/store/ramenStore'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function RamenEntryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const teamId = params?.teamId as string
  const ramenId = searchParams.get('id')
  const { ramens = [], updateRamen } = useRamenStore()

  const [ramen, setRamen] = useState(null)
  const [image, setImage] = useState<string | null>(null)
  const [eater, setEater] = useState('')
  const [shop, setShop] = useState('')

  useEffect(() => {
    if (ramenId && ramens.length > 0) {
      const found = ramens.find(r => r.id === ramenId)
      if (found) {
        setRamen(found)
        setImage(found.image || null)
        setEater(found.eater || '')
        setShop(found.shop || '')
      }
    }
  }, [ramens, ramenId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleResult = (result: '完食' | 'ギブアップ') => {
    if (!ramen) return
    updateRamen({ ...ramen, image, eater, shop, result })
    if (result === '完食') router.push(`/play/${teamId}/entry?id=${ramen.id}`)
  }

  const handleBack = () => {
    if (!ramen) return
    updateRamen({ ...ramen, image, eater, shop })
    router.push(`/play/${teamId}`)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">ラーメン編集画面</h1>

      {image ? (
        <Image
          src={image}
          alt="Ramen"
          width={200}
          height={200}
          className="mx-auto rounded-md mb-4"
        />
      ) : (
        <div className="w-full text-center text-gray-500 mb-4">画像がありません</div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">画像をアップロード</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>

      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">食べる人</label>
          <input
            type="text"
            value={eater}
            onChange={(e) => setEater(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ラーメン店名</label>
          <input
            type="text"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white text-black"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          className="w-full max-w-sm text-lg py-6"
          onClick={() => handleResult('完食')}
        >
          完食
        </Button>
        <Button
          variant="secondary"
          className="w-full max-w-sm text-lg py-6"
          onClick={() => handleResult('ギブアップ')}
        >
          ギブアップ
        </Button>
        <Button
          variant="outline"
          className="w-full max-w-sm text-lg py-6"
          onClick={handleBack}
        >
          もどる
        </Button>
      </div>
    </div>
  )
}
