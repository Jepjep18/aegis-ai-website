interface Props {
  text?: string;
}

export default function AuthDivider({
  text = "or continue with",
}: Props) {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="h-px flex-1 bg-white/10" />

      <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {text}
      </span>

      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}