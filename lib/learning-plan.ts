/**
 * The 7-day learning plan, assembled from the Java roadmap and the daily
 * coding questions. Each day's tasks are its topics plus its coding question;
 * task ids are what gets persisted as completed in localStorage.
 */

import { CODING_QUESTIONS, type CodingQuestion } from "./content/coding-questions";
import { JAVA_DAYS } from "./content/java-roadmap";

export type TaskKind = "topic" | "question";

export interface LearningTask {
  id: string;
  kind: TaskKind;
  title: string;
  description: string;
  /** Sub-points to study (topics only). */
  points?: string[];
  /** Link to the full problem (questions only). */
  href?: string;
}

export interface LearningDay {
  day: number;
  title: string;
  shortTitle: string;
  goal: string;
  question: CodingQuestion;
  tasks: LearningTask[];
}

export function questionTaskId(question: CodingQuestion) {
  return `question-${question.slug}`;
}

export function questionHref(question: CodingQuestion) {
  return `/coding-questions/${question.slug}`;
}

export const LEARNING_PLAN: LearningDay[] = JAVA_DAYS.map((day) => {
  const question = CODING_QUESTIONS.find((q) => q.slug === day.questionSlug);
  if (!question) throw new Error(`Day ${day.day}: unknown question "${day.questionSlug}"`);

  return {
    day: day.day,
    title: day.title,
    shortTitle: day.shortTitle,
    goal: day.goal,
    question,
    tasks: [
      ...day.topics.map(
        (topic): LearningTask => ({
          id: topic.id,
          kind: "topic",
          title: topic.title,
          description: topic.summary,
          points: topic.points,
        }),
      ),
      {
        id: questionTaskId(question),
        kind: "question",
        title: question.title,
        description: question.summary,
        href: questionHref(question),
      },
    ],
  };
});
