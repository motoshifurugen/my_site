'use client'

import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import IntroOverlay from './components/IntroOverlay'
import PageFooter from './components/PageFooter'
import Section from './components/Section'
import StatCard from './components/StatCard'
import { DUOLINGO_CHART } from './data/duolingo'
import { IELTS_CHART } from './data/ielts'
import { FIRST_PHOTO_ROWS, SECOND_PHOTO_ROWS } from './data/photoRows'
import { STATS } from './data/stats'

// 重い演出（rAF スクロールの写真ロール, アニメーション付き SVG チャート）は
// 初回 JS バンドルから外し、イントロ後にのみ遅延ロードする（Issue #162 要件#3）。
const PhotoFilmRoll = dynamic(() => import('./components/PhotoFilmRoll'), {
  ssr: false,
})
const ScoreChart = dynamic(() => import('./components/ScoreChart'), {
  ssr: false,
})

export default function ThankYouPage() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="min-h-screen bg-main-white font-sans text-main-black dark:bg-night-black dark:text-night-white">
      <AnimatePresence>
        {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <main className="mx-auto max-w-md overflow-hidden pb-20 pt-12">
          {/* Header */}
          <Section className="text-center !mb-4">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-teal">
              <div>
                {'Memories'.split('').map((char, index) => (
                  <motion.span
                    key={`line1-${index}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 12,
                      delay: index * 0.1,
                    }}
                    style={{
                      display: 'inline-block',
                      color: index === 0 ? '#C0CA33' : undefined,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              <div>
                {'in the Philippines'.split('').map((char, index) => (
                  <motion.span
                    key={`line2-${index}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 12,
                      delay: ('Memories'.length + 1 + index) * 0.1,
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    {char === ' ' ? ' ' : char}
                  </motion.span>
                ))}
              </div>
            </h1>
            <p className="text-lg text-main-black/80 dark:text-night-white/80">
              A record of my 113-day treasure.
            </p>
          </Section>

          {/* Message Card */}
          <Section className="!px-0">
            <div className="relative px-6 py-8 md:px-8">
              <div className="relative">
                <h2 className="mb-6 text-xl font-bold text-teal dark:text-night-teal">
                  Dear Teachers & Friends
                </h2>

                <div className="space-y-4 leading-relaxed text-main-black dark:text-night-white">
                  <p>
                    Thank you so much for everything. Time has flown by so
                    quickly.
                  </p>
                  <p>
                    Since it was my first time going abroad, I had second
                    thoughts:
                    <br></br>
                    ・Whether I could adapt to the climate and culture.<br></br>
                    ・Whether I could build good relationships with teachers and
                    friends.<br></br>
                    ・Whether I could improve my English skills.<br></br>
                    Honestly speaking, there were moments when I wanted to throw
                    in the towel.
                    <strong>
                      But you gave me a hand through thick and thin.
                    </strong>
                  </p>
                  <p>
                    <strong>
                      Not only did I enjoy learning, but I also felt like I was
                      in seventh heaven because of the people I&apos;ve met and
                      the experiences I&apos;ve gained.
                    </strong>
                    <br />
                    Now, I don&apos;t feel nervous about English anymore.
                  </p>
                  <p>
                    I&apos;ll keep hitting the books and continue working toward
                    my goals. Wishing you all good health and continued success.
                  </p>
                </div>

                {/* Signature */}
                <div className="mt-8 flex items-center justify-end gap-2">
                  <div className="h-px w-24 bg-gradient-to-l from-teal/40 to-transparent dark:from-night-teal/40"></div>
                  <div className="text-sm font-medium italic text-teal/80 dark:text-night-teal/80">
                    Toshi
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Photo Film Roll */}
          <PhotoFilmRoll photoRows={FIRST_PHOTO_ROWS} />

          {/* Growth Journey */}
          <Section className="mb-4">
            <ScoreChart config={IELTS_CHART} />
          </Section>

          {/* Duolingo English Test Progress */}
          <Section>
            <ScoreChart config={DUOLINGO_CHART} />
          </Section>

          {/* Second Photo Film Roll */}
          <PhotoFilmRoll photoRows={SECOND_PHOTO_ROWS} />

          {/* Fun Stats */}
          <Section>
            <p className="mb-4 text-center text-xs text-main-black/40 dark:text-night-white/40">
              Tap the cards!
            </p>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <StatCard key={i} stat={stat} index={i} />
              ))}
            </div>
          </Section>

          {/* Footer */}
          <PageFooter />
        </main>
      )}
    </div>
  )
}
