import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUnit } from "effector-react";
import { $userState } from "@entities/User/model/store";

export function withAuthGuard(Component: React.FC) {
  return function AuthGuardWrapper(props: any) {
    const router = useRouter();
    const { error, stale, data } = useUnit($userState);

    useEffect(() => {
      if (error && !stale) {
        void router.push("/login");
      }
    }, [error, router, stale]);

    if (!data) return null; // можно спиннер
    return <Component {...props} />;
  };
}
