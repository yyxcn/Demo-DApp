import { expect } from "chai";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}
const { ethers } = await network.connect();

describe("SurveyFactory Contract", () => {
  let factory, owner, respondent1, respondent2;

  beforeEach(async () => {
    [owner, respondent1, respondent2] = await ethers.getSigners();

    factory = await ethers.deployContract("SurveyFactory", [
      ethers.parseEther("50"), // min_pool_amount

      ethers.parseEther("0.1"), // min_reward_amount
    ]);
    await factory.waitForDeployment();
  });

  it("should deploy with correct minimum amounts", async () => {
    // TODO: check min_pool_amount and min_reward_amount
    const FactoryCA = await factory.getAddress();

    const minPoolAmount = await ethers.provider.getStorage(FactoryCA, 0);
    const minRewardAmount = await ethers.provider.getStorage(FactoryCA, 1);

    expect(BigInt(minPoolAmount)).eq(ethers.parseEther("50"));
    expect(BigInt(minRewardAmount)).eq(ethers.parseEther("0.1"));
  });

  it("should create a new survey when valid values are provided", async () => {
    // TODO: prepare SurveySchema and call createSurvey with msg.value
    const title = "설문조사";
    const description = "중앙화된 설문조사로서, 모든 데이터는 공개되지 않음";
    const questions: Question[] = [
      {
        question: "누가 내 응답을 관리할 때 더 솔직할 수 있을까요?",
        options: ["구글폼 운영자", "탈중앙화된 블록체인", "상관 없음"],
      },
    ];
    const surveysBefore = await factory.getSurveys();

    const tx = await factory.createSurvey(
      {
        title,
        description,
        targetNumber: 100,
        questions,
      },
      {
        value: ethers.parseEther("100"),
      },
    );
    // TODO: check event SurveyCreated emitted
    // tx.wait(): 트랜잭션이 처리될 때까지 기다리는 함수(반환값 => 트랜잭션 영수중)
    const receipt = await tx.wait();
    let surveyAddress;
    receipt?.logs.forEach((log) => {
      // 이벤트 파싱
      const event = factory.interface.parseLog(log);
      console.log(event);
      expect(event?.name).eq("SurveyCreated");
    });
    // TODO: check surveys array length increased
    const surveysAfter = await factory.getSurveys();
    expect(surveysAfter.length).eq(surveysBefore.length + 1);
  });

  it("should revert if pool amount is too small", async () => {
    // TODO: expect revert when msg.value < min_pool_amount
    const title = "설문조사";
    const description = "중앙화된 설문조사로서, 모든 데이터는 공개되지 않음";
    const questions: Question[] = [
      {
        question: "누가 내 응답을 관리할 때 더 솔직할 수 있을까요?",
        options: ["구글폼 운영자", "탈중앙화된 블록체인", "상관 없음"],
      },
    ];
    const tx = await factory.createSurvey(
      {
        title,
        description,
        targetNumber: 100,
        questions,
      },
      {
        value: ethers.parseEther("100"),
      },
    );

    expect(tx.value).gt(ethers.parseEther("50"));
  });

  it("should revert if reward amount per respondent is too small", async () => {
    // TODO: expect revert when msg.value / targetNumber < min_reward_amount
    const title = "설문조사";
    const description = "중앙화된 설문조사로서, 모든 데이터는 공개되지 않음";
    const questions: Question[] = [
      {
        question: "누가 내 응답을 관리할 때 더 솔직할 수 있을까요?",
        options: ["구글폼 운영자", "탈중앙화된 블록체인", "상관 없음"],
      },
    ];
    await expect(
      factory.createSurvey(
        {
          title,
          description,
          targetNumber: 1000,
          questions,
        },
        {
          value: ethers.parseEther("50"),
        },
      ),
    ).revertedWith("Insufficient reward amount");
  });

  it("should store created surveys and return them from getSurveys", async () => {
    const surveyInputs = [
      {
        title: "설문조사 1",
        description: "첫 번째 설문조사",
        targetNumber: 100,
        questions: [
          {
            question: "가장 선호하는 응답 방식은 무엇인가요?",
            options: ["텍스트", "객관식", "주관식"],
          },
        ] as Question[],
        value: ethers.parseEther("100"),
      },
      {
        title: "설문조사 2",
        description: "두 번째 설문조사",
        targetNumber: 50,
        questions: [
          {
            question: "가장 자주 사용하는 지갑은 무엇인가요?",
            options: ["MetaMask", "Phantom", "기타"],
          },
        ] as Question[],
        value: ethers.parseEther("60"),
      },
    ];

    const createdSurveyAddresses: string[] = [];

    for (const surveyInput of surveyInputs) {
      const tx = await factory.createSurvey(
        {
          title: surveyInput.title,
          description: surveyInput.description,
          targetNumber: surveyInput.targetNumber,
          questions: surveyInput.questions,
        },
        {
          value: surveyInput.value,
        },
      );
      const receipt = await tx.wait();

      for (const log of receipt?.logs ?? []) {
        const event = factory.interface.parseLog(log);
        if (event?.name === "SurveyCreated") {
          createdSurveyAddresses.push(event.args[0]);
        }
      }
    }

    const surveys = await factory.getSurveys();

    expect(createdSurveyAddresses).to.have.length(2);
    expect(surveys).to.have.length(2);
    expect(surveys[0]).eq(createdSurveyAddresses[0]);
    expect(surveys[1]).eq(createdSurveyAddresses[1]);
  });
});
