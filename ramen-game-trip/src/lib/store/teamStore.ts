// lib/store/teamStore.ts
import { create } from 'zustand';

type Member = {
  name: string;
  color?: string;
};

type TeamStore = {
  teamName: string;
  setTeamName: (name: string) => void;
  members: Member[];
  addMember: (name: string) => void;
};

export const useTeamStore = create<TeamStore>((set) => ({
  teamName: '',
  setTeamName: (name) => set({ teamName: name }),
  members: [],
  addMember: (name) =>
    set((state) => ({
      members: [...state.members, { name, color: getRandomColor() }],
    })),
}));

const colors = ['bg-pink-300', 'bg-yellow-200', 'bg-blue-200', 'bg-green-200'];
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
