// src/lib/store/ramenStore.ts
import { create } from 'zustand'

export type RamenEntry = {
  id: string
  image: string // base64形式
  member: string
  shop: string
  result: '完食' | 'ギブアップ'
}

type RamenStore = {
  ramenList: RamenEntry[]
  addRamen: (entry: RamenEntry) => void
  updateRamen: (entry: RamenEntry) => void
}

export const useRamenStore = create<RamenStore>((set) => ({
  ramenList: [],
  addRamen: (entry) =>
    set((state) => ({
      ramenList: [...state.ramenList, entry],
    })),
  updateRamen: (entry) =>
    set((state) => ({
      ramenList: state.ramenList.map((e) => (e.id === entry.id ? entry : e)),
    })),
}))
