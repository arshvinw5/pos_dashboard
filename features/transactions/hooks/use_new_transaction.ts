import { create } from "zustand";

type NewTransactionState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

//return an object ()
//{} this is a method that returns an object
export const useNewTransaction = create<NewTransactionState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
