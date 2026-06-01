import { SendIcon, User2Icon } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import MessageBubble from "../components/message-bubble";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/survey";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { SURVEY_ABI } from "../constant";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const answers = Object.fromEntries(formData);
  console.log(Object.values(answers).map((str) => Number(str)));
};

interface Questions {
  question: string;
  options: string[];
}

const questions: Questions[] = [
  {
    question: "가장 좋아하는 프로그래밍 언어는?",
    options: ["JavaScript", "Python", "Java", "C++"],
  },
  {
    question: "웹 개발에서 사용하는 마크업 언어는?",
    options: ["HTML", "CSS", "SQL", "Python"],
  },
  {
    question: "데이터베이스 종류가 아닌 것은?",
    options: ["MySQL", "MongoDB", "React", "PostgreSQL"],
  },
  {
    question: "자바스크립트 프레임워크는?",
    options: ["React", "Django", "Spring", "Flask"],
  },
  {
    question: "버전 관리 시스템은?",
    options: ["Git", "Docker", "Kubernetes", "Jenkins"],
  },
  {
    question: "HTTP 상태 코드 200의 의미는?",
    options: ["성공", "에러", "리다이렉트", "권한 없음"],
  },
  {
    question: "TypeScript의 특징은?",
    options: ["정적 타입 지원", "인터프리터 언어", "DB 관리", "UI 디자인"],
  },
  {
    question: "REST API에서 주로 사용하는 메서드는?",
    options: ["GET", "RUN", "EXEC", "BUILD"],
  },
  {
    question: "클라우드 서비스 제공자는?",
    options: ["AWS", "Linux", "Git", "Nginx"],
  },
  {
    question: "프론트엔드에서 스타일을 담당하는 것은?",
    options: ["CSS", "HTML", "Node.js", "Express"],
  },
];

export default function Survey({ params }: Route.ServerComponentProps) {
  const { data: questions } = useReadContract({
    address: params.surveyId as `0x{string}`,
    abi: SURVEY_ABI,
    functionName: "getQuestions",
    args: [],
  });
  const { data: title } = useReadContract({
    address: params.surveyId as `0x{string}`,
    abi: SURVEY_ABI,
    functionName: "title",
    args: [],
  });
  const { data: description } = useReadContract({
    address: params.surveyId as `0x{string}`,
    abi: SURVEY_ABI,
    functionName: "description",
    args: [],
  });

  const { writeContract } = useWriteContract();
  const { address } = useAccount();

  const submitAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    if (!address) {
      alert("Please connect wallet before submiting answer");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const answers: number[] = [];
    for (const value of formData.values()) {
      answers.push(Number(value));
    }
    writeContract({
      address: params.surveyId as `0x{string}`,
      abi: SURVEY_ABI,
      functionName: "submitAnswer",
      args: [
        {
          respondent: address,
          answers,
        },
      ],
    });
  };

  const { data: answers } = useReadContract({
    address: params.surveyId as `0x{string}`,
    abi: SURVEY_ABI,
    functionName: "getAnswers",
    args: [],
  });
  const { data: target } = useReadContract({
    address: params.surveyId as `0x{string}`,
    abi: SURVEY_ABI,
    functionName: "targetNumber",
    args: [],
  });
  const [counts, setCounts] = useState<Number[][]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const countAnswers = () => {
    if (!target) return;
    return questions?.map((q, i) => {
      const count = Array.from({ length: q.options.length }).fill(
        0,
      ) as number[];
      answers?.map((answer) => count[answer.answers[i]]++);
      return count.map((n) => (n / Number(target)) * 100);
    });
  };

  useEffect(() => {
    if (!answers || !questions || !address) {
      return;
    }
    for (const answer of answers) {
      if (answer.respondent === address) {
        setCounts(countAnswers() || []);
        setIsAnswered(true);
        return;
      }
    }
  }, [answers, address, target]);

  return (
    <div className="grid grid-cols-3 w-screen gap-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="font-extrabold text-3xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {isAnswered ? (
          <CardContent className="overflow-y-auto h-[70vh]">
            <h1 className="font-semibold text-xl pb-4">Survey Progress</h1>
            <div className="gap-5 grid grid-cols-2">
              {questions?.map((q, i) => (
                <div className="flex flex-col">
                  <h1 className="font-bold">{q.question}</h1>
                  <div className="flex flex-col pl-2 gap-1">
                    {q.options.map((o, j) => (
                      <div className="flex flex-row justify-center items-center relative">
                        <div className="left-2 absolute text-xs font-semibold">
                          {o}
                        </div>
                        <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-400 w-14 h-5 rounded-full"
                            style={{ width: `${counts[i][j]}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <Form onSubmit={submitAnswer} className="grid grid-cols-2">
              {questions?.map((q, i) => (
                <div className="flex flex-col">
                  <span className="mt-5 mb-1">{q.question}</span>
                  {q.options.map((o, j) => (
                    <label className="flex items-center gap-1">
                      <Input
                        type="radio"
                        name={i.toString()}
                        value={j.toString()}
                        className="hidden peer"
                      ></Input>
                      <span className="w-4 h-4 rounded-full border-2 peer-checked:bg-primary"></span>
                      <span className="font-semibold">{o}</span>
                    </label>
                  ))}
                </div>
              ))}
              <Button type="submit" className="w-full mt-5">
                Submit
              </Button>
            </Form>
          </CardContent>
        )}
      </Card>

      <Card className="col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle>Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 overflow-y-auto h-[70vh]">
          {Array.from({ length: 20 }).map((_, i) => (
            <MessageBubble sender={i % 2 == 0} />
          ))}
        </CardContent>
        <CardFooter className="w-full">
          <Form className="flex flex-row items-center relative w-full">
            <input
              type="text"
              placeholder="type a message..."
              className="border-1 w-full h-8 rounded-2xl px-2 text-xs"
            />
            <Button className="flex flex-row justify-center items-center w-6 h-6 absolute right-2">
              <SendIcon />
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
