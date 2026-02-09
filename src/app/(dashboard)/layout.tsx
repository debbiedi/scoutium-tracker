import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/components/AuthProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Sidebar />
      <main className="ml-64 min-h-screen p-6">
        {children}
      </main>
    </AuthProvider>
  );
}
