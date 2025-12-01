'use client'

import { useI18n } from '../../../i18n/context'
import AnimatedLine from '../../components/atoms/AnimatedLine'
import PageFace from '../../components/organisms/PageFace'
import SkillTimeline from '../../components/organisms/SkillTimeline'
import WorkList from '../../components/organisms/WorkList'

export default function Page() {
  const { t } = useI18n()

  return (
    <>
      <section>
        <PageFace title={t.skills.title} subtitle="" mainMessage={<></>} />
      </section>

      <AnimatedLine />

      <section>
        <h2>{t.skills.projects}</h2>
        <WorkList />
      </section>

      <section>
        <h2>{t.skills.skills}</h2>
        <SkillTimeline />
      </section>
    </>
  )
}
