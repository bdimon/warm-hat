import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";

interface OrderFormData {
  name: string;
  address: string;
  phone: string;
  payment: string;
}

interface OrderFormErrors {
  name?: string;
  address?: string;
  phone?: string;
}

export interface OrderFormProps {
  form: OrderFormData;
  errors: OrderFormErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: () => void;
  loading: boolean;
  total: number;
  userEmail?: string;
  disabled?: boolean; // <-- добавь эту строку
  submitText?: string; // <-- если используешь кастомный текст кнопки
}

export default function OrderForm({
  form,
  errors,
  onChange,
  onSubmit,
  loading,
  total,
  userEmail,
  disabled = false,
  submitText = "Подтвердить заказ",
}: OrderFormProps) {
  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Оформление заказа</h2>

      <div className="space-y-4">
        <FormField label="Имя и фамилия" >
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Введите имя"
            className="w-full border p-2 rounded border-gray-300"
          />
        </FormField>

        {userEmail && (
          <div className="text-sm text-gray-500 pt-1">
            Email: <span className="font-medium">{userEmail}</span>
          </div>
        )}

        <FormField label="Адрес доставки" error={errors.address}>
          <textarea
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="Введите адрес"
            className="w-full border p-2 rounded border-gray-300"
            rows={4}
          />
        </FormField>

        <FormField label="Телефон" error={errors.phone}>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            placeholder="+7..."
            className="w-full border p-2 rounded border-gray-300"
          />
        </FormField>

        <FormField label="Способ оплаты">
          <select
            name="payment"
            value={form.payment}
            onChange={onChange}
            className={cn(
              "w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-shop-blue-dark focus:border-shop-blue-dark"
            )}
          >
            <option value="card">Карта онлайн</option>
            <option value="cod">Наложенный платёж</option>
            <option value="pickup">Самовывоз</option>
          </select>
        </FormField>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <span className="font-semibold">Сумма:</span>
        <span className="text-lg font-bold">{total.toFixed(2)} ₽</span>
      </div>

      <button
  onClick={onSubmit}
  disabled={loading || disabled}
  className={cn(
    "w-full mt-6 flex items-center justify-center bg-shop-blue-dark text-white py-2.5 rounded-md hover:bg-shop-blue-dark/90 transition-colors",
    "disabled:opacity-60 disabled:cursor-not-allowed"
  )}
>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Отправка...
    </>
  ) : submitText}
</button>

    </div>
  );
}


// src/components/order/OrderForm.tsx
// import { Order } from "@/types/db";
// import { useForm } from "react-hook-form";
// import FormField from "@/components/FormField";
// import { supabase } from "@/lib/supabase";
// import { useSnackbar } from "@/context/SnackbarContext";

// interface OrderFormProps {
//   order?: Order;
//   mode: "create" | "edit";
//   onSuccess: () => void;
// }

// export default function OrderForm({ order, mode, onSuccess }: OrderFormProps) {
//   const { register, handleSubmit, formState: { errors } } = useForm({
//     defaultValues: order ?? { name: "", phone: "", address: "", comment: "" },
//   });

//   const { showSnackbar } = useSnackbar();

//   const onSubmit = async (values: any) => {
//     if (mode === "edit" && order) {
//       const { error } = await supabase
//         .from("orders")
//         .update(values)
//         .eq("id", order.id);

//       if (error) {
//         showSnackbar("Ошибка при обновлении заказа", "error");
//       } else {
//         showSnackbar("Заказ обновлён", "success");
//         onSuccess();
//       }
//     } else {
//       // создание нового заказа
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <FormField label="Имя" error={errors.name?.message}>
//         <input {...register("name", { required: "Введите имя" })} className="input" />
//       </FormField>

//       <FormField label="Телефон" error={errors.phone?.message}>
//         <input {...register("phone", { required: "Введите телефон" })} className="input" />
//       </FormField>

//       <FormField label="Адрес" error={errors.address?.message}>
//         <input {...register("address", { required: "Введите адрес" })} className="input" />
//       </FormField>

//       <FormField label="Комментарий" error={errors.comment?.message}>
//         <textarea {...register("comment")} className="textarea" />
//       </FormField>

//       <button type="submit" className="btn btn-primary">
//         {mode === "edit" ? "Сохранить изменения" : "Оформить заказ"}
//       </button>
//     </form>
//   );
// }
