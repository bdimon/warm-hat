// hooks/use-auth.ts
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error;
  };

  const register = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    return error;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    return error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return error;
  };

  return { login, register, loginWithGoogle, resetPassword };
};
