import { ReactNode, ElementType } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** narrow: max-w-4xl (prose/forms). Default: max-w-7xl */
  narrow?: boolean;
  /** wide: max-w-[1280px] (hero sections). Default: max-w-7xl */
  wide?: boolean;
  as?: ElementType;
}

export default function Container({
  children,
  className = '',
  narrow = false,
  wide = false,
  as: Tag = 'div',
}: ContainerProps) {
  const maxWidth = narrow ? '896px' : wide ? '1280px' : '1200px';

  return (
    <Tag
      className={className}
      style={{
        maxWidth,
        marginInline: 'auto',
        paddingInline: 'clamp(20px, 5vw, 32px)',
        width: '100%',
      }}
    >
      {children}
    </Tag>
  );
}
