// DB에는 "키보드, 저소음, #적축" 처럼 콤마로 구분된 문자열로 저장돼 있어서 배열로 바꿔줌
// 앞에 붙은 #은 화면에서 다시 붙이니까 여기서 떼고, 빈 값은 버림
export function parseHashtags(hashtags?: string | null): string[] {
  if (!hashtags) return [];

  return hashtags
    .split(",")
    .map((tag) => tag.trim().replace(/^#+/, "").trim())
    .filter((tag) => tag.length > 0);
}
