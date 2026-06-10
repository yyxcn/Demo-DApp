# Survey DApp

Solidity 기반 설문조사 DApp 프로젝트

## 폴더 구조

```
Demo-DApp/
├── surveyContracts/                # 스마트 컨트랙트 (Hardhat)
│   ├── contracts/                   # Solidity 컨트랙트
│   │   ├── Survey.sol
│   │   └── SurveyFactory.sol
│   ├── scripts/                     # 배포/유틸 스크립트
│   │   └── send-op-tx.ts
│   ├── test/                        # 테스트 코드
│   │   ├── Mid-term.ts
│   │   ├── Survey.ts
│   │   └── SurveyFactory.ts
│   ├── ignition/                    # Hardhat Ignition
│   │   ├── modules/
│   │   │   └── SurveyFactory.ts
│   │   └── deployments/             # 체인별 배포 결과
│   │       ├── chain-1001/          # Kaia Testnet
│   │       └── chain-31337/         # 로컬 Hardhat
│   ├── artifacts/                   # 컴파일 결과물
│   ├── cache/
│   ├── types/                       # TypeChain 타입
│   ├── hardhat.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── surveyUI/                       # 프론트엔드 (React Router + Vite)
│   ├── app/
│   │   ├── components/              # 공용 컴포넌트
│   │   │   ├── ui/                  # shadcn UI 컴포넌트
│   │   │   ├── navigation.tsx
│   │   │   └── wallet-button.tsx
│   │   ├── features/                # 도메인별 기능
│   │   │   ├── archieve/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── survey/
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── postgres/
│   │   │   └── supaclient.ts
│   │   ├── app.css
│   │   ├── root.tsx
│   │   └── routes.ts
│   ├── db/
│   │   └── migration/               # Drizzle 마이그레이션
│   ├── supabase/
│   │   └── config.toml
│   ├── public/                      # 정적 파일
│   ├── database.types.ts            # Supabase 타입
│   ├── drizzle.config.ts
│   ├── components.json              # shadcn 설정
│   ├── react-router.config.ts
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```
