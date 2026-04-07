import { constants } from "buffer";
import { expect } from "chai";
import { keccak256 } from "ethers";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

// it: Mocha가 제공하는 테스트 프레임워크 전역 함수(=> individual test)
it("Survey storage layout", async () => {
  const { ethers } = await network.connect();

  const title = "막무가내 설문조사";
  const description =
    "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";
  const questions: Question[] = [
    {
      question: "누가 내 응답을 관리할 때 더 솔직할 수 있을까요?",
      options: [
        "구글폼 운영자",
        "탈중앙화된 블록체인 (관리 주체 없으며 모든 데이터 공개)",
        "상관 없음",
      ],
    },
    {
      question: "test2",
      options: ["구글폼 운영자"],
    },
  ];

  const survey = await ethers.deployContract(
    "Survey",
    [title, description, 100, questions],
    {
      value: ethers.parseEther("100"),
    },
  );

  // utils
  const decodeUni = (hex: string) =>
    Buffer.from(hex.slice(2), "hex").toString("utf-8");

  const nextHash = (hex: string, i: number) =>
    "0x" + (BigInt(hex) + BigInt(i)).toString(16);

  // short string type
  console.log("\n--- short string type ---");
  const slot0Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(0, 32),
  );
  console.log(decodeUni(slot0Data));

  // long string type
  console.log("\n--- long string type ---");
  const slot1Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(1, 32),
  );
  console.log(slot1Data);
  const pDesc = keccak256(ethers.toBeHex(1, 32));
  const desc0 = await ethers.provider.getStorage(
    await survey.getAddress(),
    pDesc,
  );
  console.log(desc0);

  const desc1 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 1),
  );
  console.log(desc1);

  const desc2 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 2),
  );
  console.log(desc2);

  const desc3 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 3),
  );
  console.log(desc3);

  const desc4 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 4),
  );
  console.log(desc4);

  // primitive type
  console.log("\n--- primitive types ---");
  for (let i = 2; i < 4; i++) {
    const slotData = await ethers.provider.getStorage(
      survey.getAddress(),
      ethers.toBeHex(i, 32),
    );
    console.log(slotData);
  }

  // Array type
  // pQuestions => 0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b
  // question1 : pQuestions
  // question1_option[] : pQuestions + 1
  // question2 : pQuestions + 2
  // question2_option[] : pQuestions + 3
  console.log("\n--- array & structure types ---");
  const slot4Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(4, 32),
  );
  console.log("slot4Data", slot4Data);
  const pQuestions = keccak256(ethers.toBeHex(4, 32));
  const question1 = await ethers.provider.getStorage(
    survey.getAddress(),
    pQuestions,
  );

  const question1_option_array = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 1),
  );

  const question2 = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 2),
  );

  const question2_option_array = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 3),
  );

  console.log("question1", question1);
  console.log("question1_option[]", question1_option_array);
  console.log("question2", question2, decodeUni(question2));
  console.log("question2_option[]", question2_option_array);

  // Mapping
  // map[keccak256(k, slot address)]
  console.log("\n --- Mapping ---");
  const slot6Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(6, 32),
  );
  console.log(slot6Data);

  const addr = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
  const mapKeyAddr = keccak256(
    ethers.toBeHex(addr, 32) + ethers.toBeHex(6, 32).slice(2),
  );
  const map1Value = await ethers.provider.getStorage(
    survey.getAddress(),
    mapKeyAddr,
  );
  console.log(map1Value);

  /*
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
  */

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
