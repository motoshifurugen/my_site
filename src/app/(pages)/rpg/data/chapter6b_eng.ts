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

export const chapter6b: { title: string; scenes: Scene[] } = {
  title: 'Fanfare of Noise',
  scenes: [
    {
      id: 'ch6b_sc1',
      background: 'client_room',
      lines: [
        {
          speaker: '',
          text: 'Aoba is struggling to answer.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Her lips are trembling as she tries to speak the "correct answer."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '(No.)',
        },
        {
          speaker: '',
          text: 'I have an intuition.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'That lie won\'t work on this man.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"...Forgive me, Director."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I cut across Aoba\'s words.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"The person in charge, Aoba, actually had another concern."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba looks at me in surprise.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"She visited the sites and summarized the \'risk of lowering staff motivation\' behind the efficiency in a report. ...I am the one who rejected it because it \'doesn\'t turn into numbers.\'"',
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
      id: 'ch6b_sc2',
      background: 'client_room',
      lines: [
        {
          speaker: 'Saegusa',
          text: '"Oh?"',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"Aoba. ...That plan I rejected. Just an oral explanation is fine, can you describe it?"',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'When I prompted her, Aoba was flustered for a moment, then immediately turned eyes of resolve toward him.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"Y-Yes! ...Actually, the people on the ground said they prefer the current layout and flow of the breakroom, even if it\'s inefficient..."',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba begins to speak.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'A story about the "scent" of the site that doesn\'t appear in numbers.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'It wasn\'t a smart presentation.',
        },
        {
          speaker: '',
          text: 'But I felt Mr. Saegusa\'s center of gravity lean forward just a little.',
        },
        {
          speaker: '',
          text: 'Confirming that we would receive a reply at a later date, we left the office.',
        },
      ],
    },
    {
      id: 'ch6b_sc3',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'In the end, the deal didn\'t go through.',
        },
        {
          speaker: '',
          text: 'My boss confronts me.',
        },
        {
          speaker: 'Boss',
          text: '"Why didn\'t you proceed with the original plan?"',
        },
        {
          speaker: '',
          text: 'I explain.',
        },
        {
          speaker: '',
          text: 'Long-term trust. The "unspoken discomfort" the client felt.',
        },
        {
          speaker: '',
          text: 'My boss left with an unconvinced expression.',
        },
        {
          speaker: '',
          text: 'My evaluation goes down.',
        },
      ],
    },
    {
      id: 'ch6b_sc4',
      background: 'night_platform',
      lines: [
        {
          speaker: '',
          text: 'Night. Walking side-by-side with Aoba to the station.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"...I\'m sorry about that."',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba shakes her head.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"I think it was for the best."',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"Probably, even if that went well, it would have broken later anyway."',
          characters: [
            {
              image: 'aoba_3.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'There\'s no basis.',
        },
        {
          speaker: '',
          text: 'But Aoba feels that way.',
        },
        {
          speaker: '',
          text: 'For the first time, I think:',
        },
        {
          speaker: 'Akabane',
          text: '(Correctness isn\'t something to be proven after the fact.)',
        },
        {
          speaker: '',
          text: 'Looking up from the station platform, the sky seemed to be shining with more stars than usual.',
        },
      ],
    },
  ],
}

