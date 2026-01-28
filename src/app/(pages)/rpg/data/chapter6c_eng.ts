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

export const chapter6c: { title: string; scenes: Scene[] } = {
  title: 'A Detour with an Ocean View',
  scenes: [
    {
      id: 'ch6c_sc1',
      background: 'client_room',
      lines: [
        {
          speaker: '',
          text: 'Against Mr. Saegusa\'s questioning, Aoba is cornered.',
        },
        {
          speaker: 'Aoba',
          text: '"I..."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Her hands are trembling.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Does she spit out a manual-compliant answer (a lie), or is she branded as incompetent for being unable to answer?',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Either way, the burden is too heavy for the current Aoba.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'The mask of the "perfect subordinate" I built is about to peel off.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'If I let this continue, she will either be decisively hurt or kill her heart and become "complete."',
        },
        {
          speaker: 'Akabane',
          text: '(...That\'s enough.)',
        },
        {
          speaker: '',
          text: 'I made a decision.',
        },
      ],
    },
    {
      id: 'ch6c_sc2',
      background: 'client_room',
      lines: [
        {
          speaker: 'Akabane',
          text: '"Director Saegusa."',
        },
        {
          speaker: '',
          text: 'I stood up and closed the folder.',
        },
        {
          speaker: 'Akabane',
          text: '"I apologize. We will be withdrawing today\'s proposal."',
        },
        {
          speaker: 'Aoba',
          text: '"Mr. Akabane!?"',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba shouts.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Mr. Saegusa also frowns.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Saegusa',
          text: '"What is the meaning of this?"',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"It\'s as you pointed out. Our plan lacked consideration for the people on the ground. ...Even if we proceed like this, it won\'t benefit your company."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'It is a defeat as a businessman.',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'But it\'s much better than letting Aoba give a "heart-killing answer."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"We will come back another time."',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I bowed deeply, prompted Aoba, and left the room.',
        },
      ],
    },
    {
      id: 'ch6c_sc3',
      background: 'after_cafe',
      lines: [
        {
          speaker: '',
          text: 'A nearby cafe.',
        },
        {
          speaker: '',
          text: 'After a heavy silence, Aoba speaks.',
        },
        {
          speaker: 'Aoba',
          text: '"...I\'m sorry. Because I couldn\'t answer, the deal..."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"No, that was for the best."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I drink my coffee.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'It\'s bitter.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"The contract will fall through, I suppose."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"Why did you stop me? I could have answered if it was by the manual."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"I know."',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I look at Aoba.',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"But I felt that if you said that, you\'d truly turn into \'that kind of person\' for real."',
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
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"We didn\'t get the job. My evaluation will drop. ...But you know,"',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'I loosened my tie and took a deep breath.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Strangely, I had no regrets.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"Instead of lying and winning, I\'d rather lose and be able to breathe. ...That\'s how I feel now."',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'Aoba looked at me for a while, but eventually, she relaxed and laughed.',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Aoba',
          text: '"...You\'re weird, Mr. Akabane."',
          characters: [
            {
              image: 'aoba_3.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: 'Akabane',
          text: '"Shut up."',
          characters: [
            {
              image: 'aoba_3.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'The negotiation was a total failure.',
        },
        {
          speaker: '',
          text: 'However, as we looked out the window, our vision was a little clearer than it had been yesterday.',
        },
      ],
    },
  ],
}

