import {
  Apple,
  Beer,
  BookOpen,
  CloudRain,
  Dog,
  MessageCircle,
  Sparkles,
  Sun,
} from 'lucide-react'

import type { StatItem } from '../types'

// Fun Stats（タップで裏返るフリップカード）の表示データ。
export const STATS: StatItem[] = [
  { icon: BookOpen, label: 'Classes Taken', value: '512 Hours' },
  { icon: Beer, label: 'Beers Consumed', value: '112 Bottles' },
  { icon: CloudRain, label: 'Typhoons Encountered', value: '3' },
  { icon: Apple, label: 'Watermelons Eaten', value: '34 Slices' },
  { icon: Sparkles, label: 'Favorite Phrase', value: '"once in a blue moon"' },
  {
    icon: MessageCircle,
    label: 'Hardest Word to Pronounce',
    value: '"walk / work"',
  },
  { icon: Sun, label: 'SUNBURN LEVEL', value: 'well-done' },
  { icon: Dog, label: 'STREET DOGS THAT IGNORED ME', value: '256 Dogs' },
]
