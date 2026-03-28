import { expect } from "chai";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

// it: Mocha가 제공하는 테스트 프레임워크 전역 함수(=> individual test)
it("Survey init", async () => {
  const { ethers } = await network.connect();

  const title = "설문조사";
  const description = "중앙화된 설문조사로서, 모든 데이터는 공개되지 않음";
  const questions: Question[] = [
    {
      question: "누가 내 응답을 관리할 때 더 솔직할 수 있을까요?",
      options: ["구글폼 운영자", "탈중앙화된 블록체인", "상관 없음"],
    },
  ];

  const factory = await ethers.deployContract("SurveyFactory", [
    ethers.parseEther("50"),
    ethers.parseEther("0.1"),
  ]);
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
  // tx.wait(): 트랜잭션이 처리될 때까지 기다리는 함수(반환값 => 트랜잭션 영수중)
  const receipt = await tx.wait();
  let surveyAddress;
  receipt?.logs.forEach((log) => {
    // 이벤트 파싱
    const event = factory.interface.parseLog(log);
    console.log(event);
    if (event?.name == "SurveyCreated") {
      surveyAddress = event.args[0];
    }
  });

  const surveyCA = await ethers.getContractFactory("Survey");
  const signers = await ethers.getSigners(); // Hardhat 로컬 테스트 계정들을 배열로 가져옴
  const respondent = signers[0];
  if (surveyAddress) {
    const survey = await surveyCA.attach(surveyAddress);
    await survey.connect(signers[0]);
    console.log(
      ethers.formatEther(await ethers.provider.getBalance(respondent)),
    );
    const sumbmitTx = await survey.submitAnswer({ respondent, answers: [1] });
    await sumbmitTx.wait();
    console.log(await ethers.provider.getBalance(respondent));
  }

  /*  < 2번째 방법 >
  // 컨트랙트 주소가 담긴 배열을 받아옴
  const surveys = await factory.getSurveys();

  // ethers.getContractFactory("Survey"): Survey의 ABI/bytecode를 바탕으로 Factory 객체 생성
  const surveyCA = await ethers.getContractFactory("Survey");

  // Factory 설계도를 surveys[0] 주소에 붙여서 survey 인스턴스를 만듬
  const survey = await surveyCA.attach(surveys[0]);
  console.log(await survey.getQuestions());
  */

  /*  < 1번째 방법 >
  // deployContract(): default로 signer 0번이 배포함(Hardhat ethers에는 20명의 테스트용 signer 제공)
  const s = await ethers.deployContract("Survey", [
    title,
    description,
    questions,
  ]);
  const _title = await s.title();
  const _desc = await s.description();
  const _questions = (await s.getQuestions()) as Question[];
  expect(_title).eq(title);
  expect(_desc).eq(description);
  expect(_questions[0].options).deep.eq(questions[0].options);

  const signers = await ethers.getSigners();
  const respondent = signers[1];
  await s.connect(respondent);
  await s.submitAnswer({
    respondent: respondent.address,
    answers: [1],
  });

  console.log(await s.getAnswers());
  */
});
