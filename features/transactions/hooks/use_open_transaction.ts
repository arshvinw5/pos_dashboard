import { create } from "zustand";

type OpenAccountState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

//return an object ()
//{} this is a method that returns an object
export const useOpenTransactions = create<OpenAccountState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }), // Set the id when opening
  onClose: () => set({ isOpen: false, id: undefined }),
}));
