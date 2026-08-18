import { getAuth, subscribeAuthChange } from "@/lib/auth-storage";
import { useEffect, useState } from "react";

export function useAuth() {
  const [auth, setAuth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadAuth = async () => {
      const data = await getAuth();
      if (mounted) {
        setAuth(data);
        setLoading(false);
      }
    };

    loadAuth();
    const unsubscribe = subscribeAuthChange(loadAuth);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { auth, loading };
}
