import { getAuth } from "@/lib/auth-storage";
import { useEffect, useState } from "react";

export function useAuth() {
  const [auth, setAuth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const data = await getAuth();
      setAuth(data);
      setLoading(false);
    };

    loadAuth();
  }, []);

  return { auth, loading };
}
