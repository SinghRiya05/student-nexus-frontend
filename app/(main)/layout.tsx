import MainLayoutClient from "./MainLayoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudentNexus",
  description: "Manage your travel business efficiently.",
};

export default function MainLayout({ children }: { children: React.ReactNode; }) {
  return <MainLayoutClient>{children}</MainLayoutClient>;
}
