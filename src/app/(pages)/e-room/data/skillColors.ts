import type { SkillType } from '../types'

// IELTS / Duolingo 両チャートで共通のスキル別カラー。
export const SKILL_COLORS: Record<SkillType, string> = {
  Overall: '#008080', // Teal
  Listening: '#4A90E2', // Blue
  Reading: '#50C878', // Green
  Writing: '#FF8C00', // Orange
  Speaking: '#9B59B6', // Purple
}
