import { useState, useRef, useCallback, type ReactNode } from 'react';

export default function Tooltip({ children, label }: { children: ReactNode; label: string }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(true), 300);
  }, []);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onTouchStart={e => {
        e.preventDefault();
        setVisible(v => !v);
      }}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full z-50"
        >
          <span className="block whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-sm animate-scale-in origin-top">
            {label}
          </span>
        </span>
      )}
    </div>
  );
}
