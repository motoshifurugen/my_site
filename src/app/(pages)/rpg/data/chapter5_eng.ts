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

export const chapter5: { title: string; scenes: Scene[] } = {
  title: 'Beyond the Manual',
  scenes: [
    {
      id: 'ch5_sc1',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'In this negotiation, there was a request for an in-person meeting, which has become rare lately.',
        },
        {
          speaker: '',
          text: 'Aoba and I head to the client\'s office in a company car.',
        },
        { speaker: 'Akabane', text: '"You have the flow in your head?"' },
        {
          speaker: 'Aoba',
          text: '"Yes. I will lead the progression, and you will provide technical support. The Q&A is also perfect."',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba shows me her tablet.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'The counterpart this time is Mr. Sasaki, the HR Manager. \nHe\'s the practical type who likes numbers.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"If it\'s Mr. Sasaki, he\'ll definitely bite on this cost-cutting plan. \nNo need to appeal to unnecessary emotions. Let\'s just present the benefits calmly."',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"Understood."',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'If we move according to the manual, there\'s no factor for failure.',
        },
        {
          speaker: '',
          text: 'We arrived at our destination with the "correct answer" prepared.',
        },
      ],
    },
    {
      id: 'ch5_sc2',
      background: 'client_room',
      lines: [
        { speaker: '', text: 'The reception room we were shown into.' },
        {
          speaker: '',
          text: 'The one waiting was not Mr. Sasaki.',
        },
        {
          speaker: '',
          text: '"Hi. Sorry to keep you waiting."',
        },
        {
          speaker: '',
          text: 'An older man walked in. He wore a high-quality suit loosely, a gentle smile on his face, but his eyes were sharp.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Saegusa',
          text: '"I\'m Saegusa, the Senior Managing Director. \nSasaki had a sudden health issue. I\'ll listen in his place."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Saegusa. One of the founding members of this company from my research.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'He is the type I am worst at dealing with—someone who grew the company through "intuition" and "character" rather than "rationality."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"N-Nice to meet you. My name is Aoba."',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba shows a moment of agitation.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'An unexpected situation.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I let out a small breath and signal her to stay calm.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '(Don\'t be rattled. Even if the person changes, the correct business answer doesn\'t. Overwhelm him with numbers.)',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
      ],
    },
    {
      id: 'ch5_sc3',
      background: 'client_room',
      lines: [
        {
          speaker: '',
          text: 'The presentation begins. Aoba\'s speaking style is fluent.',
        },
        {
          speaker: '',
          text: 'However, Director Saegusa hardly looks at the materials.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'He is simply staring intently at Aoba\'s face.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"—Based on the above, your company\'s expenses can be reduced by 15% annually."',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba finishes the explanation.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'Silence.' },
        {
          speaker: '',
          text: 'Director Saegusa slowly took off his glasses.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Saegusa',
          text: '"...It\'s a beautiful presentation."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Saegusa',
          text: '"Impeccable. You\'ve studied well."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"T-Thank you very much."',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Saegusa',
          text: '"So?"',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Mr. Saegusa continues while maintaining his gentle smile.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Saegusa',
          text: '"What do you think?"',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"Eh...?"',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Saegusa',
          text: '"Do you truly believe, in your own heart, that the people on the ground will be happy with this plan?"',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'The question was quiet. But the air in the room suddenly became thin.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba is at a loss for words. A question that isn\'t in the manual.',
        },
        {
          speaker: '',
          text: 'I grip the pen in my hand.',
        },
        {
          speaker: '',
          text: 'This is a test. A test of what lies beneath our armor of "efficiency."',
        },
        { speaker: '', text: 'There are three choices.' },
      ],
      options: [
        {
          text: 'Let Aoba give the correct answer',
          choiceId: 'bad_end',
        },
        {
          text: 'Tell Aoba\'s honest feelings',
          choiceId: 'true_end',
        },
        {
          text: 'Protect Aoba',
          choiceId: 'another_end',
        },
      ],
    },
  ],
}

