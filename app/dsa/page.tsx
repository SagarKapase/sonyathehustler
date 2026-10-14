import type { Metadata } from "next";
import { EmptyStatePage } from "@/components/empty-state-page";
import { getNavItem } from "@/lib/navigation";

export const metadata: Metadata = { title: "Data Structures & Algorithms" };

export default function DsaPage() {
  return <EmptyStatePage item={getNavItem("/dsa")} />;
}
