import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";
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
import { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";

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
  const navigate = useNavigate();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3010/api/users");
        if (!res.ok) {
          throw new Error(t('adminUsers.error', { errorMessage: res.statusText }));
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t('adminUsers.error', { errorMessage: 'Unknown error' }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`http://localhost:3010/api/users/${userToDelete}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: t('adminUsers.deleteError') }));
        throw new Error(errorData.message || t('adminUsers.deleteError'));
      }
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
      showSnackbar(t('adminUsers.deleteSuccess'), "success");
    } catch (err) {
      console.error(t('adminUsers.deleteError'), err);
      const errorMessage = err instanceof Error ? err.message : t('adminUsers.deleteError');
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setUserToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showBackButton onBackClick={() => navigate('/')} />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-shop-blue-dark" />
          <p className="ml-2 text-gray-600">{t('adminUsers.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showBackButton onBackClick={() => navigate('/admin/dashboard')} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">{t('adminUsers.error')}: {error}</p>
            <Button onClick={() => navigate('/admin/dashboard')} className="bg-shop-blue-dark text-white">
              {t('adminUsers.backToAdmin')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header showBackButton onBackClick={() => navigate('/admin/dashboard')} />
      <div className='container mx-auto pt-24 pb-12 px-4'>
        <h1 className='text-3xl font-bold mb-8 text-shop-text'>{t('adminUsers.title')}</h1>

        {users.length === 0 ? (
          <p className='text-center text-gray-500 my-8'>{t('adminUsers.noUsers')}</p>
        ) : (
          <div className='overflow-x-auto bg-white rounded-lg shadow'>
            <table className='min-w-full table-auto'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>ID</th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Email</th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>
                    {t('adminUsers.role')}
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>
                    {t('adminUsers.date')}
                  </th>
                  <th className='px-4 py-3 text-sm font-medium text-gray-600'>
                    {t('adminUsers.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className='border-t'>
                    <td className='px-4 py-3 font-mono text-xs'>{user.id}</td>
                    <td className='px-4 py-3'>{user.email}</td>
                    <td className='px-4 py-3'>{user.app_metadata?.user_role || 'user'}</td>
                    <td className='px-4 py-3'>{new Date(user.created_at).toLocaleString()}</td>
                    <td className='px-4 py-3 text-center'>
                      <Button
                        variant='link'
                        className='text-sm text-red-600 hover:underline p-0 h-auto'
                        onClick={() => setUserToDelete(user.id)}
                      >
                        {t('adminUsers.delete')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-red-600 text-xl text-center'>
              {t('adminUsers.deleteConfirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('adminUsers.deleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              {t('adminUsers.deleteConfirmCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className={buttonVariants({ variant: 'destructive' })}
            >
              {t('adminUsers.deleteConfirmAction')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
