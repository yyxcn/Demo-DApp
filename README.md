# Survey DApp

Solidity 기반 설문조사 DApp 프로젝트

## 폴더 구조

```
Demo-DApp/
├── surveyContracts/        # 스마트 컨트랙트 (Hardhat)
│   ├── contracts/           # Solidity 컨트랙트
│   ├── scripts/             # 배포 스크립트
│   ├── test/                # 테스트 코드
│   ├── ignition/            # Hardhat Ignition 모듈
│   ├── artifacts/           # 컴파일 결과물
│   ├── types/               # TypeChain 타입
│   ├── hardhat.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── surveyUI/               # 프론트엔드 (React Router + Vite)
│   ├── app/                 # 페이지 및 컴포넌트
│   ├── public/              # 정적 파일
│   ├── vite.config.ts
│   ├── react-router.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```
