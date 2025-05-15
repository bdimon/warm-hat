import { servbase as supabase } from "@/lib/supabase"; // или "@supabase/supabase-js";
import fs from "fs";
import path from "path";



const imageDir = path.resolve("public/images");
const files = fs.readdirSync(imageDir).filter((f) => f.endsWith(".webp"));

// Группировка файлов по товару (по префиксу до первой цифры или "-1.webp")
const grouped: Record<string, string[]> = {};

for (const file of files) {
  const base = file.replace(/-\d+\.webp$/, "").replace(/\.webp$/, "");
  if (!grouped[base]) grouped[base] = [];
  grouped[base].push(`/images/${file}`);
}

// Теперь для каждого товара обновим поле images
const updateProducts = async () => {
  for (const slug in grouped) {
    const imagePaths = grouped[slug];

    const { data, error } = await supabase
      .from("products")
      .update({ images: imagePaths })
      .ilike("name", `%${slug.replace(/-/g, " ")}%`) // или по slug, если есть
      .select();

    if (error) {
      console.error(`❌ Ошибка при обновлении ${slug}:`, error);
    } else {
      console.log(`✅ Обновлено ${slug}:`, imagePaths);
    }
  }
};

updateProducts();

// Подробнее: https://supabase.com/docs/guides/storage#uploading-images