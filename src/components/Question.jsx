import Modal from "./Modal";
import { TiWarning } from "react-icons/ti";
import { useState, useEffect } from "react";
import Button from "./Button";
import { BiChevronLeft, BiMinus, BiPlus } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { readQuestionById, readAnswersByQuestionId, deleteQuestion, edit } from "../api";
import Popup from "./Popup";
import Spinner from "./Spinner";
import InputField from "./InputField";

const Question = () => {
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState({});
  const [editingAnswers, setEditingAnswers] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  const getQuestion = async () => {
    setIsLoading(true);
    try {
      const res = await readQuestionById(id);
      setQuestion(res[0]);
      setEditingQuestion(res[0]);
      setIsLoading(false);
    } catch (error) {
      navigate(-1);
    }
  };

  const getAnswersByQuestionId = async () => {
    setIsLoading(true);
    try {
      const res = await readAnswersByQuestionId(id);
      setAnswers(res);
      setEditingAnswers(res);
      setIsLoading(false);
    } catch (error) {
      navigate(-1);
    }
  };

  useEffect(() => {
    getQuestion();
    getAnswersByQuestionId();
  }, []);

  const removeQuestion = async () => {
    try {
      await deleteQuestion(id);
      navigate(-1);
    } catch (error) {
      setErrorMsg("Cannot delete question!");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  };

  const cancelEditing = () => {
    setInEditMode(false);
    setEditingQuestion(question);
    setEditingAnswers(answers);
  };

  const onEdit = async () => {
    setIsPending(true);

    try {
      const formData = new FormData();

      formData.append("questionId", editingQuestion.id);
      formData.append("question", editingQuestion.question);
      formData.append("mark", editingQuestion.mark);
      formData.append("feedback", editingQuestion.feedback);

      if (question.typeId == 1) {
        formData.append(
          "answers",
          JSON.stringify(
            editingAnswers.map((answer) => ({
              ...answer,
              isCorrect: answer.isCorrect > 0 ? 100 / answers.length : (100 / answers.length) * -1,
            }))
          )
        );
      } else {
        formData.append("answers", JSON.stringify(editingAnswers));
      }

      await edit(formData);

      setQuestion(editingQuestion);
      if (question.typeId == 1) {
        setAnswers(
          editingAnswers.map((answer) => ({
            ...answer,
            isCorrect: answer.isCorrect > 0 ? 100 / answers.length : (100 / answers.length) * -1,
          }))
        );
      } else {
        setAnswers(editingAnswers);
      }
      setInEditMode(false);

      setErrorMsg("");
      setSuccessMsg("Question edited successfully!");
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
  };

  return (
    <>
      <div>
        <Button
          className="rounded-full w-fit mb-8"
          icon={<BiChevronLeft className="text-xl" />}
          onClick={() => navigate(-1)}
        >
          Go back
        </Button>

        {isLoading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-4 border border-neutral-300 bg-neutral-100 rounded-xl p-4">
            <div className={`flex flex-col ${inEditMode ? "gap-2" : "gap-0"}`}>
              {inEditMode ? (
                <>
                  {/* question name */}
                  <InputField
                    type="textarea"
                    label="Question:"
                    name="question"
                    value={editingQuestion.question}
                    onChange={(e) => setEditingQuestion((prev) => ({ ...prev, question: e.target.value }))}
                    required
                    errorMsg={errors?.question}
                  />

                  {/* feedback */}
                  <InputField
                    label="Feedback:"
                    name="feedback"
                    value={editingQuestion.feedback}
                    onChange={(e) => setEditingQuestion((prev) => ({ ...prev, feedback: e.target.value }))}
                    required
                    errorMsg={errors?.feedback}
                  />

                  {/* mark */}
                  <InputField
                    label="Mark:"
                    type="number"
                    name="mark"
                    value={editingQuestion.mark}
                    onChange={(e) => setEditingQuestion((prev) => ({ ...prev, mark: e.target.value }))}
                    required
                    errorMsg={errors?.mark}
                    className="sm:w-1/2"
                  />

                  <p className="text-sm font-medium mt-2">({question.type})</p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-light">{question.question}</h2>
                  <p className="text-sm font-medium">
                    ({question.type}) (Mark: {question.mark})
                  </p>
                  <p className="text-sm font-medium text-orange-500 mt-2">
                    <span className="underline">Feedback:</span> {question.feedback}
                  </p>
                </>
              )}
            </div>

            <span className="w-full h-[1px] bg-neutral-300" />

            <ul className={`flex flex-col gap-2 ${inEditMode ? "sm:w-1/2" : "w-full"}`}>
              {inEditMode
                ? editingAnswers?.map((answer, key) => (
                    <li key={answer.id} className="flex items-center gap-2">
                      {
                        /* multiple choice */
                        question.typeId == 1 ? (
                          <>
                            <input
                              type="checkbox"
                              checked={answer.isCorrect > 0}
                              onChange={(e) =>
                                setEditingAnswers(
                                  editingAnswers.map((element) => {
                                    if (answer.id == element.id) {
                                      return { ...answer, isCorrect: e.target.checked };
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
                                setEditingAnswers(
                                  editingAnswers.map((element) => {
                                    if (answer.id == element.id) {
                                      return { ...answer, answer: e.target.value };
                                    } else {
                                      return element;
                                    }
                                  })
                                )
                              }
                            />
                          </>
                        ) : /* true/false */
                        question.typeId == 2 ? (
                          <>
                            <input
                              type="radio"
                              id={key == 0 ? "answerTrue" : "answerFalse"}
                              name="answerTF"
                              checked={answer.isCorrect == 100}
                              onChange={() =>
                                setEditingAnswers(
                                  editingAnswers.map((element) => {
                                    if (answer.id == element.id) {
                                      return { ...element, isCorrect: 100 };
                                    } else {
                                      return { ...element, isCorrect: 0 };
                                    }
                                  })
                                )
                              }
                            />
                            <label htmlFor={key == 0 ? "answerTrue" : "answerFalse"}>{answer.answer}</label>
                          </>
                        ) : /* double choice */
                        question.typeId == 3 ? (
                          <>
                            {" "}
                            <input
                              type="radio"
                              id={key == 0 ? "answerTrue" : "answerFalse"}
                              name="answerTF"
                              checked={answer.isCorrect}
                              onChange={() =>
                                setEditingAnswers(
                                  editingAnswers.map((element) => {
                                    if (answer.id == element.id) {
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
                                setEditingAnswers(
                                  editingAnswers.map((element) => {
                                    if (answer.id == element.id) {
                                      return { ...answer, answer: e.target.value };
                                    } else {
                                      return element;
                                    }
                                  })
                                )
                              }
                            />
                          </>
                        ) : /* numerical */
                        question.typeId == 4 ? (
                          <>
                            <InputField
                              name="answerNumerical"
                              type="number"
                              value={editingAnswers[0]?.answer ?? "0"}
                              onChange={(e) => setEditingAnswers([{ isCorrect: 100, answer: e.target.value }])}
                            />
                          </>
                        ) : /* short */
                        question.typeId == 5 ? (
                          <>
                            <InputField
                              name="answerShort"
                              value={editingAnswers[0]?.answer ?? ""}
                              onChange={(e) => setEditingAnswers([{ isCorrect: 100, answer: e.target.value }])}
                            />
                          </>
                        ) : null
                      }
                    </li>
                  ))
                : answers?.map((answer) => (
                    <li key={answer.id} className="flex flex-wrap items-center gap-2">
                      <p className="font-light">{answer.answer}</p>
                      <p className={`text-xs font-medium ${answer.isCorrect > 0 ? "text-green-500" : "text-red-500"}`}>
                        (Point: {Math.round(answer.isCorrect * 100) / 100})
                      </p>
                    </li>
                  ))}
            </ul>

            <span className="w-full h-[1px] bg-neutral-300" />

            {/* buttons */}
            <div className="grid grid-cols-2 gap-2 w-[210px] self-end">
              {inEditMode ? (
                <>
                  <Button color="red" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button color="green" onClick={onEdit} disabled={isPending}>
                    Done
                  </Button>
                </>
              ) : (
                <>
                  <Button color="red" onClick={() => setIsDeleteModalVisible(true)}>
                    Delete
                  </Button>
                  <Button onClick={() => setInEditMode(true)} disabled={isPending}>
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal isVisible={isDeleteModalVisible} setIsVisible={setIsDeleteModalVisible}>
        <div className="flex flex-col items-center gap-4 py-4">
          <TiWarning className="text-7xl text-red-500" />
          <p className="text-2xl font-light">Are you really want to delete this question?</p>
          <div className="grid grid-cols-2 w-[240px] gap-4">
            <Button onClick={() => setIsDeleteModalVisible(false)}>Keep</Button>
            <Button color="red" onClick={removeQuestion}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Popup type={true} text={successMsg} />
      <Popup type={false} text={errorMsg} />
    </>
  );
};

export default Question;
