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

export const chapter4: { title: string; scenes: Scene[] } = {
  title: 'The Room with Thin Oxygen',
  scenes: [
    {
      id: 'ch4_sc1',
      background: 'station_morning',
      lines: [
        {
          speaker: '',
          text: 'Morning. Walking the path from the station to the office, I loosened my tie slightly.',
        },
        {
          speaker: '',
          text: 'Lately, my breathing has been shallow.',
        },
        {
          speaker: '',
          text: 'The oxygen shouldn\'t be thin, but I have a sensation that it\'s not reaching the depths of my lungs.',
        },
      ],
    },
    {
      id: 'ch4_sc2',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'When I enter the office, Aoba is already in her seat.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"Good morning, Mr. Akabane."',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'A greeting without a hair\'s breadth of error. Perfect vocalization.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: 'Akabane', text: '(—Copy-robot.)' },
        {
          speaker: 'Akabane',
          text: '"Morning."',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I take my seat.',
        },
        {
          speaker: '',
          text: 'The sound of typing echoes regularly.',
        },
        {
          speaker: '',
          text: 'The noise I once found unpleasant had completely vanished.',
        },
        {
          speaker: '',
          text: 'Quiet, efficient, no waste.',
        },
        { speaker: 'Akabane', text: '(...Is this the silence I created?)' },
      ],
    },
    {
      id: 'ch4_sc3',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'During the morning, Aoba brings documents.',
        },
        {
          speaker: 'Aoba',
          text: '"Please check these."',
        },
        {
          speaker: '',
          text: 'A word without waste. A movement without waste.',
        },
        {
          speaker: '',
          text: 'I look through the materials.',
        },
        {
          speaker: '',
          text: 'The content is fine. The structure and numbers are correct.',
        },
        { speaker: '', text: '...Correct.' },
        { speaker: '', text: 'And yet.' },
        { speaker: 'Akabane', text: '"Aoba."' },
        {
          speaker: '',
          text: 'When I call out, Aoba stops immediately.',
        },
        { speaker: 'Aoba', text: '"Yes."' },
        {
          speaker: '',
          text: 'For a moment, I am at a loss for words.',
        },
        { speaker: 'Akabane', text: '(What do I want to confirm?)' },
        {
          speaker: '',
          text: 'There are no typos. The logic isn\'t broken.',
        },
        {
          speaker: '',
          text: 'Even so, Something that used to be here is nowhere to be found.',
        },
        { speaker: 'Akabane', text: '"...No, never mind."' },
        {
          speaker: '',
          text: 'Aoba nods after a short pause and returns to her seat.',
        },
      ],
    },
    {
      id: 'ch4_sc4',
      background: 'cafe_lunch',
      lines: [
        { speaker: '', text: 'Lunch break. Cafeteria.' },
        {
          speaker: '',
          text: 'Aoba is sitting next to a colleague.',
        },
        {
          speaker: '',
          text: 'The conversation is about work progress, task management, and deadlines.',
        },
        {
          speaker: '',
          text: 'There\'s no trivial small talk like before.',
        },
        {
          speaker: 'Colleague',
          text: '"Aoba-chan, you\'ve gotten so much faster at work."',
        },
        {
          speaker: 'Aoba',
          text: '"Thank you. Thanks to Mr. Akabane\'s training, the waste has decreased."',
        },
        {
          speaker: '',
          text: 'Those words pierce my chest.',
        },
        { speaker: '', text: '"Waste."' },
        {
          speaker: '',
          text: 'The name of what I have been cutting away.',
        },
        {
          speaker: '',
          text: 'Aoba\'s expression is calm. No dissatisfaction, no anger.',
        },
        {
          speaker: '',
          text: 'That makes it even more painful.',
        },
        { speaker: 'Akabane', text: '(She doesn\'t realize she\'s broken.)' },
        { speaker: '', text: 'Or—' },
        {
          speaker: '',
          text: 'Maybe she realized it and simply accepted it.',
        },
      ],
    },
    {
      id: 'ch4_sc5',
      background: 'bar_night',
      lines: [
        { speaker: '', text: 'Night. Drinking with Kise again.' },
        {
          speaker: 'Kise',
          text: '"Something\'s up with you,"',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Kise says quietly while picking at edamame.',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"You look like Tomoya after he lost Nagisa."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"What?"',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"Did you mess up at work or something?"',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I set my glass down.',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"Everything\'s smooth. Aoba has grown. The team numbers are good."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"Then that\'s good. But maybe you should have a team drinking party or something? People in other departments were saying, \'That place is like the military, it\'s hard to approach.\'"',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"I hate people who try to solve team communication issues with drinking parties the most."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'When I replied instantly, Kise laughed.',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"You just made an enemy of everyone in this shop."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"Well, but since the numbers are coming out, I can\'t say anything."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
      ],
    },
  ],
}

