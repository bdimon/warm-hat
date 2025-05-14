import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "@/components/ProductCard";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    fetch(`http://localhost:3010/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setMainImage(data.images?.[0] || "/placeholder.png");
      })
      .catch((err) => console.error("Ошибка загрузки товара:", err));
  }, [id]);

  if (!product) return <div className="p-4 text-center">Загрузка...</div>;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Галерея */}
        <div>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-auto object-cover rounded shadow mb-4"
          />
          <div className="flex gap-2">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`preview-${idx}`}
                onClick={() => setMainImage(img)}
                className={`h-20 w-20 object-cover cursor-pointer rounded-lg border ${
                  img === mainImage ? "border-blue-500" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Описание */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.description}</p>

          {product.isSale && product.salePrice ? (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-red-500">
                {product.salePrice} ₽
              </span>
              <span className="line-through text-gray-400">{product.price} ₽</span>
            </div>
          ) : (
            <p className="text-2xl font-bold text-shop-text mb-4">
              {product.price} ₽
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
