import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Nexus Admin Dashboard",
  description: "Manage your educational platform efficiently.",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
