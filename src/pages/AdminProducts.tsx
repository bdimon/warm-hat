import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/Product";
import { mapProductFromAPI } from "@/lib/mappers/products";

 
// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   category: string;
//   images: string[];
// }

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3010/api/products");
        if (!res.ok) throw new Error("Ошибка загрузки товаров");
        const json = await res.json();
        const mappedProducts = json.data.map(mapProductFromAPI);
        // setProducts(json.data);
        setProducts(mappedProducts);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Удалить этот товар?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3010/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Ошибка удаления");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Ошибка при удалении");
    }
  };

  if (loading) return <div className="p-6">Загрузка товаров...</div>;
  if (error) return <div className="p-6 text-red-600">Ошибка: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Товары</h1>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="bg-shop-blue-dark text-white px-4 py-2 rounded hover:bg-shop-blue-dark/90"
        >
          + Новый товар
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow-sm space-y-2">
            <img
              src={product.images?.[0] || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="font-semibold">{product.name}</h2>
            <p>Категория: {product.category}</p>
            <p>Цена: {product.price.toFixed(2)} ₽</p>
            {product.isSale && product.salePrice && (
              <p className="mt-1 text-red-600 font-semibold">Скидка: ₽ {product.salePrice}</p>
            )}
            <p>В наличии: {product.quantity} шт.</p>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                className="text-blue-600 hover:underline"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 hover:underline"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
