import axios from "axios";
import type { Category } from "../interfaces/category";
import type { Question } from "../interfaces/question";

const instance = axios.create({
  baseURL: "https://quizapi.io/api/",
  headers: { "X-Api-Key": import.meta.env.VITE_API_KEY },
  // timeout: 1000,
});

export async function getCategories(): Promise<Category[]> {
  const response = await instance.get("v1/categories");

  return response.data;
}

export async function getQuestions(category: string): Promise<Question[]> {
  const response = await instance.get(`v1/questions?category=${category}&limit=10`)

  return response.data;
}