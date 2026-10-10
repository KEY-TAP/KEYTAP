// 타건음(single) 재생용 Web Audio 헬퍼
// 키 누를 때마다 new Audio()로 파일을 새로 불러오면 모바일에서 지연이 커서,
// 파일을 한 번만 받아서 디코딩해두고 누를 때마다 메모리에 있는 소리를 바로 재생해줌

let audioContext: AudioContext | null = null;

// url별로 디코딩이 끝난 소리 / 로딩 중인 요청 저장 (같은 파일을 두 번 받지 않게)
const bufferCache = new Map<string, AudioBuffer>();
const loadingCache = new Map<string, Promise<AudioBuffer | null>>();

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!audioContext) {
    // 구형 사파리는 webkit 접두사가 붙어있어서 같이 체크
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

// 모바일(iOS 등)은 사용자 터치 후에야 소리가 허용돼서, 터치/클릭 때 한 번 깨워줌
export function unlockKeySound() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

// 타건음 파일을 미리 받아서 디코딩 (실패하면 null, 같은 url은 한 번만 시도)
export function preloadKeySound(url: string): Promise<AudioBuffer | null> {
  const cached = bufferCache.get(url);
  if (cached) return Promise.resolve(cached);

  const loading = loadingCache.get(url);
  if (loading) return loading;

  const ctx = getAudioContext();
  if (!ctx) return Promise.resolve(null);

  const request = fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) => ctx.decodeAudioData(data))
    .then((decoded) => {
      bufferCache.set(url, decoded);
      return decoded;
    })
    .catch(() => null);

  loadingCache.set(url, request);
  return request;
}

// 미리 받아둔 타건음 즉시 재생 (연타해도 겹쳐서 재생됨)
// 아직 준비 안 됐거나 Web Audio를 못 쓰면 false 반환 → 호출하는 쪽에서 기존 방식으로 대체
export function playKeySound(url: string): boolean {
  const ctx = getAudioContext();
  const buffer = bufferCache.get(url);
  if (!ctx || !buffer) return false;

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);

  return true;
}
