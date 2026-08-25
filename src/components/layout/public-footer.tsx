export function PublicFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-center px-4 text-sm text-muted-foreground sm:px-6">
        <p>
          © {new Date().getFullYear()} Immobiliare. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
