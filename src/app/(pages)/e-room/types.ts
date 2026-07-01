import type { LucideIcon } from 'lucide-react'
import type { StaticImageData } from 'next/image'

export type SkillType =
  | 'Overall'
  | 'Listening'
  | 'Reading'
  | 'Writing'
  | 'Speaking'

export interface ScoreTest {
  date: string
  Overall: number
  Listening: number
  Reading: number
  Writing: number
  Speaking: number
}

export interface ScoreChartConfig {
  title: string
  tests: ScoreTest[]
  colors: Record<SkillType, string>
  minScore: number
  maxScore: number
  gridLines: number[]
  labels: number[]
  targetScore: number
  labelDecimals: number
}

export interface StatItem {
  icon: LucideIcon
  label: string
  value: string
}

export type PhotoRows = StaticImageData[][]
