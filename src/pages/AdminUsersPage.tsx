import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSnackbar } from "@/hooks/use-snackbar";
import { User } from "@supabase/supabase-js"; // Тип пользователя из Supabase

// Расширим тип User, если хотим отображать кастомные метаданные, например, роль
interface AppUser extends User {
  app_metadata: {
    user_role?: string;
    [key: string]: string | undefined;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:3010/api/users");
        if (!res.ok) {
          const errorText = await res.text().catch(() => "Could not read error text");
          throw new Error(`Ошибка загрузки пользователей. Статус: ${res.status}. ${errorText}`);
        }
        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Неизвестная ошибка при загрузке пользователей.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`http://localhost:3010/api/users/${userToDelete}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Ошибка при удалении" }));
        throw new Error(errorData.message || `Ошибка при удалении пользователя (статус: ${res.status})`);
      }
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
      showSnackbar("Пользователь успешно удален", "success");
    } catch (err) {
      console.error("Ошибка удаления пользователя:", err);
      const errorMessage = err instanceof Error ? err.message : "Не удалось удалить пользователя";
      setError(errorMessage); // Можно также отобразить ошибку через setError
      showSnackbar(errorMessage, "error");
    } finally {
      setUserToDelete(null);
    }
  };

  if (loading) return <div className="p-6">Загрузка пользователей...</div>;
  if (error) return <div className="p-6 text-red-600">Ошибка: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Админка — Пользователи</h1>
      {users.length === 0 ? (
        <p>Нет пользователей</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Роль</th>
                <th className="px-4 py-2 text-left">Дата регистрации</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">{user.id}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.app_metadata?.user_role || 'user'}</td>
                  <td className="px-4 py-2">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Button
                      variant="link"
                      className="text-sm text-red-600 hover:underline p-0 h-auto"
                      onClick={() => setUserToDelete(user.id)}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AlertDialog open={!!userToDelete} onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо. Пользователь и все связанные с ним данные (в auth схеме) будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className={buttonVariants({ variant: "destructive" })}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}