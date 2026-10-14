import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionDetail } from "@/components/question-detail";
import { CODING_QUESTIONS, getQuestionBySlug } from "@/lib/content/coding-questions";

type Params = PageProps<"/coding-questions/[slug]">["params"];

export function generateStaticParams() {
  return CODING_QUESTIONS.map((question) => ({ slug: question.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  return { title: question ? question.title : "Question not found" };
}

// Reading `params` happens inside Suspense so navigations between questions
// can show the shell immediately. Every known slug is still fully prerendered.
export default function QuestionPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<QuestionSkeleton />}>
      <Question params={params} />
    </Suspense>
  );
}

async function Question({ params }: { params: Params }) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) notFound();

  return <QuestionDetail question={question} />;
}

function QuestionSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4" aria-hidden="true">
      <div className="h-3 w-28 rounded bg-zinc-200/70" />
      <div className="h-6 w-64 rounded bg-zinc-200/70" />
      <div className="h-24 rounded-md bg-zinc-100" />
    </div>
  );
}
