import type { Metadata } from "next";
import { JavaRoadmap } from "@/components/java-roadmap";

export const metadata: Metadata = { title: "Java" };

export default function JavaPage() {
  return <JavaRoadmap />;
}
