import {
  Binary,
  Boxes,
  CodeXml,
  Coffee,
  LayoutDashboard,
  Leaf,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/",
        label: "Dashboard",
        description: "Your daily learning progress, all in one place.",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Learning Roadmap",
    items: [
      {
        href: "/java",
        label: "Java",
        description: "A 7-day plan from Java fundamentals to modern, stream-based Java.",
        icon: Coffee,
      },
      {
        href: "/coding-questions",
        label: "Coding Questions",
        description: "One problem a day, matched to that day's Java topics.",
        icon: CodeXml,
      },
      {
        href: "/spring-boot",
        label: "Spring Boot",
        description: "Building production-ready applications with Spring Boot.",
        icon: Leaf,
      },
      {
        href: "/microservices",
        label: "Microservices",
        description: "Designing, connecting, and running independent services.",
        icon: Boxes,
      },
      {
        href: "/dsa",
        label: "Data Structures & Algorithms",
        description: "Core data structures and algorithmic problem solving.",
        icon: Binary,
      },
    ],
  },
];

export function getNavItem(href: string): NavItem {
  const item = NAV_SECTIONS.flatMap((section) => section.items).find((i) => i.href === href);
  if (!item) throw new Error(`Unknown nav item: ${href}`);
  return item;
}
