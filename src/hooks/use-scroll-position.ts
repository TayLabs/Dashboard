import * as React from 'react';

export function useWindowScrollPosition() {
  const [scrollPosition, setScrollPosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}
