'use client'

import AnimatedLine from '../../components/atoms/AnimatedLine'
import PageFace from '../../components/organism/PageFace'
import SkillTimeline from '../../components/organism/SkillTimeline'
import WorkList from '../../components/organism/WorkList'

export default function Page() {
  return (
    <>
      <section>
        <PageFace title="Portfolio" subtitle="" mainMessage={<></>} />
      </section>

      <AnimatedLine />

      <section>
        <h2>Projects</h2>
        <WorkList />
      </section>

      <section>
        <h2>Skills</h2>
        <SkillTimeline />
      </section>
    </>
  )
}
