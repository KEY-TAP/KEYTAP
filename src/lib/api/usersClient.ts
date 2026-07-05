import { supabase } from "@/lib/supabaseClient";

// 현재 로그인한 유저의 role 가져오기
export async function getCurrentUserRole() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.from("users").select("user_role").eq("user_id", user.id).single();

  if (error) return null;
  return data.user_role as "user" | "admin" | "super_admin";
}

// 유저 role 변경
export async function updateUserRoleClient(userId: string, role: string) {
  const { error } = await supabase.from("users").update({ user_role: role }).eq("user_id", userId);

  if (error) throw new Error(error.message);
}

// 유저 삭제
// admin → user만 삭제 가능
// super_admin → admin, user 모두 삭제 가능
export async function deleteUserClient(userId: string) {
  const { error } = await supabase.from("users").delete().eq("user_id", userId);

  if (error) throw new Error(error.message);
}
