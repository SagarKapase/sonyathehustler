import Link from "next/link";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { CODING_QUESTIONS, type CodingQuestion } from "@/lib/content/coding-questions";
import { cn } from "@/lib/cn";
import { LEARNING_PLAN, questionHref, questionTaskId } from "@/lib/learning-plan";
import { DifficultyBadge } from "./ui/difficulty-badge";
import { RichText } from "./ui/rich-text";
import { SolvedToggle } from "./solved-toggle";

export function QuestionDetail({ question }: { question: CodingQuestion }) {
  const index = CODING_QUESTIONS.findIndex((q) => q.slug === question.slug);
  const prev = CODING_QUESTIONS[index - 1];
  const next = CODING_QUESTIONS[index + 1];
  const day = LEARNING_PLAN.find((d) => d.day === question.day);

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href="/coding-questions"
          className="inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft className="size-3" />
          Coding Questions
        </Link>

        <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[11px] text-zinc-400 uppercase">
              Day {question.day}
              {day && ` · ${day.title}`}
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">{question.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <DifficultyBadge difficulty={question.difficulty} />
              {question.concepts.map((concept) => (
                <span key={concept} className="rounded bg-zinc-100 px-1.5 py-px text-[11px] text-zinc-600">
                  {concept}
                </span>
              ))}
            </div>
          </div>
          <SolvedToggle taskId={questionTaskId(question)} />
        </header>
      </div>

      <Section title="Problem">
        <div className="space-y-3">
          {question.statement.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-zinc-800">
              <RichText text={paragraph} />
            </p>
          ))}
        </div>
      </Section>

      {question.signature && (
        <Section title="Signature">
          <CodeBlock code={question.signature} />
        </Section>
      )}

      {question.requirements && (
        <Section title="Requirements">
          <BulletList items={question.requirements} />
        </Section>
      )}

      {question.sampleUsage && (
        <Section title="Example usage">
          <CodeBlock code={question.sampleUsage} />
        </Section>
      )}

      {question.examples && (
        <Section title="Examples">
          <div className="space-y-3">
            {question.examples.map((example, i) => (
              <div key={example.input} className="rounded-md border border-zinc-200 bg-white">
                <p className="border-b border-zinc-100 px-3 py-1.5 text-[11px] font-medium text-zinc-500">
                  Example {i + 1}
                </p>
                <dl className="space-y-1.5 px-3 py-2.5 text-[13px]">
                  <ExampleRow label="Input" value={example.input} mono />
                  <ExampleRow label="Output" value={example.output} mono />
                  {example.explanation && <ExampleRow label="Why" value={example.explanation} />}
                </dl>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Constraints">
        <BulletList items={question.constraints} />
      </Section>

      <Section title="Hints">
        <div className="space-y-2">
          {question.hints.map((hint, i) => (
            <details key={hint} className="group rounded-md border border-zinc-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-[13px] text-zinc-700 select-none hover:text-zinc-900 [&::-webkit-details-marker]:hidden">
                <Lightbulb className="size-3.5 text-zinc-400" />
                Hint {i + 1}
                <span className="ml-auto text-[11px] text-zinc-400 group-open:hidden">Reveal</span>
              </summary>
              <p className="border-t border-zinc-100 px-3 py-2.5 text-[13px] leading-relaxed text-zinc-700">
                <RichText text={hint} />
              </p>
            </details>
          ))}
        </div>
      </Section>

      {question.followUp && (
        <Section title="Follow-up">
          <p className="rounded-md border-l-2 border-accent bg-accent-soft/50 px-3 py-2.5 text-[13px] leading-relaxed text-zinc-800">
            <RichText text={question.followUp} />
          </p>
        </Section>
      )}

      <nav className="flex items-stretch justify-between gap-3 border-t border-zinc-200 pt-6">
        {prev ? (
          <PagerLink href={questionHref(prev)} label="Previous" title={prev.title} direction="prev" />
        ) : (
          <span />
        )}
        {next && <PagerLink href={questionHref(next)} label="Next" title={next.title} direction="next" />}
      </nav>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[11px] font-medium tracking-wide text-zinc-500 uppercase">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-zinc-800">
          <span className="mt-[9px] size-1 shrink-0 rounded-full bg-zinc-400" aria-hidden="true" />
          <span>
            <RichText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-[12.5px] leading-relaxed text-zinc-800">
      <code>{code}</code>
    </pre>
  );
}

function ExampleRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[56px_1fr] gap-2">
      <dt className="text-zinc-500">{label}</dt>
      <dd className={mono ? "font-mono text-[12.5px] break-words text-zinc-900" : "text-zinc-700"}>{value}</dd>
    </div>
  );
}

function PagerLink({
  href,
  label,
  title,
  direction,
}: {
  href: string;
  label: string;
  title: string;
  direction: "prev" | "next";
}) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={href}
      className={cn(
        "group flex max-w-[48%] flex-col rounded-md border border-zinc-200 bg-white px-3 py-2 transition-colors hover:border-zinc-300 hover:bg-zinc-50",
        direction === "next" && "ml-auto items-end text-right",
      )}
    >
      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
        {direction === "prev" && <Icon className="size-3" />}
        {label}
        {direction === "next" && <Icon className="size-3" />}
      </span>
      <span className="mt-0.5 text-[13px] font-medium text-zinc-900 group-hover:text-accent">{title}</span>
    </Link>
  );
}
