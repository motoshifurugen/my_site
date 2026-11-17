// 進み先の計算に要る形だけを受け取り、テストで偽の章を渡せるようにする
type ProgressChapter = {
  scenes: readonly { lines: readonly unknown[] }[]
}

type ScenePosition = { chapterIndex: number; sceneIndex: number }

type ClickResult =
  | { type: 'nextLine'; lineIndex: number }
  | { type: 'ending' }
  | { type: 'startTransition' }
  | { type: 'none' }

const CHAPTER6_INDEX = 5

export const getNextScenePosition = (
  chapters: readonly ProgressChapter[],
  chapterIndex: number,
  sceneIndex: number,
): ScenePosition | null => {
  const chapter = chapters[chapterIndex]
  if (!chapter) return null
  if (sceneIndex < chapter.scenes.length - 1) {
    return { chapterIndex, sceneIndex: sceneIndex + 1 }
  }
  if (chapterIndex < chapters.length - 1) {
    return { chapterIndex: chapterIndex + 1, sceneIndex: 0 }
  }
  return null
}

export const getClickResult = (
  chapters: readonly ProgressChapter[],
  chapterIndex: number,
  sceneIndex: number,
  lineIndex: number,
): ClickResult => {
  const chapter = chapters[chapterIndex]
  const scene = chapter?.scenes[sceneIndex]
  if (!scene) return { type: 'none' }
  if (lineIndex < scene.lines.length - 1) {
    return { type: 'nextLine', lineIndex: lineIndex + 1 }
  }
  // エンディングは章の数ではなく第6章かどうかで決めるので、遷移の判定より先に見る
  if (
    chapterIndex === CHAPTER6_INDEX &&
    sceneIndex === chapter.scenes.length - 1
  ) {
    return { type: 'ending' }
  }
  if (getNextScenePosition(chapters, chapterIndex, sceneIndex)) {
    return { type: 'startTransition' }
  }
  return { type: 'none' }
}
