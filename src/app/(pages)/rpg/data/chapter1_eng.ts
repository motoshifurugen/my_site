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

export const chapter1: { title: string; scenes: Scene[] } = {
  title: 'The Correct Daily Routine',
  scenes: [
    {
      id: 'ch1_sc1',
      background: 'station_morning',
      lines: [
        {
          speaker: '',
          text: 'The path from the station to the office is the same every morning.',
        },
        {
          speaker: '',
          text: 'The timing of the traffic lights, the strength of the wind blowing between the skyscrapers—everything falls within the scope of my predictions.',
        },
        {
          speaker: '',
          text: 'To me, "correctness" is reproducibility. If the conditions are met, the result can be recreated.',
        },
        {
          speaker: '',
          text: 'Correct procedures. Correct judgments. As long as you don\'t deviate from them, you won\'t make a major mistake.',
        },
        {
          speaker: '',
          text: 'As the office building comes into view, I check my watch once.',
        },
        { speaker: '', text: '"8:50 AM"' },
        { speaker: 'Akabane', text: '"On schedule, as always."' },
      ],
    },
    {
      id: 'ch1_sc2',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'The floor in the morning is as quiet as a sterile room.',
        },
        {
          speaker: '',
          text: 'The sound of typing is scattered like dry raindrops.',
        },
        {
          speaker: '',
          text: 'A balanced space with no room for emotion.',
        },
        { speaker: '', text: 'Suddenly, that silence is shattered.' },
        { speaker: '???', text: '"Good morning everyone!"' },
        {
          speaker: '',
          text: 'A voice bright enough to be out of place.',
        },
        {
          speaker: '',
          text: 'Standing at the entrance was Irone Aoba.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'A newcomer who joined this year, she is a foreign object that changes the atmosphere of the floor in an instant.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba isn\'t fast at her job. In fact, she\'s slow. Her efficiency is poor.',
        },
        { speaker: '', text: 'Instead,' },
        {
          speaker: '',
          text: 'she always speaks up when someone makes a mistake, and when the air gets heavy, she starts talking about the trivial weather.',
        },
        {
          speaker: '',
          text: 'It can\'t be explained by logic, but the environment doesn\'t crumble because of her. She is an incomprehensible anomaly.',
        },
        {
          speaker: 'Aoba',
          text: '"Good morning, Mr. Akabane!"',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'She stops in front of my desk, her voice bouncing. I can feel the surrounding air loosen slightly.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: 'Akabane', text: '"...Morning."' },
        {
          speaker: '',
          text: 'I reply without taking my eyes off the monitor.',
        },
        {
          speaker: 'Aoba',
          text: '"I\'ve summarized yesterday\'s documents up to this point!"',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba holds out a folder.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I look through the contents.\n... ... ...\nThe direction is right, but the structure is full of waste.',
        },
        {
          speaker: 'Akabane',
          text: '"...If you had used the template first, it would have been more than enough and much faster."',
        },
        {
          speaker: '',
          text: 'Aoba blinked for a moment.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"Oh, I see! I\'ll do that next time!"',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'Lighthearted.' },
        {
          speaker: '',
          text: 'I returned the file without saying anything more.',
        },
      ],
    },
    {
      id: 'ch1_sc3',
      background: 'meeting_room',
      lines: [
        {
          speaker: '',
          text: 'After the afternoon meeting, I suddenly remembered a project from a few years ago.',
        },
        { speaker: '', text: 'There were no dissenting opinions.' },
        {
          speaker: '',
          text: 'It was just a method everyone wasn\'t used to.',
        },
        {
          speaker: '',
          text: 'Follow the new rules. Don\'t bring in unnecessary emotions.',
        },
        {
          speaker: '',
          text: 'By proceeding with the determined steps without wasting time, the numbers came out clean.',
        },
        { speaker: '', text: 'It\'s not that I argued anyone down.' },
        {
          speaker: '',
          text: 'I simply understood the rules of society and adapted to them.',
        },
        { speaker: '', text: 'And so, it worked.' },
        { speaker: 'Akabane', text: '"...The same today,"' },
        {
          speaker: '',
          text: 'I muttered quietly, returning my gaze to the monitor.',
        },
        {
          speaker: '',
          text: 'The world is as beautiful as a mathematical formula—as long as you remove the noise.',
        },
      ],
    },
    {
      id: 'ch1_sc4',
      background: 'bar_night',
      lines: [
        {
          speaker: '',
          text: 'At night, I went into the usual izakaya with my colleague, Toya Kise.',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"A beer for now. And potato salad."',
        },
        {
          speaker: 'Kise',
          text: '"You really never go on an adventure, do you?"',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"What\'s that supposed to mean?"',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"It\'s been five years since we started coming here, and your first words are always \'potato salad.\' Try the \'Today\'s Special\' for once."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Kise fans himself with the menu.',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"Wasting time on a bad draw is pointless."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"That \'waste\' is what makes the drink taste better, you know."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"I don\'t follow your logic."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I put a bite of the potato salad into my mouth.',
        },
        { speaker: '', text: 'The usual taste. This is fine.' },
        {
          speaker: '',
          text: 'Obtaining the expected result—that is my security.',
        },
      ],
    },
  ],
}

