"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function AdminProductsPage() {
  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState(1);

  const handleSubmit = async () => {
    const { data, error } = await supabase.from("products").insert({ product_name: name, fk_brand_id: brandId }).select();

    if (error) {
      console.error(error);
      return;
    }

    console.log("등록 성공", data);

    setName("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>상품 등록</h1>
      <div>
        <label>
          상품명
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          브랜드
          <select value={brandId} onChange={(e) => setBrandId(Number(e.target.value))}>
            <option value={1}>Nuphy</option>
            <option value={2}>Brand 1</option>
          </select>
        </label>
      </div>
      <button onClick={handleSubmit}>등록</button>
    </div>
  );
}
