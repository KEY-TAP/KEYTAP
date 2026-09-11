import { redirect } from "next/navigation";
import AdminSidebar from "@/app/admin/_components/AdminSidebar";
import { createClient } from "@/lib/supabaseServer";

// 미들웨어와 동일한 검사를 서버 컴포넌트 레벨에서도 한 번 더 수행 (defense-in-depth)
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/LoginPage?redirect=/admin");
  }

  const { data: userRow } = await supabase
    .from("users")
    .select("user_role")
    .eq("user_id", user.id)
    .single();

  if (userRow?.user_role !== "admin" && userRow?.user_role !== "super_admin") {
    redirect("/LoginPage?redirect=/admin");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "24px 48px" }}>{children}</main>
    </div>
  );
}
