export const SURVEY_FACTORY = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
// 0x5fbdb2315678afecb367f032d93f642f64180aa3;
// 0x2f12b6584B76F93ab2a8C06B95FF87e8c121FB80
export const SURVEY_FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_min_pool_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_min_reward_amount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "SurveyCreated",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "targetNumber",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "string",
                name: "question",
                type: "string",
              },
              {
                internalType: "string[]",
                name: "options",
                type: "string[]",
              },
            ],
            internalType: "struct Question[]",
            name: "questions",
            type: "tuple[]",
          },
        ],
        internalType: "struct SurveySchema",
        name: "_survey",
        type: "tuple",
      },
    ],
    name: "createSurvey",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getSurveys",
    outputs: [
      {
        internalType: "contract Survey[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const; // as const: Array를 immutable하게 만들겠다는 뜻 -> 이렇게 해야 wagmi에서 타입이 인식됨
export const SURVEY_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_targetNumber",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "string",
            name: "question",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "options",
            type: "string[]",
          },
        ],
        internalType: "struct Question[]",
        name: "_questions",
        type: "tuple[]",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAnswers",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "respondent",
            type: "address",
          },
          {
            internalType: "uint8[]",
            name: "answers",
            type: "uint8[]",
          },
        ],
        internalType: "struct Answer[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getQuestions",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "question",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "options",
            type: "string[]",
          },
        ],
        internalType: "struct Question[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "respondent",
            type: "address",
          },
          {
            internalType: "uint8[]",
            name: "answers",
            type: "uint8[]",
          },
        ],
        internalType: "struct Answer",
        name: "_answer",
        type: "tuple",
      },
    ],
    name: "submitAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "targetNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "title",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
