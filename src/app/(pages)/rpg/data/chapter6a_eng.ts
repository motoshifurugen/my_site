export type Line = {
  speaker: string
  text: string
  characters?: Character[]
  isChoice?: boolean
  choiceId?: string
}

export type Character = {
  image: string
  position?: 'left' | 'center' | 'right'
}

export type Choice = {
  text: string
  choiceId: string
}

export type Scene = {
  id: string
  background: string
  // bgm: string
  lines: Line[]
  characters?: Character[]
  options?: Choice[]
}

export const chapter6a: { title: string; scenes: Scene[] } = {
  title: 'The 100-Point Hell',
  scenes: [
    {
      id: 'ch6a_sc1',
      background: 'client_room',
      lines: [
        {
          speaker: '',
          text: 'Aoba\'s gaze wanders. She looks at me.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I nod wordlessly.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '(Don\'t say anything unnecessary. Reply with logic.)',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba tightens her expression.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Killing her emotions, she speaks the "correct answer."',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"...Yes. I am certain that for the people on the ground, operational efficiency will lead to long-term benefits. I believe future figures should be prioritized over temporary burdens."',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'A perfect answer. As a business matter, nothing is wrong.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
      ],
    },
    {
      id: 'ch6a_sc2',
      background: 'client_room',
      lines: [
        {
          speaker: '',
          text: 'Mr. Saegusa looked at Aoba for a few seconds.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'He showed neither disappointment nor anger.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Saegusa',
          text: '"I see."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Saegusa',
          text: '"I understand well. ...Thank you for coming while you\'re busy."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Mr. Saegusa stands up.',
        },
        {
          speaker: 'Aoba',
          text: '"Eh, um, about the contract..."',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Saegusa',
          text: '"I\'ll have Sasaki contact you later."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Behind us, only the sound of the door closing echoed.',
        },
        {
          speaker: '',
          text: 'Rejection.',
        },
        {
          speaker: '',
          text: 'A rejection deeper and colder than being yelled at.',
        },
        {
          speaker: '',
          text: 'He didn\'t need to say, "Your company has no heart."',
        },
        {
          speaker: '',
          text: 'We were quietly judged as "unnecessary."',
        },
      ],
    },
    {
      id: 'ch6a_sc3',
      background: 'rain_road',
      lines: [
        {
          speaker: '',
          text: '"...It should have been a perfect answer."',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'On the way back, Aoba mutters.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"It was,"',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I reply.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'We probably won\'t get the contract.',
        },
        {
          speaker: '',
          text: 'But our method isn\'t wrong.',
        },
        {
          speaker: '',
          text: 'What was wrong was the other party\'s emotional judgment criteria.',
        },
        {
          speaker: '',
          text: 'I try to justify it to myself, but my throat is parched as if it\'s burning.',
        },
        {
          speaker: '',
          text: 'Aoba, walking beside me, is no longer agitated.',
        },
        {
          speaker: 'Aoba',
          text: '"Next time, I\'ll prepare materials that exclude emotional arguments even further."',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Watching her say that calmly, I realized.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'From now on, no matter how much we succeed, we will never be able to connect with "humans" like Mr. Saegusa again.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'A life of chewing sand would continue forever.',
        },
      ],
    },
  ],
}

