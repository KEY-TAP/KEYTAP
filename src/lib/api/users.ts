import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

// 유저 목록 조회
// auth.users에서 이메일 + users/user_profiles에서 나머지 정보 가져오기
export async function getUsers() {
  // 1. auth.users에서 이메일 목록 가져오기 (Admin API)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  if (authError) throw new Error(authError.message);

  // 2. users + user_profiles 조인해서 가져오기
  const supabase = await createClient();
  const { data: usersData, error: usersError } = await supabase
    .from("users")
    .select(
      `
      user_id,
      user_role,
      created_at,
      user_profiles (
        name,
        phone
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (usersError) throw new Error(usersError.message);

  // 3. auth.users 이메일과 users 데이터 합치기
  const merged = usersData?.map((user) => {
    const authUser = authData.users.find((a) => a.id === user.user_id);
    const profile = Array.isArray(user.user_profiles)
      ? user.user_profiles[0] // 배열이면 첫번째 요소
      : user.user_profiles; // 객체면 그대로

    return {
      user_id: user.user_id,
      email: authUser?.email ?? "-",
      user_role: user.user_role,
      created_at: user.created_at,
      name: profile?.name ?? "-", // profile이 undefined여도 안전
      phone: profile?.phone ?? "-", // profile이 undefined여도 안전
    };
  });

  return merged ?? [];
}

// 유저 role 변경
export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("users").update({ user_role: role }).eq("user_id", userId);

  if (error) throw new Error(error.message);
}
