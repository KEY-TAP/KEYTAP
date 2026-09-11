import { createClient } from "@/lib/supabaseServer";

const PRODUCT_SELECT = `
  product_id,
  product_name,
  description,
  product_images (
    image_url,
    is_primary
  ),
  product_switches (
    is_default,
    switches (
      switch_id,
      switch_name,
      switch_type,
      sounds (
        sound_id,
        sound_url,
        sound_type
      )
    )
  )
`;

export async function getMainProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((product) => {
    const primaryImage =
      product.product_images?.find((img) => img.is_primary) ??
      product.product_images?.[0];

    // 상품에 연결된 스위치별로 사운드를 구분해서 유지 (여러 스위치 중 선택해서 들을 수 있도록)
    const switches = (product.product_switches ?? [])
      .map((ps) => {
        const sw = Array.isArray(ps.switches) ? ps.switches[0] : ps.switches;
        if (!sw) return null;

        return {
          switch_id: sw.switch_id,
          switch_name: sw.switch_name,
          switch_type: sw.switch_type,
          is_default: ps.is_default ?? false,
          sounds: sw.sounds ?? [],
        };
      })
      .filter((sw): sw is NonNullable<typeof sw> => sw !== null);

    return {
      product_id: product.product_id,
      product_name: product.product_name,
      description: product.description,
      image_url: primaryImage?.image_url ?? null,
      switches,
    };
  });
}

// 현재 로그인한 유저가 찜한 상품의 상세 정보 (찜목록 페이지용)
export async function getLikedProducts() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("user_product_likes")
    .select(
      `
      created_at,
      products (
        ${PRODUCT_SELECT}
      )
    `,
    )
    .eq("fk_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? [])
    .map((row) => {
      const product = Array.isArray(row.products)
        ? row.products[0]
        : row.products;
      if (!product) return null;

      const primaryImage =
        product.product_images?.find((img) => img.is_primary) ??
        product.product_images?.[0];

      const switches = (product.product_switches ?? [])
        .map((ps) => {
          const sw = Array.isArray(ps.switches) ? ps.switches[0] : ps.switches;
          if (!sw) return null;

          return {
            switch_id: sw.switch_id,
            switch_name: sw.switch_name,
            switch_type: sw.switch_type,
            is_default: ps.is_default ?? false,
            sounds: sw.sounds ?? [],
          };
        })
        .filter((sw): sw is NonNullable<typeof sw> => sw !== null);

      return {
        product_id: product.product_id,
        product_name: product.product_name,
        description: product.description,
        image_url: primaryImage?.image_url ?? null,
        switches,
      };
    })
    .filter(
      (product): product is NonNullable<typeof product> => product !== null,
    );
}

// 현재 로그인한 유저가 찜한 상품 id 목록 (하트 버튼 초기 상태 표시용)
export async function getLikedProductIds(): Promise<number[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("user_product_likes")
    .select("fk_product_id")
    .eq("fk_user_id", user.id);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => row.fk_product_id);
}
