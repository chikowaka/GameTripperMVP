// lib/store/teamStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Member = {
  name: string
  icon?: string
  color?: string
  ramenCount?: number
}

type TeamState = {
  teamName: string
  members: Member[]
  penalty: string
  setTeamName: (name: string) => void
  setPenalty: (penalty: string) => void
  addMember: (member: Member) => void
  removeMember: (name: string) => void
  resetTeam: () => void
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      teamName: '',
      members: [],
      penalty: '',
      setTeamName: (name) => set({ teamName: name }),
      setPenalty: (penalty) => set({ penalty }),
      addMember: (member) =>
        set((state) => ({
          members: [
            ...state.members,
            {
              ...member,
              color: member.color ?? getRandomColor(),
            },
          ],
        })),
      removeMember: (name: string) =>
        set((state) => ({
          members: state.members.filter((member) => member.name !== name),
        })),
      resetTeam: () => set({ teamName: '', members: [], penalty: '' }),
    }),
    {
      name: 'team-store',
    }
  )
)

const colors = ['bg-pink-300', 'bg-yellow-200', 'bg-blue-200', 'bg-green-200']
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}
