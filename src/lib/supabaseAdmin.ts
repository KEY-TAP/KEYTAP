import "server-only";
import { createClient } from "@supabase/supabase-js";

// .env.local에 추가한 service_role 키로 생성한 클라이언트
// auth.users 접근 가능, 반드시 서버에서만 사용해야함

export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
