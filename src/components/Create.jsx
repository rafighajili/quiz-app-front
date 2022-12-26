import { useState, useEffect } from "react";
import Button from "./Button";
import Label from "./Label";
import InputField from "./InputField";
import { BiPlus, BiMinus } from "react-icons/bi";
import { addQuestion, readTypes } from "../api";
import Popup from "./Popup";
import Spinner from "./Spinner";

const Create = () => {
  const [types, setTypes] = useState([]);
  const [question, setQuestion] = useState("");
  const [typeId, setTypeId] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [mark, setMark] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const getTypes = async () => {
    try {
      const res = await readTypes();
      setTypes(res);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getTypes();
  }, []);

  useEffect(() => {
    if (typeId == 1) {
      setAnswers([
        { answer: "", isCorrect: false },
        { answer: "", isCorrect: false },
      ]);
    } else if (typeId == 2) {
      setAnswers([
        { answer: "True", isCorrect: 0 },
        { answer: "False", isCorrect: 0 },
      ]);
    } else if (typeId == 3) {
      setAnswers([
        { answer: "", isCorrect: 0 },
        { answer: "", isCorrect: 0 },
      ]);
    } else if (typeId == 4) {
      setAnswers([{ answer: "", isCorrect: 0 }]);
    } else if (typeId == 5) {
      setAnswers([{ answer: "", isCorrect: 0 }]);
    }
  }, [typeId]);

  const validateField = (field, error) => {
    if (!field) {
      setErrors((prev) => ({ ...prev, [error]: "Required!" }));
    } else {
      setErrors((prev) => ({ ...prev, [error]: "" }));
      return true;
    }
  };

  const createQuestion = async (e) => {
    e.preventDefault();

    const isValidQuestion = validateField(question, "question");
    const isValidType = validateField(typeId, "type");
    const isValidMark = validateField(mark, "mark");
    const isValidFeedback = validateField(feedback, "feedback");

    if (isValidQuestion && isValidType && isValidMark && isValidFeedback) {
      setIsPending(true);

      try {
        const formData = new FormData();

        formData.append("typeId", typeId);
        formData.append("question", question);
        formData.append("mark", mark);
        formData.append("feedback", feedback);

        if (typeId == 1) {
          formData.append(
            "answers",
            JSON.stringify(
              answers.map((answer) => ({
                ...answer,
                isCorrect: answer.isCorrect > 0 ? 100 / answers.length : (100 / answers.length) * -1,
              }))
            )
          );
        } else {
          formData.append("answers", JSON.stringify(answers));
        }

        await addQuestion(formData);

        setQuestion("");
        setTypeId(0);
        setAnswers([]);
        setMark("");
        setFeedback("");

        setErrorMsg("");
        setSuccessMsg("Question added successfully!");
        setTimeout(() => {
          setSuccessMsg("");
        }, 3000);
      } catch (error) {
        setSuccessMsg("");
        setErrorMsg("Something went wrong!");
        setTimeout(() => {
          setErrorMsg("");
        }, 3000);
      } finally {
        setIsPending(false);
      }
    }
  };

  return (
    <>
      <div>
        <h1 className="mb-8">Create a question</h1>

        {isLoading ? (
          <Spinner />
        ) : (
          <form onSubmit={createQuestion} className="flex flex-col gap-8 max-w-[600px]">
            {/* question name */}
            <InputField
              type="textarea"
              label="Question:"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              errorMsg={errors?.question}
            />

            {/* question type */}
            <div className="flex flex-col">
              <Label label="Select type:" required errorMsg={errors?.type} />
              {types?.map((type) => (
                <div key={type.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={type.id}
                    name="type"
                    checked={type.id == typeId}
                    onChange={() => setTypeId(+type.id)}
                  />
                  <label htmlFor={type.id}>{type.name}</label>
                </div>
              ))}
            </div>

            {/* answers */}
            <div className="flex flex-col">
              <Label label="Answer(s):" required errorMsg={errors?.answers} />

              {typeId == 0 && <p className="italic">Select question type</p>}

              {/* multiple choice */}
              {typeId == 1 && answers?.length && (
                <div className="flex flex-col gap-4">
                  {answers.map((answer, key) => (
                    <div key={key} className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={answer.isCorrect}
                        onChange={(e) =>
                          setAnswers(
                            answers.map((element, index) => {
                              if (index == key) {
                                return { ...element, isCorrect: e.target.checked };
                              } else {
                                return element;
                              }
                            })
                          )
                        }
                      />
                      <InputField
                        value={answer.answer ?? ""}
                        onChange={(e) =>
                          setAnswers(
                            answers.map((element, index) => {
                              if (index == key) {
                                return { ...answer, answer: e.target.value };
                              } else {
                                return element;
                              }
                            })
                          )
                        }
                      />
                    </div>
                  ))}

                  <div className="flex gap-4 self-end">
                    {answers.length != 2 && (
                      <Button
                        type="button"
                        icon={<BiMinus />}
                        outlined
                        color="red"
                        onClick={() => setAnswers((prev) => prev.slice(0, -1))}
                      >
                        Remove
                      </Button>
                    )}
                    {answers.length != 9 && (
                      <Button
                        type="button"
                        icon={<BiPlus />}
                        outlined
                        color="green"
                        onClick={() => setAnswers((prev) => [...prev, { answer: "", isCorrect: false }])}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* true/false */}
              {typeId == 2 &&
                answers?.length &&
                answers.map((answer, key) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={key == 0 ? "answerTrue" : "answerFalse"}
                      name="answerTF"
                      checked={answer.isCorrect}
                      onChange={() =>
                        setAnswers(
                          answers.map((element, index) => {
                            if (index == key) {
                              return { ...element, isCorrect: 100 };
                            } else {
                              return { ...element, isCorrect: 0 };
                            }
                          })
                        )
                      }
                    />
                    <label htmlFor={key == 0 ? "answerTrue" : "answerFalse"}>{answer.answer}</label>
                  </div>
                ))}

              {/* double choice */}
              {typeId == 3 && answers?.length && (
                <div className="flex flex-col gap-4">
                  {answers.map((answer, key) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={key == 0 ? "answerTrue" : "answerFalse"}
                        name="answerTF"
                        checked={answer.isCorrect}
                        onChange={() =>
                          setAnswers(
                            answers.map((element, index) => {
                              if (index == key) {
                                return { ...element, isCorrect: 100 };
                              } else {
                                return { ...element, isCorrect: 0 };
                              }
                            })
                          )
                        }
                      />
                      <InputField
                        value={answer.answer ?? ""}
                        onChange={(e) =>
                          setAnswers(
                            answers.map((element, index) => {
                              if (index == key) {
                                return { ...answer, answer: e.target.value };
                              } else {
                                return element;
                              }
                            })
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* numerical */}
              {typeId == 4 && !!answers && (
                <InputField
                  name="answerNumerical"
                  type="number"
                  value={answers[0]?.answer ?? "0"}
                  onChange={(e) => setAnswers([{ isCorrect: 100, answer: e.target.value }])}
                />
              )}

              {/* short */}
              {typeId == 5 && !!answers && (
                <InputField
                  name="answerShort"
                  value={answers[0]?.answer ?? ""}
                  onChange={(e) => setAnswers([{ isCorrect: 100, answer: e.target.value }])}
                />
              )}
            </div>

            {/* mark */}
            <InputField
              label="Mark:"
              type="number"
              name="mark"
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              required
              errorMsg={errors?.mark}
            />

            {/* feedback */}
            <InputField
              label="Feedback:"
              name="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              errorMsg={errors?.feedback}
            />

            <Button className="w-fit" disabled={isPending}>
              Create
            </Button>
          </form>
        )}
      </div>

      <Popup type={true} text={successMsg} />
      <Popup type={false} text={errorMsg} />
    </>
  );
};

export default Create;
