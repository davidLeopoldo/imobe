"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AvisoToast({ mensagem }: { mensagem: string }) {
  const router = useRouter();

  useEffect(() => {
    toast.info(mensagem);
    router.replace(window.location.pathname, { scroll: false });
  }, [mensagem, router]);

  return null;
}
