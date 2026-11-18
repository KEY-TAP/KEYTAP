import { supabase } from "@/lib/supabaseClient";
import { STORAGE_CACHE_CONTROL, createStorageFileName } from "@/lib/api/storageUpload";
import type { SoundType } from "@/types/sound";

// 스위치 등록
export async function createSwitchClient(payload: { switch_name: string; switch_type: string; manufacture: string }) {
  const { data, error } = await supabase.from("switches").insert(payload).select().single();

  if (error) throw new Error(error.message);
  return data;
}

// 스위치 수정
export async function updateSwitchClient(
  switchId: number,
  payload: {
    switch_name: string;
    switch_type: string;
    manufacture: string;
  },
) {
  const { error } = await supabase.from("switches").update(payload).eq("switch_id", switchId);

  if (error) throw new Error(error.message);
}

// 스위치 삭제
export async function deleteSwitchClient(switchId: number) {
  const { error } = await supabase.from("switches").delete().eq("switch_id", switchId);

  if (error) throw new Error(error.message);
}

// 사운드 파일 Storage 업로드 후 DB에 저장
export async function uploadSoundClient(file: File, switchId: number, soundType: SoundType) {
  // 원본 파일명 대신 영문 파일 이름 사용 (mp3만 등록 가능)
  const filePath = `${switchId}/${createStorageFileName("mp3")}`;

  const { error: uploadError } = await supabase.storage.from("switch-sounds").upload(filePath, file, {
    cacheControl: STORAGE_CACHE_CONTROL,
    contentType: "audio/mpeg",
  });

  if (uploadError) throw new Error(uploadError.message);

  // Storage 공개 URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from("switch-sounds").getPublicUrl(filePath);

  // sounds 테이블에 저장
  const { error: dbError } = await supabase.from("sounds").insert({
    fk_switch_id: switchId,
    sound_url: publicUrl,
    sound_type: soundType,
  });

  if (dbError) throw new Error(dbError.message);

  return publicUrl;
}

// 사운드 삭제 (Storage + DB)
export async function deleteSoundClient(soundId: number, soundUrl: string) {
  // URL에서 파일 경로 추출
  const filePath = soundUrl.split("/switch-sounds/")[1];

  const { error: storageError } = await supabase.storage.from("switch-sounds").remove([filePath]);

  if (storageError) throw new Error(storageError.message);

  const { error: dbError } = await supabase.from("sounds").delete().eq("sound_id", soundId);

  if (dbError) throw new Error(dbError.message);
}
