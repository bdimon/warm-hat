// src/pages/ProfilePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
    email?: string;

    // Add other properties as needed
  }

const ProfilePage = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/');
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>
      <p>Email: <strong>{user.email}</strong></p>
    </div>
  );
};

export default ProfilePage;
