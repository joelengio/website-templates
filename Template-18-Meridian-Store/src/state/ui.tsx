import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

interface UIState {
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  /** Politely announce a message to screen-reader users (and show it in the visible toast). */
  announce: (message: string) => void;
  toast: string;
}
const Ctx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const timer = useRef<number | undefined>(undefined);
  const announce = useCallback((message: string) => {
    // toggle a trailing zero-width space so repeating the same message is still announced
    setToast((prev) => (prev === message ? `${message}.` : message));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(''), 5000);
  }, []);
  const value = useMemo(() => ({ cartOpen, setCartOpen, searchOpen, setSearchOpen, menuOpen, setMenuOpen, announce, toast }), [cartOpen, searchOpen, menuOpen, announce, toast]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI(): UIState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useUI must be used inside <UIProvider>');
  return v;
}
