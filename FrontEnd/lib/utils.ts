import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const adjectives = ['Wise', 'Clever', 'Gentle', 'Night', 'Swift', 'Brave', 'Calm', 'Eager', 'Fierce', 'Jolly']
const animals = ['Fox', 'Owl', 'Raccoon', 'Otter', 'Bear', 'Wolf', 'Deer', 'Hawk', 'Lynx', 'Hare']

export function generateRandomUsername(): string {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)]
  return `${randomAdjective}_${randomAnimal}`
}