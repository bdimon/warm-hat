import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "@/context/SnackbarContext";
import { supabase } from "@/lib/supabase";
import OrderForm from "@/components/OrderForm";
import { OrderFormData, OrderFormErrors } from "@/hooks/use-order-form";

export default function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState<OrderFormData>({
    name: "",
    address: "",
    phone: "",
    payment: "card",
  });
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [total, setTotal] = useState(0);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !order) {
        showSnackbar("Заказ не найден", "error");
        navigate("/admin");
        return;
      }

      const { items, total, status, payment_method, user_id } = order;
      setTotal(total);
      setForm(prev => ({
        ...prev,
        payment: payment_method,
      }));
      setEditable(status === "new");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, address, phone, email")
        .eq("id", user_id)
        .single();

      if (profile) {
        setForm({
          name: profile.full_name || "",
          address: profile.address || "",
          phone: profile.phone || "",
          payment: payment_method,
        });
        setUserEmail(profile.email || "");
      }
    };

    fetchOrder();
  }, [id, navigate, showSnackbar]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editable) return;
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): OrderFormErrors => {
    return {
      name: form.name.trim() ? undefined : "Введите имя",
      address: form.address.trim() ? undefined : "Введите адрес",
      phone: /^\+?\d{10,15}$/.test(form.phone) ? undefined : "Введите корректный телефон",
    };
  };

  const handleSubmit = async () => {
    if (!editable) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.values(validationErrors).some(Boolean)) return;

    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update({
        payment_method: form.payment,
        // Можно также сохранить адрес и имя в профиль, если нужно
      })
      .eq("id", id);

    if (error) {
      showSnackbar("Не удалось сохранить", "error");
    } else {
      showSnackbar("Изменения сохранены", "success");
      navigate("/admin");
    }

    setLoading(false);
  };

  return (
    <OrderForm
      form={form}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      total={total}
      userEmail={userEmail}
      disabled={!editable}
      submitText={editable ? "Сохранить изменения" : "Редактирование недоступно"}
    />
  );
}
