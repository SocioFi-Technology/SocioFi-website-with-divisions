interface TeamCardProps {
  name: string;
  role: string;
  bio?: string;
}
export default function TeamCard({ name, role, bio }: TeamCardProps) {
  return (
    <div className="card p-8">
      <h3 className="font-display font-semibold text-[1.1rem] mb-1" style={{ color: 'var(--text-primary)' }}>{name}</h3>
      <div className="text-xs mb-3 font-mono uppercase tracking-widest" style={{ color: 'var(--division-accent)' }}>{role}</div>
      {bio && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{bio}</p>}
    </div>
  );
}
