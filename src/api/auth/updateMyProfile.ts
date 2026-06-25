// 유저 프로필 정보를 업데이트하는 API

import { supabase } from "@/api/supabaseClient";

export type UpdateMyProfileValues = {
  name: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
};

export async function updateMyProfile(values: UpdateMyProfileValues) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("로그인 정보를 가져오지 못했습니다.");
  }

  const { error: profileError } = await supabase
    .from("user_profiles")
    .update({
      name: values.name,
    })
    .eq("user_id", user.id);

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { error: agreementError } = await supabase
    .from("user_agreements")
    .update({
      terms_of_service: values.agreeTerms,
      privacy_policy: values.agreePrivacy,
      marketing: values.agreeMarketing,
    })
    .eq("fk_user_id", user.id);

  if (agreementError) {
    throw new Error(agreementError.message);
  }

  return {
    name: values.name,
    agreeTerms: values.agreeTerms,
    agreePrivacy: values.agreePrivacy,
    agreeMarketing: values.agreeMarketing,
  };
}
