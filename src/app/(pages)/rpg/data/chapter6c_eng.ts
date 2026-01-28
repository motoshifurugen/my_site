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
        },
        {
          speaker: '',
          text: 'Her hands are trembling.',
        },
        {
          speaker: '',
          text: 'Does she spit out a manual-compliant answer (a lie), or is she branded as incompetent for being unable to answer?',
        },
        {
          speaker: '',
          text: 'Either way, the burden is too heavy for the current Aoba.',
        },
        {
          speaker: '',
          text: 'The mask of the "perfect subordinate" I built is about to peel off.',
        },
        {
          speaker: '',
          text: 'If I let this continue, she will either be decisively hurt or kill her heart and become "complete."',
        },
        { speaker: 'Akabane', text: '(...That\'s enough.)' },
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
        },
        {
          speaker: '',
          text: 'Aoba shouts.',
        },
        {
          speaker: '',
          text: 'Mr. Saegusa also frowns.',
        },
        {
          speaker: 'Saegusa',
          text: '"What is the meaning of this?"',
        },
        {
          speaker: 'Akabane',
          text: '"It\'s as you pointed out. Our plan lacked consideration for the people on the ground. ...Even if we proceed like this, it won\'t benefit your company."',
        },
        {
          speaker: '',
          text: 'It is a defeat as a businessman.',
        },
        {
          speaker: '',
          text: 'But it\'s much better than letting Aoba give a "heart-killing answer."',
        },
        {
          speaker: 'Akabane',
          text: '"We will come back another time."',
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
        },
        {
          speaker: 'Akabane',
          text: '"No, that was for the best."',
        },
        {
          speaker: '',
          text: 'I drink my coffee.',
        },
        {
          speaker: '',
          text: 'It\'s bitter.',
        },
        {
          speaker: 'Akabane',
          text: '"The contract will fall through, I suppose."',
        },
        {
          speaker: 'Aoba',
          text: '"Why did you stop me? I could have answered if it was by the manual."',
        },
        {
          speaker: 'Akabane',
          text: '"I know."',
        },
        {
          speaker: '',
          text: 'I look at Aoba.',
        },
        {
          speaker: 'Akabane',
          text: '"But I felt that if you said that, you\'d truly turn into \'that kind of person\' for real."',
        },
        {
          speaker: 'Aoba',
          text: '"Eh?"',
        },
        {
          speaker: 'Akabane',
          text: '"We didn\'t get the job. My evaluation will drop. ...But you know,"',
        },
        {
          speaker: '',
          text: 'I loosened my tie and took a deep breath.',
        },
        {
          speaker: '',
          text: 'Strangely, I had no regrets.',
        },
        {
          speaker: 'Akabane',
          text: '"Instead of lying and winning, I\'d rather lose and be able to breathe. ...That\'s how I feel now."',
        },
        {
          speaker: '',
          text: 'Aoba looked at me for a while, but eventually, she relaxed and laughed.',
        },
        {
          speaker: 'Aoba',
          text: '"...You\'re weird, Mr. Akabane."',
        },
        {
          speaker: 'Akabane',
          text: '"Shut up."',
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

