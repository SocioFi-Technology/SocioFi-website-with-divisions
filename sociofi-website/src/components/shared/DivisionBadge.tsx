interface DivisionBadgeProps {
  name: string;
  accent: string;
}
export default function DivisionBadge({ name, accent }: DivisionBadgeProps) {
  return (
    <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.06em] px-3 py-1 rounded-full border" style={{ color: accent, borderColor: `${accent}33` }}>
      {name}
    </span>
  );
}
