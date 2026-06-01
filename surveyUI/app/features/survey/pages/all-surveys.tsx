import { useReadContract } from "wagmi";
import SurveyCard from "../components/survey-card";
import { SURVEY_ABI, SURVEY_FACTORY, SURVEY_FACTORY_ABI } from "../constant";
import { useEffect, useState } from "react";
import { createPublicClient, getContract, http } from "viem";
import { hardhat } from "viem/chains";

interface SurveyMeta {
  title: string;
  description: string;
  count: number;
  view: number | null;
  image: string | null;
  address: string;
}

export default function AllSurveys() {
  const [surveys, setSurveys] = useState<SurveyMeta[]>([]);
  const onChainLoader = async () => {
    // createPublicClient(): 블록체인 읽기용 클라이언트 만들기
    const client = createPublicClient({
      chain: hardhat,
      transport: http(),
    });
    // getContract(): 컨트랙트 객체 만들기
    const surveyFactoryContract = getContract({
      address: SURVEY_FACTORY,
      abi: SURVEY_FACTORY_ABI,
      client,
    });
    // 컨트랙트.read.getSurveys(): 컨트랙트 함수 읽기
    const surveys = await surveyFactoryContract.read.getSurveys();

    // await Promise.all(): 여러 비동기 작업을 동시에 실행하고, 전부 끝날 때까지 기다림
    const surveyMetadata = await Promise.all(
      surveys.map(async (surveyAddress) => {
        const surveyContract = getContract({
          address: surveyAddress,
          abi: SURVEY_ABI,
          client,
        });
        const title = await surveyContract.read.title();
        const description = await surveyContract.read.description();
        const answers = await surveyContract.read.getAnswers();
        return {
          title,
          description,
          count: answers.length,
          view: null,
          image: null,
          address: surveyAddress,
        };
      }),
    );
    return surveyMetadata;
  };

  const offChainLoader = async (): Promise<SurveyMeta[]> => {
    return [
      {
        title: "New Survey",
        description: "Override test",
        count: 10,
        view: 1600,
        image: "https://avatars.githubusercontent.com/u/215622698?s=300&v=4",
        address: "",
      },
    ];
  };

  useEffect(() => {
    const onChainData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const onchainSurveys = await onChainLoader();
      setSurveys(onchainSurveys);
    };
    onChainData();

    const offChainData = async () => {
      const onchainSurveys = await offChainLoader();
      setSurveys(onchainSurveys);
    };
    onChainData();
  }, []); // []: useEffect()를 딱 1번만 실행하되, []안에 파라미터를 넣으면 그 파라미터가 변경될 때마다 호출.

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold">Live Surveys</h1>
        <span className="font-light">Join the surveys!</span>
      </div>
      {surveys.map((survey) => (
        <SurveyCard
          title={survey.title}
          description={survey.description}
          view={1600}
          count={survey.count}
          image={"https://avatars.githubusercontent.com/u/215622698?s=300&v=4"}
          address={survey.address}
        />
      ))}
    </div>
  );
}
