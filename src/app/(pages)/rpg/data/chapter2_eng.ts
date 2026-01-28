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

export const chapter2: { title: string; scenes: Scene[] } = {
  title: 'Unnecessary Senses',
  scenes: [
    {
      id: 'ch2_sc1',
      background: 'cafe_lunch',
      lines: [
        { speaker: '', text: 'Lunch break.' },
        {
          speaker: '',
          text: 'The company cafeteria was filled with air carrying the dampness characteristic of a rainy day.',
        },
        {
          speaker: 'Aoba',
          text: '"Doesn\'t the rain smell interesting today?"',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba said, leaning forward slightly.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"The scent of soil is so strong... it feels kind of comforting."',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: 'Akabane', text: '(Petrichor...)' },
        {
          speaker: '',
          text: 'A phenomenon where an aerosol is created by substances produced by plant oils and bacteria when rain falls on dry asphalt or soil, generating a unique scent.',
        },
        {
          speaker: '',
          text: 'I can explain the chemical mechanism.',
        },
        {
          speaker: '',
          text: 'But it has absolutely zero relevance to work.',
        },
        {
          speaker: '',
          text: 'Around us, several colleagues were naturally listening to Aoba.',
        },
        { speaker: 'Colleague', text: '"I get it."' },
        { speaker: 'Colleague', text: '"It is kind of calming, isn\'t it?"' },
        {
          speaker: 'Colleague',
          text: '"Having your around really softens the mood."',
        },
        { speaker: '', text: 'Soften.' },
        {
          speaker: '',
          text: 'I cannot understand that ambiguous evaluation.',
        },
        {
          speaker: '',
          text: 'Even if the mood is softened, operational efficiency doesn\'t go up. The numbers don\'t move.',
        },
        {
          speaker: '',
          text: 'Watching the scene from a step back, I was reconstructing the afternoon schedule in my head.',
        },
        {
          speaker: '',
          text: 'Time flows slowly only around her. \nTo an organization, that should be nothing but a "lag."',
        },
      ],
    },
    {
      id: 'ch2_sc2',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'In the afternoon, a trouble report came in.',
        },
        {
          speaker: '',
          text: 'Apparently, an inquiry about a delivery date had come from a client Aoba was handling.',
        },
        { speaker: 'Akabane', text: '"Aoba."' },
        {
          speaker: 'Aoba',
          text: '"Yes?"',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"I saw the email to the client. You wrote, \'I will respond as quickly as possible.\'"',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"Yes! I wanted to put them at ease, even just a little."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"Don\'t."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"Eh?"',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"\'As quickly as possible\' creates arbitrary expectations for the other party. \nIf you\'re even a day late, they\'ll feel betrayed."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I point at the monitor.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"Business doesn\'t need \'kindness.\' It needs a \'precise commitment.\' \nInstead of making an uncertain promise, true sincerity is giving a definite delivery date and letting the client decide."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba\'s face lit up with realization.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"...I just wanted them to be happy... but that was actually irresponsible of me."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"Exactly. Don\'t work based on your emotions. It becomes a risk."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"Yes... I\'m sorry."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba\'s back as she returned to her desk looked a size smaller than usual.',
        },
      ],
    },
    {
      id: 'ch2_sc3',
      background: 'bar_night',
      lines: [
        { speaker: '', text: 'Night. The same shop. The same seat.' },
        {
          speaker: 'Kise',
          text: '"Ah, I got dumped again."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Kise grumbles while fiddling with his phone.',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"What was it this time?"',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"She said, \'I can\'t even breathe when I\'m with you.\'"',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"I planned the date course perfectly, you know? The travel time, the restaurant reservation, the movie showtime. The shortest route for the most efficient fun."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I tilt my glass.',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"What\'s wrong with that? It\'s perfect."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"Right? But she said, \'I wanted to enjoy the time we spent getting lost.\'"',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Kise tosses an edamame shell.',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"I guess taking the \'correct route\' isn\'t necessarily a fun date. Humans are a pain."',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I stopped moving for a moment at those words.',
        },
        { speaker: '', text: 'Humans are a pain.' },
        {
          speaker: '',
          text: 'That\'s exactly why I stick to thorough manuals at work.',
        },
        { speaker: '', text: 'So we don\'t get lost.' },
        { speaker: '', text: 'That shouldn\'t be wrong.' },
      ],
    },
  ],
}

