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

export const chapter3: { title: string; scenes: Scene[] } = {
  title: 'The Cost of Optimization',
  scenes: [
    {
      id: 'ch3_sc1',
      background: 'station_morning',
      lines: [
        {
          speaker: '',
          text: 'Morning. I walk the path from the station to the office at the same speed as yesterday.',
        },
        {
          speaker: '',
          text: 'Everything is as expected. No delays. No problems.',
        },
        {
          speaker: '',
          text: 'As I make that judgment, for some reason, my steps feel heavy.',
        },
        {
          speaker: '',
          text: 'My tie feels tighter than usual.',
        },
      ],
    },
    {
      id: 'ch3_sc2',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'When I arrived at the office, Aoba was already in her seat.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'The hands hitting the keyboard were significantly faster than before.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Peeking at the screen, ambiguous expressions had vanished, replaced by facts and figures arranged in perfect order.',
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
          text: 'Her voice is bright. But it\'s thin. A constant tone, like a recorded message.',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
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
          text: 'There is no problem. In fact, it\'s ideal.',
        },
        { speaker: '', text: '—And yet.' },
      ],
    },
    {
      id: 'ch3_sc3',
      background: 'blue_leaf',
      lines: [
        {
          speaker: '',
          text: 'I noticed that the small potted plant by Aoba\'s desk was gone before I knew it.',
        },
        { speaker: 'Akabane', text: '(...She cleaned it up.)' },
        {
          speaker: '',
          text: 'Rational. It\'s better not to keep things unnecessary for work.',
        },
        {
          speaker: '',
          text: 'I should have concluded that, but my gaze kept returning to that empty space.',
        },
      ],
    },
    {
      id: 'ch3_sc4',
      background: 'meeting_room',
      lines: [
        { speaker: '', text: 'Afternoon regular meeting.' },
        {
          speaker: '',
          text: 'The materials Aoba summarized are projected on the screen.',
        },
        {
          speaker: '',
          text: 'No waste. The points are clear, and risk hedging is perfect.',
        },
        {
          speaker: 'Boss',
          text: '"Good. The numerical backing is solid."',
        },
        {
          speaker: '',
          text: 'The boss nods with satisfaction.',
        },
        {
          speaker: 'Boss',
          text: '"This is the result of Akabane\'s guidance."',
        },
        { speaker: '', text: 'I bow my head slightly.' },
        { speaker: 'Akabane', text: '"...It\'s her own hard work."' },
        {
          speaker: '',
          text: 'Aoba also continues her explanation calmly while taking notes.',
        },
        {
          speaker: '',
          text: 'She doesn\'t throw in digressions like before. She doesn\'t stop talking to worry about someone\'s expression.',
        },
        { speaker: '', text: 'The meeting ended five minutes early.' },
        { speaker: '', text: 'Efficient. Impeccable.' },
        { speaker: '', text: 'And yet.' },
        {
          speaker: '',
          text: 'The sound of applause sounded so far away.',
        },
      ],
    },
    {
      id: 'ch3_sc5',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'Returning to my desk, I open an email from Aoba.',
        },
        {
          speaker: '',
          text: 'Subject. Body. Signature. Everything is perfectly in order.',
        },
        {
          speaker: '',
          text: 'There isn\'t a single extra sentence anywhere.',
        },
        {
          speaker: '',
          text: '"Thank you for your hard work. I am sending today\'s minutes. Please review them."',
        },
        {
          speaker: '',
          text: 'Before, there would have been a "noise-like" sentence here, like "It\'s cold today, isn\'t it?" or "I was nervous about the meeting."',
        },
        {
          speaker: '',
          text: 'Those were all things I deemed "unnecessary."',
        },
        { speaker: 'Akabane', text: '(I...)' },
        {
          speaker: '',
          text: 'Right then, I understood clearly.',
        },
        {
          speaker: '',
          text: 'My "correctness" had painted over Aoba\'s colors.',
        },
        {
          speaker: '',
          text: 'I didn\'t yell at her. I didn\'t deny her.',
        },
        {
          speaker: '',
          text: 'I simply continued to present the "correct way" quietly and robbed her of her "self."',
        },
        { speaker: '', text: 'This isn\'t growth.' },
        { speaker: '', text: 'It\'s optimization.' },
        {
          speaker: '',
          text: 'I optimized a human being to function as part of a system.',
        },
        {
          speaker: '',
          text: 'As a result, she was reshaped into my image.',
        },
      ],
    },
    {
      id: 'ch3_sc6',
      background: 'bar_night',
      lines: [
        {
          speaker: '',
          text: 'Drinking with Kise at night, I was the one to speak up.',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"...The training for the newcomer is over."',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"Oh, finally? She was a handful, wasn\'t she?"',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Kise asks while squeezing lemon over fried chicken.',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"Yeah. ...She\'s become perfect. No mistakes. No idle chatter. She moves exactly as I tell her."',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"Heh, that\'s great. So your copy-robot is complete, huh?"',
          characters: [
            {
              image: 'kise_3.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Kise laughs without malice.',
          characters: [
            {
              image: 'kise_3.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Kise',
          text: '"Work will be easier now. Cheers."',
          characters: [
            {
              image: 'kise_3.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'The sound of glasses clinking echoes.',
          characters: [
            {
              image: 'kise_3.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"...Yeah."',
          characters: [
            {
              image: 'kise_3.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'I drink the beer. It had no taste.' },
        { speaker: '', text: 'Copy-robot.' },
        {
          speaker: '',
          text: 'Kise\'s lighthearted remark sticks in my ear and won\'t leave.',
        },
        {
          speaker: '',
          text: 'Is this really what I wanted to create?',
        },
        {
          speaker: '',
          text: 'I shaved off her personality, coated her with "correctness," and gave her the same "function" as me.',
        },
        { speaker: '', text: 'That is a success.' },
        {
          speaker: '',
          text: 'But looking at Kise laughing like an idiot in the next seat, I couldn\'t help but feel that I, who was supposed to be "complete," was terribly defective.',
        },
      ],
    },
  ],
}

