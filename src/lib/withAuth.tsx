import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export function withAuth(Component: React.ComponentType) {
  return function ProtectedComponent() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirecionar para a página de login se o usuário não estiver autenticado
    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login");
      }
    }, [status, router]);

    // Se o usuário estiver autenticado, renderizar o componente original
    return <Component />;
  };
}
