// 記事の OG 画像を描く。SNS で小さく表示されても読めるよう、タイトルを大きく置き、色は 3 色に絞る。
// フォントと島画像は手元から読む。足りない字形があると next/og がネットへ取りに行くため。

import { AUTHOR_NAME, SITE_NAME } from '@/config/site'
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ARTICLE_OG_IMAGE_SIZE, ogTitleFontSize, toOgTitle } from './ogImage'

const OG_FONT_FAMILY = 'Noto Sans JP'
const OG_FONT_DIR = path.join(
  process.cwd(),
  'node_modules',
  '@fontsource',
  'noto-sans-jp',
  'files',
)
const OG_FONT_FILES = [
  'noto-sans-jp-japanese-700-normal.woff',
  'noto-sans-jp-latin-700-normal.woff',
]
const ISLAND_IMAGE_PATH = path.join(
  process.cwd(),
  'public',
  'images',
  'island.png',
)

// tailwind.config.ts の teal-900 / white / orange / sand
const COLORS = {
  background: '#06332E',
  title: '#FFFFFF',
  accent: '#F59E0B',
  sub: '#F3E9D2',
}

interface OgAssets {
  fonts: Buffer[]
  islandDataUrl: string
}

const readAssets = async (): Promise<OgAssets> => {
  const [fonts, island] = await Promise.all([
    Promise.all(
      OG_FONT_FILES.map((file) => readFile(path.join(OG_FONT_DIR, file))),
    ),
    readFile(ISLAND_IMAGE_PATH),
  ])
  return {
    fonts,
    islandDataUrl: `data:image/png;base64,${island.toString('base64')}`,
  }
}

// 全記事の画像をまとめて書き出すので、ファイルは 1 回だけ読む
let assetsPromise: Promise<OgAssets> | undefined
const loadAssets = (): Promise<OgAssets> => (assetsPromise ??= readAssets())

export const renderArticleOgImage = async (
  title: string,
): Promise<ImageResponse> => {
  const { fonts, islandDataUrl } = await loadAssets()
  const ogTitle = toOgTitle(title)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        backgroundColor: COLORS.background,
        fontFamily: OG_FONT_FAMILY,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            width: 160,
            height: 16,
            borderRadius: 8,
            backgroundColor: COLORS.accent,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            display: 'block',
            lineClamp: 3,
            fontSize: ogTitleFontSize(ogTitle),
            fontWeight: 700,
            lineHeight: 1.3,
            color: COLORS.title,
          }}
        >
          {ogTitle}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          color: COLORS.sub,
          fontSize: 36,
          fontWeight: 700,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og は <img> だけを描ける */}
        <img src={islandDataUrl} width={96} height={96} alt="" />
        <div style={{ display: 'flex' }}>{SITE_NAME}</div>
        <div style={{ display: 'flex' }}>{AUTHOR_NAME}</div>
      </div>
    </div>,
    {
      ...ARTICLE_OG_IMAGE_SIZE,
      fonts: fonts.map((data) => ({
        name: OG_FONT_FAMILY,
        data,
        weight: 700,
        style: 'normal',
      })),
    },
  )
}
