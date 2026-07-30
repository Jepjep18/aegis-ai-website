export default function Footer() {
  return (
    <footer className="border-t border-border py-12 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Aegis AI. All rights reserved.
    </footer>
  );
}