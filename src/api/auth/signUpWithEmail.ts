import { supabase } from "@/api/supabaseClient";
import type { SignUpFormValues } from "@/schemas/auth/signUpSchema";

type SignUpWithEmailResult = {
  userId: string;
  email: string;
};

export async function signUpWithEmail(values: SignUpFormValues): Promise<SignUpWithEmailResult> {
  const {
    email,
    password,
    name,
    phone,
    zipCode,
    address1,
    address2,
    agreeTerms,
    agreePrivacy,
    agreeMarketing,
  } = values;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    const message = authError.message.toLowerCase();

    if (
      message.includes("already registered") ||
      message.includes("already been registered") ||
      message.includes("user already registered")
    ) {
      throw new Error("이미 가입된 이메일 입니다.");
    }

    throw new Error(authError.message);
  }

  const user = authData.user;

  if (!user?.id || !user.email) {
    throw new Error("회원가입 사용자 정보를 가져오지 못했습니다.");
  }

  const userId = user.id;

  const { error: usersError } = await supabase.from("users").insert({
    user_id: userId,
    signup_provider: "email",
  });

  if (usersError) {
    throw new Error(`users 저장 실패: ${usersError.message}`);
  }

  const { error: profileError } = await supabase.from("user_profiles").insert({
    user_id: userId,
    name,
    phone,
  });

  if (profileError) {
    throw new Error(`user_profiles 저장 실패: ${profileError.message}`);
  }

  const { error: addressError } = await supabase.from("user_address").insert({
    fk_user_id: userId,
    zip_code: zipCode,
    address1,
    address2,
  });

  if (addressError) {
    throw new Error(`user_address 저장 실패: ${addressError.message}`);
  }

  const { error: agreementsError } = await supabase.from("user_agreements").insert({
    fk_user_id: userId,
    terms_of_service: agreeTerms,
    privacy_policy: agreePrivacy,
    marketing: agreeMarketing,
  });

  if (agreementsError) {
    throw new Error(`user_agreements 저장 실패: ${agreementsError.message}`);
  }

  return {
    userId,
    email: user.email,
  };
}
