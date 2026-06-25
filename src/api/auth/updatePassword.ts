// 유저 비밀번호를 업데이트하는 API

import { supabase } from "@/api/supabaseClient";

export type UpdatePasswordPayload = {
  currentPassword: string;
  password: string;
};

export async function updatePassword({ currentPassword, password }: UpdatePasswordPayload) {
  const { error } = await supabase.auth.updateUser({
    password,
    current_password: currentPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}
