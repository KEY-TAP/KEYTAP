// 유저 프로필 정보를 가져오는 API

import { supabase } from "@/lib/supabaseClient";

export type MyProfile = {
  email: string;
  name: string;
  phone: string;
  birthDate: string | null;
  gender: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
};

export async function getMyProfile(): Promise<MyProfile> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("로그인 정보를 가져오지 못했습니다.");
  }

  const { data: profileData, error: profileError } = await supabase.from("user_profiles").select("name, phone, birth_date, gender").eq("user_id", user.id).maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data: agreementData, error: agreementError } = await supabase.from("user_agreements").select("terms_of_service, privacy_policy, marketing").eq("fk_user_id", user.id).maybeSingle();

  if (agreementError) {
    throw new Error(agreementError.message);
  }

  return {
    email: user.email ?? "",
    name: profileData?.name ?? user.user_metadata?.name ?? user.user_metadata?.full_name ?? "",
    phone: profileData?.phone ?? "",
    birthDate: profileData?.birth_date ?? null,
    gender: profileData?.gender ?? "",
    agreeTerms: agreementData?.terms_of_service ?? false,
    agreePrivacy: agreementData?.privacy_policy ?? false,
    agreeMarketing: agreementData?.marketing ?? false,
  };
}
