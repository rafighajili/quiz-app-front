import axios from "axios";

const customAxios = axios.create({ baseURL: "https://rafighajilihwproject.000webhostapp.com" });

/* types */
export const readTypes = async () => {
  const res = await customAxios.get("/get-types.php");
  return res.data;
};

/* questions */
export const readQuestions = async () => {
  const res = await customAxios.get("/get-questions.php");
  return res.data;
};

export const readQuestionById = async (id) => {
  const res = await customAxios.post(`/get-question-by-id.php?id=${id}`);
  return res.data;
};

export const addQuestion = async (data) => {
  const res = await customAxios.post("/add.php", data);
  return res.data;
};

export const deleteQuestion = async (id) => {
  const res = await customAxios.get(`/delete-question.php?id=${id}`);
  return res.data;
};

/* answers */
export const readAnswers = async () => {
  const res = await customAxios.get("/get-answers.php");
  return res.data;
};

export const readAnswersByQuestionId = async (id) => {
  const res = await customAxios.get(`/get-answers-by-question-id.php?id=${id}`);
  return res.data;
};

export const deleteAnswer = async (id) => {
  const res = await customAxios.get(`/delete-answer.php?id=${id}`);
  return res.data;
};

/* edit */
export const edit = async (data) => {
  const res = await customAxios.post("/edit.php", data);
  return res.data;
};
