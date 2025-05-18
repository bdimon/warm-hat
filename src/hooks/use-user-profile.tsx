// hooks/useUserProfile.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/db";

export function useUser() {
  const [user, setUser] = useState<null | User>(null); // импортируй `User` из `@supabase/supabase-js`

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Ошибка получения пользователя:", error.message);
      } else {
        setUser(data.user);
      }
    };

    getUser();
  }, []);

  return { user };
}

export function useUserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserAndProfile = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error("Ошибка при получении пользователя:", userError?.message);
        setLoading(false);
        return;
      }

      setUser(userData.user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        console.error("Ошибка при получении профиля:", profileError.message);
      } else {
        setProfile(profileData);
      }

      setLoading(false);
    };

    loadUserAndProfile();
  }, []);

  return { user, profile, loading };
}
