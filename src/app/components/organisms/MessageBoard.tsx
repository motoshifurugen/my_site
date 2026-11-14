'use client'

import { useI18n } from '@/i18n'
import { announcementsData, type AnnouncementData } from './MessageData'

// カテゴリごとのバッジ配色（淡色地＋濃色文字、ダークモード対応）。
// blogUpdate=teal 系 / notification=orange 系で視覚的に区別する。
const categoryBadgeClasses: Record<AnnouncementData['categoryKey'], string> = {
  blogUpdate:
    'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-night-teal',
  notification:
    'bg-orange-50 text-orange-800 dark:bg-night-orange/20 dark:text-night-orange',
}

const MessageBoard = () => {
  const { t } = useI18n()

  // 下地は空色（#86B3E0）。白 40% を重ね、日付・本文・リンクの文字を 4.5:1 以上にする。
  return (
    <div className="my-20 rounded-md bg-white/40 p-4 dark:bg-night-black/50">
      <h3 className="mb-2 select-none">{t.announcements.title}</h3>
      <ul className="m-0 list-none p-0">
        {announcementsData.map((announcement, index) => (
          <li key={index}>
            <div className="flex select-none flex-wrap items-center gap-x-4 gap-y-1 rounded-md p-4 text-main-black transition-colors hover:bg-main-black/5 dark:text-night-white dark:hover:bg-night-white/5 md:flex-nowrap">
              <p className="m-0 min-w-20 text-xs tabular-nums text-main-black dark:text-night-white/80">
                {announcement.date}
              </p>
              <p className="m-0">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-center text-xs font-medium leading-none ${categoryBadgeClasses[announcement.categoryKey]}`}
                >
                  {t.announcements.categories[announcement.categoryKey]}
                </span>
              </p>
              <p className="m-0 mt-2 w-full text-base md:mt-0">
                {t.announcements.items[announcement.titleKey].title}
                {announcement.link && (
                  <>
                    {' '}
                    <a
                      href={announcement.link.url}
                      className="text-teal-700 underline dark:text-night-teal"
                    >
                      {
                        t.announcements.items[announcement.link.textKey]
                          .linkText
                      }
                    </a>
                  </>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MessageBoard
