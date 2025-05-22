import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormField from "@/components/FormField";
import { Product } from "@/types/Product"
import { mapProductFromAPI, mapProductToAPI } from "@/lib/mappers/products";

interface ProductForm {
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  images: string[]; // Пути к изображениям, например: ["/images/hat.jpg"]
}

const initialForm: Product = {
    id: "",
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    images: [],
    isNew: false,
    isSale: false,
    salePrice: undefined,
  };
 
export default function AdminProductForm() {
  const { id } = useParams(); // если есть, значит редактируем
  const navigate = useNavigate();
  const [form, setForm] = useState<Product>(initialForm);
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
        const mappedData = mapProductFromAPI(data);
        setForm(mappedData);
      } catch (err) {
        setError("Не удалось загрузить товар");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
  const { name, value, type } = target;
  const checked = (target as HTMLInputElement).checked; // add type guard
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = isEdit ? "PATCH" : "POST";
      const url = isEdit
        ? `http://localhost:3010/api/products/${id}`
        : "http://localhost:3010/api/products";

      const payload = mapProductToAPI(form);
      

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        />
        <FormField
          label="Количество"
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}          
        />
        <FormField
          label="Изображения (через запятую)"
          name="images"
          value={form.images.join(", ")}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              images: e.target.value.split(",").map((s) => s.trim()),
            }))
          }
        />


        <label className="flex items-center space-x-2">
          <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} />
          <span>Новинка</span>
        </label>

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="isSale" checked={form.isSale} onChange={handleChange} />
          <span>Скидка</span>
        </label>
        {form.isSale && (
          <FormField
            label="Цена со скидкой"
            type="number"
            name="salePrice"
            value={form.salePrice?.toString() ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                salePrice: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
          />
        )}
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
