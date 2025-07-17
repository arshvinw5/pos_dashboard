import { create } from "zustand";

type OpenCategoryState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

//return an object ()
//{} this is a method that returns an object
export const useOpenCategory = create<OpenCategoryState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }), // Set the id when opening
  onClose: () => set({ isOpen: false, id: undefined }),
}));
