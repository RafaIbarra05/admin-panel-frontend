import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar breadcrumb="Inicio" />
          <main className="px-10 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
