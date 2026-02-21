"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectIfLoggedIn({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/dashboard");
  }, [router]);

  return <>{children}</>;
}
