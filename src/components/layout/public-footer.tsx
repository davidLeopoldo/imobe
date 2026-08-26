import { FacebookIcon, InstagramIcon, LinkedinIcon } from "./social-icons";

const SOCIAL_LINKS = [
  { href: "#", label: "Instagram", icon: InstagramIcon },
  { href: "#", label: "Facebook", icon: FacebookIcon },
  { href: "#", label: "LinkedIn", icon: LinkedinIcon },
];

export function PublicFooter() {
  return (
    <footer className="bg-surface-navy text-surface-navy-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:px-6">
        <div className="flex gap-4">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex size-9 items-center justify-center rounded-full border border-surface-navy-foreground/20 text-surface-navy-foreground/80 transition-colors hover:border-surface-navy-foreground/40 hover:text-surface-navy-foreground"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
        <p className="text-sm text-surface-navy-foreground/70">
          © {new Date().getFullYear()} Immobiliare. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
