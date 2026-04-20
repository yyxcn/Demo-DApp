import { expect } from "chai";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

const { ethers } = await network.connect();

describe("Survey init", () => {
  const title = "막무가내 설문조사라면";
  const description =
    "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";
  const questions: Question[] = [
    {
      question: "누가 내 응답을 관리할때 더 솔직할 수 있을까요?",
      options: [
        "구글폼 운영자",
        "탈중앙화된 블록체인 (관리주체 없으며 모든 데이터 공개)",
        "상관없음",
      ],
    },
  ];

  const getSurveyContractAndEthers = async (survey: {
    title: string;
    description: string;
    targetNumber: number;
    questions: Question[];
    depositAmount?: bigint;
  }) => {
    const { ethers } = await network.connect();

    const cSurvey = await ethers.deployContract(
      "Survey",
      [survey.title, survey.description, survey.targetNumber, survey.questions],
      { value: survey.depositAmount ?? 0n },
    );

    return { ethers, cSurvey };
  };

  describe("Deployment", () => {
    it("should store survey info correctly", async () => {
      const targetNumber = 10;
      const depositAmount = ethers.parseEther("1");

      const { cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber,
        questions,
        depositAmount,
      });

      expect(await cSurvey.title()).equal(title);
      expect(await cSurvey.description()).equal(description);
    });

    it("should calculate rewardAmount correctly", async () => {
      const targetNumber = 10;
      const depositAmount = ethers.parseEther("1");

      const { cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber,
        questions,
        depositAmount,
      });

      const expectedReward = depositAmount / BigInt(targetNumber);
      expect(await cSurvey.rewardAmount()).equal(expectedReward);
    });
  });

  describe("Questions and Answers", () => {
    it("should return questions correctly", async () => {
      const targetNumber = 10;

      const { cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber,
        questions,
      });

      const returnedQuestions = await cSurvey.getQuestions();
      expect(returnedQuestions.length).equal(questions.length);
      expect(returnedQuestions[0].question).equal(questions[0].question);
      expect(returnedQuestions[0].options.length).equal(
        questions[0].options.length,
      );
      for (let i = 0; i < questions[0].options.length; i++) {
        expect(returnedQuestions[0].options[i]).equal(questions[0].options[i]);
      }
    });

    it("should allow valid answer submission", async () => {
      const targetNumber = 10;
      const depositAmount = ethers.parseEther("1");

      const { ethers: eth, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber,
        questions,
        depositAmount,
      });

      const [, respondent] = await eth.getSigners(); // respondent = signers[1]

      await cSurvey.connect(respondent).submitAnswer({
        respondent: respondent.address,
        answers: [0],
      });

      const answers = await cSurvey.getAnswers();
      expect(answers.length).equal(1);
      expect(answers[0].respondent).equal(respondent.address);
    });

    it("should revert if answer length mismatch", async () => {
      const targetNumber = 10;

      const { ethers: eth, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber,
        questions,
      });

      const [, respondent] = await eth.getSigners();

      await expect(
        cSurvey.connect(respondent).submitAnswer({
          respondent: respondent.address,
          answers: [0, 1],
        }),
      ).to.be.revertedWith("Mismatched answers length");
    });

    it("should revert if target reached", async () => {
      const targetNumber = 1;
      const depositAmount = ethers.parseEther("1");

      const { ethers: eth, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber,
        questions,
        depositAmount,
      });

      const signers = await eth.getSigners();

      await cSurvey.connect(signers[1]).submitAnswer({
        respondent: signers[1].address,
        answers: [0],
      });

      await expect(
        cSurvey.connect(signers[2]).submitAnswer({
          respondent: signers[2].address,
          answers: [0],
        }),
      ).to.be.revertedWith("This survey has been ended");
    });
  });

  describe("Rewards", () => {
    it("should pay correct reward to respondent", async () => {
      const targetNumber = 10;
      const depositAmount = ethers.parseEther("1");

      const { ethers: eth, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber,
        questions,
        depositAmount,
      });

      const [, respondent] = await eth.getSigners();
      const balanceBefore = await eth.provider.getBalance(respondent.address);

      const tx = await cSurvey.connect(respondent).submitAnswer({
        respondent: respondent.address,
        answers: [0],
      });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const balanceAfter = await eth.provider.getBalance(respondent.address);
      const expectedReward = depositAmount / BigInt(targetNumber);

      expect(balanceAfter).equal(balanceBefore + expectedReward - gasUsed);
    });
  });
});
