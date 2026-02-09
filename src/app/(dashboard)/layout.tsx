import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { AuthProvider } from "@/components/AuthProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Sidebar />
      <MobileNav />
      <main className="min-h-screen p-4 pt-20 lg:pt-6 lg:ml-64 lg:p-6">
        {children}
      </main>
    </AuthProvider>
  );
}
