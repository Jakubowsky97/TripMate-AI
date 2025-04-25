'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminAuthPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      Cookies.set('adminAccess', 'true');
      router.push('/dashboard'); // Albo wróć do poprzedniej strony
    } else {
      setError('Niepoprawne hasło');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Podaj hasło administratora</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-4 py-2"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
          Zatwierdź
        </button>
      </form>
    </div>
  );
}
