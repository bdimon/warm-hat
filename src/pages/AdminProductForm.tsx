import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormField from "@/components/FormField";

interface ProductForm {
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  images: string[]; // Пути к изображениям, например: ["/images/hat.jpg"]
}

const initialForm: ProductForm = {
  name: "",
  price: 0,
  quantity: 0,
  description: "",
  category: "",
  images: [],
};

export default function AdminProductForm() {
  const { id } = useParams(); // если есть, значит редактируем
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const isEdit = !!id;

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3010/api/products/${id}`);
        if (!res.ok) throw new Error("Ошибка загрузки товара");
        const data = await res.json();
        setForm(data);
      } catch (err) {
        setError("Не удалось загрузить товар");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = isEdit ? "PATCH" : "POST";
      const url = isEdit
        ? `http://localhost:3010/api/products/${id}`
        : "http://localhost:3010/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Ошибка сохранения");

      navigate("/admin/products");
    } catch (err) {
      setError("Не удалось сохранить товар");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEdit) return <div className="p-6">Загрузка...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? "Редактировать товар" : "Новый товар"}</h1>

      <div className="space-y-4">
        <FormField
          label="Название"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={formErrors.name}
        />
        <FormField
          label="Описание"
          name="description"
          value={form.description}
          onChange={handleChange}
          error={formErrors.description}
          textarea
        />
        <FormField
          label="Категория"
          name="category"
          value={form.category}
          onChange={handleChange}
          error={formErrors.category}
        />
        <FormField
          label="Цена"
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Цена"
          error={formErrors.price}
        />
        <FormField
          label="Количество"
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Количество"
          error={formErrors.quantity}
        />
        <input
          name="images"
          value={form.images.join(",")}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, images: e.target.value.split(",").map((s) => s.trim()) }))
          }
          placeholder="Ссылки на изображения (через запятую)"
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-shop-blue-dark text-white py-2 rounded hover:bg-shop-blue-dark/90"
      >
        {isEdit ? "Сохранить изменения" : "Создать товар"}
      </button>
    </div>
  );
}
