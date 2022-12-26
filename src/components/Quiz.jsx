import { useEffect, useState } from "react";
import { readAnswers, readQuestions } from "../api";
import Button from "./Button";
import InputField from "./InputField";
import { BiCheck, BiX } from "react-icons/bi";
import Spinner from "./Spinner";

const isArraysEqual = (a, b) => {
  a.sort((a, b) => a.localeCompare(b));
  b.sort((a, b) => a.localeCompare(b));
  return JSON.stringify(a) == JSON.stringify(b);
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [myAnswers, setMyAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (questions.length) {
      setMyAnswers(
        questions.map((question) => {
          if (question.typeId == 1) {
            return { questionId: question.id, answer: [] };
          } else {
            return { questionId: question.id, answer: "" };
          }
        })
      );
    }
  }, [questions]);

  return (
    <div>
      <h1 className="mb-8">Take a quiz</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-8">
          {questions?.map((question, index) => (
            <div
              key={question.id}
              className="flex flex-col gap-4 border border-neutral-300 bg-neutral-100 rounded-xl p-4"
            >
              {/* question */}
              <div className="grid grid-cols-[1fr,auto] gap-4">
                <div className="flex flex-col">
                  <h2 className="text-lg font-light">{question.question}</h2>
                  <p className="text-sm font-medium">
                    ({question.type}) (Mark: {question.mark})
                  </p>
                  {isCompleted && (
                    <p className="text-sm font-medium text-orange-500 mt-2">
                      <span className="underline">Feedback:</span> {question.feedback}
                    </p>
                  )}
                </div>
                <span className="bg-orange-200 text-orange-500 select-none w-6 h-6 text-sm font-medium flex items-center justify-center rounded-full">
                  {index + 1}
                </span>
              </div>

              <span className="w-full h-[1px] bg-neutral-300" />

              {/* answer(s) */}
              {question.typeId == 1 || question.typeId == 2 || question.typeId == 3 ? (
                <ul className="flex flex-col gap-2">
                  {answers
                    ?.filter((answer) => +answer.questionId === +question.id)
                    .map((answer) => (
                      <li key={answer.id} className="flex flex-wrap items-center gap-2">
                        {question.typeId == 1 ? (
                          <input
                            type="checkbox"
                            name={question.id}
                            id={answer.id}
                            checked={
                              myAnswers
                                .find((myAnswer) => question.id == myAnswer.questionId)
                                ?.answer.includes(answer.id) ?? false
                            }
                            onChange={() =>
                              setMyAnswers((prev) =>
                                prev?.map((myAnswer) => {
                                  if (question.id == myAnswer.questionId) {
                                    if (myAnswer.answer.includes(answer.id)) {
                                      return {
                                        questionId: myAnswer.questionId,
                                        answer: myAnswer.answer.filter((item) => item != answer.id),
                                      };
                                    } else {
                                      return {
                                        questionId: myAnswer.questionId,
                                        answer: [...myAnswer.answer, answer.id],
                                      };
                                    }
                                  } else {
                                    return myAnswer;
                                  }
                                })
                              )
                            }
                            disabled={isCompleted}
                          />
                        ) : (
                          <input
                            type="radio"
                            name={question.id}
                            id={answer.id}
                            checked={
                              myAnswers.find((myAnswer) => question.id == myAnswer.questionId)?.answer == answer.id ??
                              false
                            }
                            onChange={() =>
                              setMyAnswers((prev) =>
                                prev?.map((myAnswer) => {
                                  if (question.id == myAnswer.questionId) {
                                    return { questionId: myAnswer.questionId, answer: answer.id };
                                  } else {
                                    return myAnswer;
                                  }
                                })
                              )
                            }
                            disabled={isCompleted}
                          />
                        )}
                        <label htmlFor={answer.id} className="font-light">
                          {answer.answer}
                        </label>
                        {isCompleted &&
                          (answer.isCorrect > 0 ? (
                            <BiCheck className="text-xl text-green-500" />
                          ) : (
                            <BiX className="text-xl text-red-500" />
                          ))}
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="flex items-center gap-2">
                  <InputField
                    type={question.typeId == 4 ? "number" : "text"}
                    className="max-w-[300px]"
                    value={myAnswers.find((myAnswer) => question.id == myAnswer.questionId)?.answer ?? ""}
                    onChange={(e) =>
                      setMyAnswers((prev) =>
                        prev?.map((myAnswer) => {
                          if (question.id == myAnswer.questionId) {
                            return { questionId: myAnswer.questionId, answer: e.target.value };
                          } else {
                            return myAnswer;
                          }
                        })
                      )
                    }
                    disabled={isCompleted}
                  />
                  {isCompleted &&
                    (myAnswers.find((myAnswer) => myAnswer.questionId == question.id)?.answer ==
                    answers.find((answer) => answer.questionId == question.id)?.answer ? (
                      <BiCheck className="text-xl text-green-500" />
                    ) : (
                      <BiX className="text-xl text-red-500" />
                    ))}
                </div>
              )}

              {/* correction */}
              {isCompleted && (
                <div className="bg-orange-100 rounded-md p-4 text-orange-500 flex flex-col gap-2">
                  <h2 className="text-sm font-bold">Correction:</h2>
                  <ul className="flex flex-col">
                    {answers
                      ?.filter((answer) => answer.questionId == question.id && answer.isCorrect > 0)
                      .map((answer) => (
                        <li key={answer.id} className="text-sm font-medium">
                          {answer.answer}
                        </li>
                      ))}
                  </ul>

                  <p className="text-sm italic">
                    {question.typeId == 1 &&
                      (isArraysEqual(
                        answers
                          .filter((answer) => +answer.questionId == question.id && answer.isCorrect > 0)
                          .map((answer) => answer.id),
                        myAnswers.find((answer) => answer.questionId == question.id)["answer"]
                      )
                        ? "Your answer is correct!"
                        : "Your answer is incorrect!")}

                    {(question.typeId == 2 || question.typeId == 3) &&
                      (myAnswers.find((myAnswer) => myAnswer.questionId == question.id)?.answer ==
                      answers.find((answer) => answer.questionId == question.id && answer.isCorrect > 0)?.id
                        ? "Your answer is correct!"
                        : "Your answer is incorrect!")}

                    {(question.typeId == 4 || question.typeId == 5) &&
                      (myAnswers.find((myAnswer) => myAnswer.questionId == question.id)?.answer ==
                      answers.find((answer) => answer.questionId == question.id)?.answer
                        ? "Your answer is correct!"
                        : "Your answer is incorrect!")}
                  </p>
                </div>
              )}
            </div>
          ))}

          {isCompleted ? (
            <Button
              className="w-fit self-end"
              onClick={() => {
                setIsCompleted(false);
                setMyAnswers(
                  questions.map((question) => {
                    if (question.typeId == 1) {
                      return { questionId: question.id, answer: [] };
                    } else {
                      return { questionId: question.id, answer: "" };
                    }
                  })
                );
              }}
            >
              Start again
            </Button>
          ) : (
            <Button className="w-fit self-end" onClick={() => setIsCompleted(true)}>
              Complete quiz
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
