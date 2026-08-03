import { CheckCircle2 } from "lucide-react";

interface BrandingStatusProps {
  title: string;
  subtitle: string;
}

export default function BrandingStatus({
  title,
  subtitle,
}: BrandingStatusProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {subtitle}
        </p>
      </div>

      <CheckCircle2
        className="text-cyan-300"
        size={18}
      />
    </div>
  );
}