interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  price?: string;
}
export default function CourseCard({ title, description, duration, level, price }: CourseCardProps) {
  return (
    <div className="card p-8">
      <h3 className="font-display font-semibold text-[1.1rem] mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      <div className="flex gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>{duration}</span>
        <span>{level}</span>
        {price && <span>{price}</span>}
      </div>
    </div>
  );
}
