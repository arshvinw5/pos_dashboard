import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//function to convert amount -> milliunit to store in database
export function amountToMilliunit(amount: number): number {
  return Math.round(amount * 1000);
}

//function to convert milliunit -> amount o store in database
export function milliunitsToAmount(number: number): number {
  return number / 1000;
}
