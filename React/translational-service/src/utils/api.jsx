// src/utils/api.js
import axios from "axios";

export const submitTranslation = async (text, languages) => {
  const response = await axios.post("http://localhost:8000/translate", {
    text,
    languages,
  });
  //const data = await response.json();
  //console.log(response.data.task_id);
  return response.data.task_id;
};

export const checkTranslationStatus = async (taskId) => {
  const response = await axios.get(`http://localhost:8000/translate/${taskId}`);
  return response.data;
};

export const checkTranslationContent = async (taskId) => {
  const response = await axios.get(
    `http://localhost:8000/translate/content/${taskId}`
  );
  return response.data;
};
