"use client";
import { supabase } from "@/api/supabaseClient";

export default function Home() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>구글 로그인 테스트</div>
      <h1>KEYTAP</h1>
      <button onClick={handleGoogleLogin}>Google로 로그인</button>
    </div>
  );
}
