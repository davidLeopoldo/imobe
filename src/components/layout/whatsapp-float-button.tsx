import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5511999999999";

export function WhatsappFloatButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
