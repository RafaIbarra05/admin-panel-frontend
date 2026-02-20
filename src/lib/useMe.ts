"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
}

export function useMe() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  return { user, loading };
}
