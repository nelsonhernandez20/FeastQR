"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "~/providers/AuthProvider/AuthProvider";
import { LoadingScreen } from "~/components/Loading";

export const withPrivateRoute = <T extends object>(
  WrappedComponent: React.FunctionComponent<T>,
) => {
  const ComponentWithPrivateRoute = (props: T) => {
    const router = useRouter();
    const { user, isLoading } = useUser();

    useEffect(() => {
      if (!user && !isLoading) {
        console.log("No user found, redirecting to login");
        router.push("/login");
      }
    }, [user, router, isLoading]);

    if (isLoading) return <LoadingScreen />;
    if (!user) return null;

    return <WrappedComponent {...props} />;
  };

  return ComponentWithPrivateRoute;
};
