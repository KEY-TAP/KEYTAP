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
        switches (
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
    const primaryImage = product.product_images?.find((img) => img.is_primary) ?? product.product_images?.[0];

    // switches가 배열이고 그 안에 sounds도 배열로 반환됨
    const sounds =
      product.product_switches?.flatMap((ps) => {
        const sw = Array.isArray(ps.switches) ? ps.switches[0] : ps.switches;
        return sw?.sounds ?? [];
      }) ?? [];

    return {
      product_id: product.product_id,
      product_name: product.product_name,
      image_url: primaryImage?.image_url ?? null,
      sounds,
    };
  });
}
