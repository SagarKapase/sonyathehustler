import type { Metadata } from "next";
import { EmptyStatePage } from "@/components/empty-state-page";
import { getNavItem } from "@/lib/navigation";

export const metadata: Metadata = { title: "Microservices" };

export default function MicroservicesPage() {
  return <EmptyStatePage item={getNavItem("/microservices")} />;
}
