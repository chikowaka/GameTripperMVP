// src/lib/store/ramenStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type RamenEntry = {
  id: string
  image: string
  eater: string
  shop: string
  result?: string
}

type RamenState = {
  ramens: RamenEntry[]
  addRamen: (entry: RamenEntry) => void
  updateRamen: (entry: RamenEntry) => void
}

export const useRamenStore = create<RamenState>()(
  persist(
    (set) => ({
      ramens: [],
      addRamen: (entry) =>
        set((state) => ({
          ramens: [...state.ramens, entry],
        })),
      updateRamen: (entry) =>
        set((state) => ({
          ramens: state.ramens.map((r) =>
            r.id === entry.id ? entry : r
          ),
        })),
    }),
    {
      name: 'ramen-store', // localStorageのキー名
    }
  )
)
