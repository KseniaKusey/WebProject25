import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging Tailwind classes with conditionals
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}