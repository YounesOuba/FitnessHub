import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import GreenFitness from "@/assets/bg/GreenFitness.png";
import Fitness2 from "@/assets/bg/Fitness2.png";
import Fitness3 from "@/assets/bg/Fitness3.png";
import Fitness4 from "@/assets/bg/Fitness4.png";
import Fitness5 from "@/assets/bg/Fitness5.png";
import Fitness6 from "@/assets/bg/Fitness6.png";
import Fitness7 from "@/assets/bg/Fitness7.png";
import Fitness8 from "@/assets/bg/Fitness8.png";
import Fitness9 from "@/assets/bg/Fitness9.png";
import Fitness10 from "@/assets/bg/Fitness10.png";
import Fitness11 from "@/assets/bg/Fitness11.png";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const backgroundImages = [
  GreenFitness,
  Fitness2,
  Fitness3,
  Fitness4,
  Fitness5,
  Fitness6,
  Fitness7,
  Fitness8,
  Fitness9,
  Fitness10,
  Fitness11
]

export const getRandomBackground = () => {
  return backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
}
