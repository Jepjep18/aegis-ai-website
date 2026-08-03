interface AuthHeaderProps {
  title: string;
  description: string;
}

export default function AuthHeader({
  title,
  description,
}: AuthHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        {title}
      </h1>

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>
    </header>
  );
}