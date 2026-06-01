import { Form, type FormEncType } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/create-survey";
import { useState } from "react";
import { form } from "viem/chains";
import { useWriteContract } from "wagmi";
import { SURVEY_FACTORY, SURVEY_FACTORY_ABI } from "../constant";
import { parseEther } from "viem";

// action은 백엔드 사이드(ex. DB)에서 실행됨 -> 블록체인과 interact하려면 서명을 해야하기 때문에 브라우저 사이드에서 핸들링해야 함
// export const action = async ({ request }: Route.ActionArgs) => {
//   const formData = await request.formData();
//   console.log(formData);
// };

// [2, 3, 2]
export default function CreateSurvey() {
  // useState([]): 상태가 변할 때만 다시 렌더링할 수 있음 -> 이때, 상태가 바뀐 것만 찾아서 렌더링함
  const [options, setOptions] = useState([1]); // 여기서 "options = 배열", options를 바꾸고 싶으면 핸들러 "setOptions([])" 사용
  const [image, setImage] = useState("");
  const { writeContract } = useWriteContract();

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addQuestion = () => {
    setOptions([...options, 1]);
  };
  const deleteQuestion = () => {
    if (options.length <= 1) return;
    setOptions(options.slice(0, options.length - 1));
  };
  const addOption = (i: number) => {
    setOptions(options.map((o, j) => (i == j ? o + 1 : o)));
  };
  const deleteOption = (i: number) => {
    if (options[i] <= 1) return;
    setOptions(options.map((o, j) => (i == j ? o - 1 : o)));
  };

  interface Question {
    question: string;
    options: string[];
  }
  const createSurvey = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const questionsData = formData.getAll("q") as string[];
    const questions = questionsData.map((q, i) => {
      const options = formData.getAll(i.toString()) as string[];
      return {
        question: q,
        options,
      } as const;
    });

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const targetNumber = formData.get("target") as string;
    const poolSize = formData.get("pool") as string;

    writeContract({
      address: SURVEY_FACTORY,
      abi: SURVEY_FACTORY_ABI,
      functionName: "createSurvey",
      args: [
        {
          title,
          description,
          targetNumber: BigInt(targetNumber),
          questions,
        },
      ],
      value: parseEther(poolSize),
    });
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create Survey</CardTitle>
          <CardDescription>
            Build and publish a new survey to collect reliable responses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={(e) => createSurvey(e)} encType="multipart/form-data">
            <label className="flex flex-col mb-4">
              <h1 className="font-bold">Title</h1>
              <Input type="text" name="title" />
            </label>
            <label className="flex flex-col mb-4">
              <h1 className="font-bold">Description</h1>
              <Input type="text" name="description" />
            </label>
            <label className="flex flex-col mb-4">
              <h1 className="font-bold">Target Number</h1>
              <Input type="number" name="target" />
            </label>
            <label className="flex flex-col mb-4">
              <h1 className="font-bold">Reward Pool Size</h1>
              <Input type="number" name="pool" placeholder="ex) 50(ETH)" />
            </label>

            <h1 className="font-bold mb-2">Questions</h1>
            {options.map((n, i) => (
              <div className="mb-4">
                <Input type="text" placeholder="Question" name="q" />
                <div>
                  {/* React는 for문 같은 반복문을 HTML 사이에 직접 넣을 수 없음 */}
                  {Array.from({ length: n }).map((_, j) => (
                    <div className="flex items-center">
                      {j == n - 1 && j != 0 ? (
                        <Button
                          onClick={() => deleteOption(i)}
                          className="h-8 w-8 rounded-full mr-1 bg-red-200"
                        >
                          -
                        </Button>
                      ) : (
                        <div className="h-8 w-8 rounded-full mr-1.5"></div>
                      )}
                      <Input
                        type="text"
                        placeholder="Option"
                        name={i.toString()}
                      />
                      {j == n - 1 && (
                        <Button
                          onClick={() => addOption(i)}
                          className="h-8 w-8 rounded-full ml-1 bg-gray-300"
                        >
                          +
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-center items-center mb-4">
              <Button
                onClick={() => deleteQuestion()}
                className="h-8 w-8 rounded-full mr-1 bg-red-200"
              >
                -
              </Button>
              <Button
                onClick={() => addQuestion()}
                className="h-8 w-8 rounded-full mr-1 bg-gray-300"
              >
                +
              </Button>
            </div>

            <h1 className="font-bold mb-2">Upload file</h1>
            <Card className="mb-5">
              <CardContent>
                <div className="flex justify-center items-center relative">
                  {image ? (
                    <div className="flex justify-center items-center w-[300px] h-[300px] border-2 rounded-2xl">
                      <img
                        src={image}
                        className="rounded-2xl object-cover w-[300px] h-[300px]"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-[300px] h-[300px] border-2 rounded-2xl">
                      +
                    </div>
                  )}
                  <label className="absolute w-[300px] h-[300px] top-0">
                    <Input
                      type="file"
                      className="hidden"
                      name="image"
                      onChange={uploadFile}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" className="w-full">
              Create
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
