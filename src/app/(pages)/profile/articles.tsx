import { useI18n } from '../../../i18n/context'

const useHistory = () => {
  const { t } = useI18n()

  return [
    { year: t.profile.career[1998], description: t.profile.career.desc1998 },
    { year: t.profile.career[2017], description: t.profile.career.desc2017 },
    { year: t.profile.career[2020], description: t.profile.career.desc2020 },
    { year: t.profile.career[2021], description: t.profile.career.desc2021 },
    { year: t.profile.career[2023], description: t.profile.career.desc2023 },
    {
      year: t.profile.career.current,
      description: t.profile.career.descCurrent,
    },
  ]
}

export const useArticles = () => {
  const { t } = useI18n()
  const history = useHistory()

  return [
    {
      title: t.profile.career.title,
      content: (
        <div className="flex flex-col space-y-4 md:space-y-0">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-start"
            >
              <p className="mr-6 text-left">{item.year}</p>
              <p className="pl-2 md:pl-0">{item.description}</p>
            </div>
          ))}
        </div>
      ),
      imageSrc: '/images/profile_01.jpg',
      imageAlt: 'profile img 01',
    },
    {
      title: t.profile.interest.title,
      content: <p>{t.profile.interest.content}</p>,
      imageSrc: '/images/profile_02.png',
      imageAlt: 'profile img 02',
    },
    {
      title: t.profile.passion.title,
      content: (
        <ul>
          <li>{t.profile.passion.reading}</li>
          <li>{t.profile.passion.tanka}</li>
          <li>{t.profile.passion.walking}</li>
          <li>{t.profile.passion.driving}</li>
          <li>{t.profile.passion.eisa}</li>
          <li>{t.profile.passion.guitar}</li>
          <li>{t.profile.passion.baseball}</li>
          <li>{t.profile.passion.darts}</li>
          <li>{t.profile.passion.bowling}</li>
        </ul>
      ),
      imageSrc: '/images/profile_03.jpg',
      imageAlt: 'profile img 03',
    },
    {
      title: t.profile.mbti.title,
      content: (
        <p>
          <strong>{t.profile.mbti.type}</strong>
          {t.profile.mbti.typeName}
          <br />
          <br />
          {t.profile.mbti.introvert}
          <br />
          {t.profile.mbti.intuitive}
          <br />
          {t.profile.mbti.feeling}
          <br />
          {t.profile.mbti.prospecting}
          <br />
          {t.profile.mbti.assertive}
        </p>
      ),
      imageSrc: '/images/profile_04.jpg',
      imageAlt: 'profile img 04',
    },
  ]
}
