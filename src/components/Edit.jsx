import { useEffect, useState } from "react";
import { readAnswers, readQuestions } from "../api";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const Edit = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await readQuestions();
      setQuestions(res);
      setIsLoading(false);
    } catch (error) {}
  };

  const getAnswers = async () => {
    setIsLoading(true);
    try {
      const res = await readAnswers();
      setAnswers(res);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getQuestions();
    getAnswers();
  }, []);

  return (
    <div>
      <h1 className="mb-8">You can edit or delete questions</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-8">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="flex flex-col gap-4 border border-neutral-300 bg-neutral-100 rounded-xl p-4"
            >
              {/* questions */}
              <div className="grid grid-cols-[1fr,auto] gap-4">
                <div className="flex flex-col">
                  <h2 className="text-lg font-light">{question.question}</h2>
                  <p className="text-sm font-medium">
                    ({question.type}) (Mark: {question.mark})
                  </p>
                  <p className="text-sm font-medium text-orange-500 mt-2">
                    <span className="underline">Feedback:</span> {question.feedback}
                  </p>
                </div>
                <span className="bg-orange-200 text-orange-500 select-none w-6 h-6 text-sm font-medium flex items-center justify-center rounded-full">
                  {index + 1}
                </span>
              </div>

              <span className="w-full h-[1px] bg-neutral-300" />

              <ul className="flex flex-col gap-2">
                {answers
                  ?.filter((answer) => +answer.questionId === +question.id)
                  .map((answer) => (
                    <li key={answer.id} className="flex flex-wrap items-center gap-2">
                      <p className="font-light">{answer.answer}</p>
                      <p className={`text-xs font-medium ${answer.isCorrect > 0 ? "text-green-500" : "text-red-500"}`}>
                        (Point: {Math.round(answer.isCorrect * 100) / 100})
                      </p>
                    </li>
                  ))}
              </ul>

              <span className="w-full h-[1px] bg-neutral-300" />

              {/* button */}
              <Button className="w-fit self-end" onClick={() => navigate(`/question/${question.id}`)}>
                Go to question
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Edit;
