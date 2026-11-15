'use client'

import type { TankaData, TankaResponse } from '@/types/tanka'
import { motion } from 'framer-motion'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../../../i18n/context'
import AnimatedLine from '../../components/atoms/AnimatedLine'
import TankaSkeleton from '../../components/atoms/TankaSkeleton'
import TankaCard from '../../components/molecules/TankaCard'
import PageFace from '../../components/organisms/PageFace'

// キャッシュ用の型定義（保存する値の型をジェネリクスで受け取る）
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheStore {
  [key: string]: CacheEntry<TankaResponse>
}

// グローバルキャッシュストア
const cacheStore: CacheStore = {}

// キャッシュの有効期限（5分）
const CACHE_DURATION = 5 * 60 * 1000

// キャッシュユーティリティ関数
const getCacheKey = (page: number, limit: number) => `tanka-${page}-${limit}`

const getFromCache = (key: string): TankaResponse | null => {
  const entry = cacheStore[key]
  if (!entry) return null

  const now = Date.now()
  if (now > entry.expiresAt) {
    delete cacheStore[key]
    return null
  }

  return entry.data
}

const setCache = (key: string, data: TankaResponse): void => {
  const now = Date.now()
  cacheStore[key] = {
    data,
    timestamp: now,
    expiresAt: now + CACHE_DURATION,
  }
}

const clearCache = (): void => {
  Object.keys(cacheStore).forEach((key) => {
    if (key.startsWith('tanka-')) {
      delete cacheStore[key]
    }
  })
}

const TANKA_PAGE_LIMIT = 12

const loadTankaPage = async (page: number): Promise<TankaResponse> => {
  const cacheKey = getCacheKey(page, TANKA_PAGE_LIMIT)
  const cachedData = getFromCache(cacheKey)
  if (cachedData) {
    return cachedData
  }

  const response = await fetch(
    `/my_site/api/tanka?page=${page}&limit=${TANKA_PAGE_LIMIT}`,
    {
      headers: {
        'Cache-Control': 'max-age=300', // ブラウザキャッシュも5分
      },
    },
  )
  if (!response.ok) {
    throw new Error('短歌データの取得に失敗しました')
  }

  const data: TankaResponse = await response.json()
  setCache(cacheKey, data)
  return data
}

interface InfiniteScrollState {
  currentPage: number
  totalItems: number
  hasNext: boolean
  isLoading: boolean
  isLoadingMore: boolean
}

// メモ化されたコンポーネント
const MemoizedTankaCard = memo(TankaCard)
const MemoizedTankaSkeleton = memo(TankaSkeleton)

const TankaPage: React.FC = () => {
  const { t } = useI18n()
  const [tankaList, setTankaList] = useState<TankaData[]>([])
  const [scrollState, setScrollState] = useState<InfiniteScrollState>({
    currentPage: 1,
    totalItems: 0,
    hasNext: true,
    isLoading: true,
    isLoadingMore: false,
  })
  const [error, setError] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const scrollStateRef = useRef(scrollState)

  const applyPage = useCallback(
    (data: TankaResponse, page: number, isLoadMore: boolean) => {
      setTankaList((prev) =>
        isLoadMore ? [...prev, ...data.tanka] : data.tanka,
      )
      setScrollState((prev) => ({
        ...prev,
        currentPage: page,
        totalItems: data.pagination.totalItems,
        hasNext: data.pagination.hasNext,
        isLoading: false,
        isLoadingMore: false,
      }))
    },
    [],
  )

  const applyError = useCallback((err: unknown) => {
    setError(
      err instanceof Error ? err.message : '予期しないエラーが発生しました',
    )
    setScrollState((prev) => ({
      ...prev,
      isLoading: false,
      isLoadingMore: false,
    }))
  }, [])

  const fetchTankaData = useCallback(
    async (page: number, isLoadMore: boolean) => {
      setScrollState((prev) =>
        isLoadMore
          ? { ...prev, isLoadingMore: true }
          : { ...prev, isLoading: true },
      )
      setError(null)
      try {
        applyPage(await loadTankaPage(page), page, isLoadMore)
      } catch (err) {
        applyError(err)
      }
    },
    [applyPage, applyError],
  )

  // scrollStateRefを更新
  useEffect(() => {
    scrollStateRef.current = scrollState
  }, [scrollState])

  // 初期データ読み込み。loading とエラーの初期値は useState で済ませてある
  useEffect(() => {
    loadTankaPage(1)
      .then((data) => applyPage(data, 1, false))
      .catch(applyError)
  }, [applyPage, applyError])

  // ページの可視性が変わった時のキャッシュ管理
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // ページが再び表示された時、古いキャッシュをクリア
        const now = Date.now()
        Object.keys(cacheStore).forEach((key) => {
          const entry = cacheStore[key]
          if (entry && now > entry.expiresAt) {
            delete cacheStore[key]
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Intersection Observer設定（最適化）
  const setupObserver = useCallback(() => {
    if (!scrollState.hasNext || scrollState.isLoadingMore) {
      return
    }

    if (!loadMoreRef.current) {
      return
    }

    // 既存のObserverをクリーンアップ
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const currentState = scrollStateRef.current

        if (
          entries[0].isIntersecting &&
          currentState.hasNext &&
          !currentState.isLoadingMore
        ) {
          fetchTankaData(currentState.currentPage + 1, true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px', // より早めに読み込み開始
      },
    )

    observerRef.current = observer
    observer.observe(loadMoreRef.current)
  }, [scrollState.hasNext, scrollState.isLoadingMore, fetchTankaData])

  // Observer設定の実行
  useEffect(() => {
    setupObserver()
  }, [setupObserver])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  if (scrollState.isLoading && scrollState.currentPage === 1) {
    return (
      <>
        <section className="content-wrapper container mx-auto">
          <PageFace title={t.common.tanka} />
        </section>

        <AnimatedLine />

        <section className="content-wrapper container mx-auto">
          {/* スケルトンローディング */}
          <div className="mx-auto mb-12 grid max-w-5xl grid-cols-1 gap-8 px-6 md:grid-cols-2 md:gap-8 md:px-0 lg:grid-cols-3 lg:gap-12">
            {Array.from({ length: 12 }, (_, index) => (
              <MemoizedTankaSkeleton key={index} />
            ))}
          </div>
        </section>
      </>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          className="rounded-2xl bg-white p-8 text-center shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="mb-2 text-2xl font-bold">エラーが発生しました</h2>
          <p className="mb-6">{error}</p>
          <motion.button
            className="rounded-lg bg-main-black px-6 py-3 font-medium text-white transition-shadow hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              clearCache() // キャッシュをクリアしてから再試行
              fetchTankaData(scrollState.currentPage, false)
            }}
          >
            再試行
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <section className="content-wrapper container mx-auto">
        <PageFace title={t.common.tanka} />
      </section>

      <AnimatedLine />

      <section className="content-wrapper container mx-auto">
        {tankaList.length === 0 ? (
          <motion.div
            className="py-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="mb-2 text-2xl font-bold">短歌がまだありません</h2>
            <p>短歌収集システムが動作すると、ここに短歌が表示されます。</p>
          </motion.div>
        ) : (
          <>
            {/* 短歌カードグリッド */}
            <div className="mx-auto mb-12 grid max-w-5xl grid-cols-1 gap-8 px-6 md:grid-cols-2 md:gap-8 md:px-0 lg:grid-cols-3 lg:gap-12">
              {tankaList.map((tanka, index) => (
                <MemoizedTankaCard
                  key={tanka.id} // indexを削除してidのみ使用
                  tanka={tanka.tanka}
                  createdAt={tanka.createdAt}
                  index={index}
                  tags={tanka.tags}
                  tweetId={tanka.tweetId}
                />
              ))}
            </div>

            {/* 無限スクロール用のローディング要素 */}
            {scrollState.hasNext && (
              <div
                ref={(el) => {
                  loadMoreRef.current = el
                  // refが設定された後にObserverを設定
                  if (el) {
                    // requestAnimationFrameを使用してより効率的に
                    requestAnimationFrame(() => setupObserver())
                  }
                }}
                className="py-8"
              >
                {scrollState.isLoadingMore ? (
                  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 md:grid-cols-2 md:gap-8 md:px-0 lg:grid-cols-3 lg:gap-12">
                    {Array.from(
                      { length: 3 },
                      (
                        _,
                        index, // スケルトン数を削減
                      ) => (
                        <MemoizedTankaSkeleton key={`loading-${index}`} />
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p>スクロールして続きを読み込む</p>
                  </div>
                )}
              </div>
            )}

            {/* 全データ読み込み完了 */}
            {!scrollState.hasNext && tankaList.length > 0 && (
              <motion.div
                className="py-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p>すべての短歌を表示しました</p>
              </motion.div>
            )}
          </>
        )}
      </section>
    </>
  )
}

export default TankaPage
