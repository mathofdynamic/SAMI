import React from 'react';

// Primitive Props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  buttonStyle?: 'flat' | 'double-bezel' | 'pill' | 'tactile';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  buttonStyle,
  className = '',
  ...props
}) => {
  // Base structural classes
  let baseClass = 'inline-flex items-center justify-center font-medium transition-all select-none active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  // Font Family: Heading for buttons
  baseClass += ' font-[family-name:var(--font-heading)]';
 
  // Sizing
  const sizeClasses = {
    xs: 'px-2.5 py-1 text-[10px]',
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  // Border Radii depending on component style or custom
  let radiusClass = 'rounded-[var(--radius-md)]';
  if (buttonStyle === 'pill') {
    radiusClass = 'rounded-full';
  } else if (buttonStyle === 'tactile' || buttonStyle === 'flat') {
    radiusClass = 'rounded-[var(--radius-sm)]';
  }

  // Variant Coloring
  const variantClasses = {
    primary: 'bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90',
    secondary: 'bg-[var(--color-surface)] text-[var(--text-primary)] border-[var(--border-width)] border-[var(--color-border)] hover:bg-[var(--color-bg)]',
    accent: 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:brightness-105 shadow-[var(--shadow-ambient)]',
    outline: 'bg-transparent text-[var(--text-primary)] border-[var(--border-width)] border-[var(--color-border)] hover:bg-[var(--color-border)]/20',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-border)]/10',
  };

  // Specific style presets overrides
  let styleOverrides = '';
  if (buttonStyle === 'tactile') {
    styleOverrides = 'border-[var(--border-width)] border-[var(--color-primary)] shadow-[3px_3px_0px_0px_var(--color-primary)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_var(--color-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all';
  } else if (buttonStyle === 'double-bezel') {
    // Return wrapped element
    return (
      <div className={`inline-block p-[3px] bg-[var(--color-border)] border-[var(--border-width)] border-[var(--color-primary)] rounded-[var(--radius-lg)]`}>
        <button
          className={`${baseClass} ${sizeClasses[size]} ${radiusClass} ${variantClasses[variant]} border-[var(--border-width)] border-[var(--color-primary)] ${className}`}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  }

  return (
    <button
      className={`${baseClass} ${sizeClasses[size]} ${radiusClass} ${variantClasses[variant]} ${styleOverrides} ${className}`}
      style={{
        transitionDuration: 'var(--motion-fast)',
        transitionTimingFunction: 'var(--motion-easing)',
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Primitive
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputStyle?: 'underlined' | 'filled' | 'bordered';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  inputStyle = 'bordered',
  className = '',
  ...props
}) => {
  let baseClass = 'w-full px-4 py-2.5 text-sm bg-transparent text-[var(--text-primary)] font-[family-name:var(--font-body)] transition-all outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] disabled:opacity-50';

  let styleClasses = '';
  if (inputStyle === 'bordered') {
    styleClasses = 'border-[var(--border-width)] border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface)]';
  } else if (inputStyle === 'filled') {
    styleClasses = 'bg-[var(--color-border)]/30 border-b-[var(--border-width)] border-[var(--color-border)] rounded-[var(--radius-sm)] hover:bg-[var(--color-border)]/50 focus:bg-[var(--color-surface)]';
  } else if (inputStyle === 'underlined') {
    styleClasses = 'border-b-[var(--border-width)] border-[var(--color-border)] rounded-none px-1 focus:border-[var(--color-primary)]';
  }

  if (error) {
    styleClasses += ' border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]';
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] font-[family-name:var(--font-heading)]">
          {label}
        </label>
      )}
      <input
        className={`${baseClass} ${styleClasses} ${className}`}
        style={{
          transitionDuration: 'var(--motion-fast)',
          transitionTimingFunction: 'var(--motion-easing)',
        }}
        {...props}
      />
      {error && (
        <span className="text-xs text-[var(--color-error)] font-[family-name:var(--font-body)]">
          {error}
        </span>
      )}
    </div>
  );
};

// Card Primitive
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardStyle?: 'flat' | 'bordered' | 'elevated' | 'double-bezel';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  cardStyle = 'bordered',
  interactive = false,
  className = '',
  ...props
}) => {
  let baseClass = 'bg-[var(--color-surface)] text-[var(--text-primary)] transition-all overflow-hidden';
  
  let styleClasses = '';
  if (cardStyle === 'bordered') {
    styleClasses = 'border-[var(--border-width)] border-[var(--color-border)] rounded-[var(--radius-lg)]';
  } else if (cardStyle === 'flat') {
    styleClasses = 'bg-[var(--color-bg)]/40 border-none rounded-[var(--radius-md)]';
  } else if (cardStyle === 'elevated') {
    styleClasses = 'border-[var(--border-width)] border-[var(--color-border)]/50 rounded-[var(--radius-xl)] shadow-[var(--shadow-ambient)]';
  } else if (cardStyle === 'double-bezel') {
    // Beautiful Doppelrand pattern: An outer container with padding and slight tint, inner card matching concentric radius
    return (
      <div 
        className={`p-1.5 bg-[var(--color-border)]/40 border-[var(--border-width)] border-[var(--color-border)] rounded-[var(--radius-xl)] ${interactive ? 'hover:translate-y-[-2px] hover:border-[var(--color-accent)]' : ''} transition-all duration-[var(--motion-normal)] ${className}`}
        {...props}
      >
        <div className="bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)]/70 rounded-[calc(var(--radius-xl)-6px)] p-6 h-full">
          {children}
        </div>
      </div>
    );
  }

  if (interactive) {
    styleClasses += ' hover:-translate-y-1 hover:shadow-[var(--shadow-ambient)] hover:border-[var(--color-accent)] cursor-pointer';
  }

  return (
    <div
      className={`${baseClass} ${styleClasses} ${className}`}
      style={{
        transitionDuration: 'var(--motion-normal)',
        transitionTimingFunction: 'var(--motion-easing)',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Badge Primitive
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  className = '',
  ...props
}) => {
  let baseClass = 'inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full font-[family-name:var(--font-mono)]';

  const variantClasses = {
    primary: 'bg-[var(--color-primary)] text-[var(--color-bg)]',
    secondary: 'bg-[var(--color-border)]/60 text-[var(--text-primary)] border border-[var(--color-border)]',
    accent: 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30',
    success: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20',
    warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20',
    error: 'bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20',
    info: 'bg-[var(--color-info)]/10 text-[var(--color-info)] border border-[var(--color-info)]/20',
  };

  return (
    <span className={`${baseClass} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

// Switch/Toggle Primitive
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div 
        className="relative w-10 h-5 transition-colors duration-[var(--motion-fast)] rounded-full border border-[var(--color-border)]"
        style={{
          backgroundColor: checked ? 'var(--color-accent)' : 'var(--color-surface)',
        }}
        onClick={() => onChange(!checked)}
      >
        <div 
          className="absolute top-0.5 left-0.5 w-3.8 h-3.8 transition-all duration-[var(--motion-fast)] rounded-full bg-[var(--text-primary)]"
          style={{
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            backgroundColor: checked ? 'var(--color-bg)' : 'var(--text-secondary)',
          }}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-[var(--text-primary)] font-[family-name:var(--font-body)]">
          {label}
        </span>
      )}
    </label>
  );
};

// Avatar Primitive
interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', online = false }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const initial = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="relative inline-block select-none">
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center bg-[var(--color-border)] border border-[var(--color-border)] font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]`}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-[var(--color-success)] ring-2 ring-[var(--color-surface)]" />
      )}
    </div>
  );
};
