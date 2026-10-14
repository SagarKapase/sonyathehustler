import type { Metadata } from "next";
import { CodingQuestionsList } from "@/components/coding-questions-list";

export const metadata: Metadata = { title: "Coding Questions" };

export default function CodingQuestionsPage() {
  return <CodingQuestionsList />;
}
