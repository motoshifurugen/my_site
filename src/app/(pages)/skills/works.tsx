// works.ts
import { ReactElement } from 'react'
import { BiLinkExternal } from 'react-icons/bi'
import { useI18n } from '../../../i18n/context'

type Work = {
  src: string
  alt: string
  title: string | ReactElement
  description: string
  tags: string[]
  date: string
}

export const useWorks = () => {
  const { t } = useI18n()
  
  const works: Work[] = [
    {
      src: '/images/works/work_01.png',
      alt: 'work01',
      title: t.skills.works.work01.title,
      description: t.skills.works.work01.description,
      tags: ['Vue.js', 'Laravel'],
      date: '2022-12',
    },
    {
      src: '/images/works/work_02.png',
      alt: 'work02',
      title: t.skills.works.work02.title,
      description: t.skills.works.work02.description,
      tags: ['WordPress'],
      date: '2023-01',
    },
    {
      src: '/images/works/work_03.png',
      alt: 'work03',
      title: t.skills.works.work03.title,
      description: t.skills.works.work03.description,
      tags: ['HTML', 'CSS'],
      date: '2020-12',
    },
    {
      src: '/images/works/hackathon_01.png',
      alt: 'hackathon01',
      title: t.skills.works.hackathon01.title,
      description: t.skills.works.hackathon01.description,
      tags: ['Vue.js', 'Docker', t.skills.tags.teamDevelopment],
      date: '2021-05',
    },
    {
      src: '/images/works/hackathon_02.png',
      alt: 'hackathon02',
      title: t.skills.works.hackathon02.title,
      description: t.skills.works.hackathon02.description,
      tags: ['Laravel', 'Docker', t.skills.tags.teamDevelopment],
      date: '2021-10',
    },
    {
      src: '/images/works/hackathon_03.png',
      alt: 'hackathon03',
      title: t.skills.works.hackathon03.title,
      description: t.skills.works.hackathon03.description,
      tags: ['Laravel', 'Python', t.skills.tags.teamDevelopment],
      date: '2021-05',
    },
    {
      src: '/images/works/hobby_01.png',
      alt: 'hobby01',
      title: t.skills.works.hobby01.title,
      description: t.skills.works.hobby01.description,
      tags: ['Vue.js', t.skills.tags.personalDevelopment],
      date: '2021-11',
    },
    {
      src: '/images/works/hobby_02.png',
      alt: 'hobby02',
      title: t.skills.works.hobby02.title,
      description: t.skills.works.hobby02.description,
      tags: ['HTML', 'CSS', t.skills.tags.personalDevelopment],
      date: '2023-05',
    },
    {
      src: '/images/works/hobby_03.png',
      alt: 'hobby03',
      title: t.skills.works.hobby03.title,
      description: t.skills.works.hobby03.description,
      tags: ['Vue.js', t.skills.tags.personalDevelopment],
      date: '2023-08',
    },
    {
      src: '/images/works/hobby_04.png',
      alt: 'hobby04',
      title: t.skills.works.hobby04.title,
      description: t.skills.works.hobby04.description,
      tags: ['Unity', t.skills.tags.personalDevelopment],
      date: '2021-08',
    },
    {
      src: '/images/works/hobby_05.png',
      alt: 'hobby05',
      title: t.skills.works.hobby05.title,
      description: t.skills.works.hobby05.description,
      tags: ['React', 'Next.js', 'Vercel'],
      date: '2025-01',
    },
    {
      src: '/images/works/work_04.png',
      alt: 'work04',
      title: (
        <a
          href="https://kobayashi2103.co.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1"
        >
          {t.skills.works.work04.title}
          <BiLinkExternal className="inline-block" />
        </a>
      ),
      description: t.skills.works.work04.description,
      tags: ['Figma', 'Next.js', 'Vercel'],
      date: '2025-03',
    },
    {
      src: '/images/works/hobby_06.png',
      alt: 'hobby06',
      title: (
        <a
          href="https://apps.apple.com/us/app/hugmi-%E3%83%8F%E3%82%B0%E3%83%9F%E3%83%BC/id6745621864"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1"
        >
          {t.skills.works.hobby06.title}
          <BiLinkExternal className="inline-block" />
        </a>
      ),
      description: t.skills.works.hobby06.description,
      tags: ['React Native', 'Expo', t.skills.tags.cursorDevelopment],
      date: '2025-05',
    },
  ]

  // 日付で降順ソート
  const sortedWorks = works.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })

  return sortedWorks
}
