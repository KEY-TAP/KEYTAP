import { createClient } from "@/lib/supabaseServer";

export async function getSwitches() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("switches")
    .select(
      `
      switch_id,
      switch_name,
      switch_type,
      manufacture,
      created_at,
      sounds (
        sound_id,
        sound_url,
        sound_type
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getSwitchById(switchId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("switches") // ← 수정
    .select(
      `
      switch_id,
      switch_name,
      switch_type,
      manufacture,
      sounds (
        sound_id,
        sound_url,
        sound_type
      )
    `,
    )
    .eq("switch_id", switchId)
    .single(); // ← 추가

  if (error) throw new Error(error.message);
  return data;
}
