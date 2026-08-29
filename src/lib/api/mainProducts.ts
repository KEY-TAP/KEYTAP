import { createClient } from "@/lib/supabaseServer";

export async function getMainProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      product_id,
      product_name,
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
    `,
    )
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
      image_url: primaryImage?.image_url ?? null,
      switches,
    };
  });
}
