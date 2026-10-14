import type { Metadata } from "next";
import { EmptyStatePage } from "@/components/empty-state-page";
import { getNavItem } from "@/lib/navigation";

export const metadata: Metadata = { title: "Spring Boot" };

export default function SpringBootPage() {
  return <EmptyStatePage item={getNavItem("/spring-boot")} />;
}
