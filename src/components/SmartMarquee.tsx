import { useState, useRef, useEffect, ReactNode } from "react";
import Marquee from "react-fast-marquee";
import { useMarqueePause } from "../hooks/useMarqueePause";

interface SmartMarqueeProps {
  children: ReactNode;
  className?: string;
}

export function SmartMarquee({ children, className }: SmartMarqueeProps) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isMarqueePlaying, handleMarqueeCycle } = useMarqueePause(5000);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const isOverflow = contentRef.current.scrollWidth > containerRef.current.clientWidth;
        setIsOverflowing(isOverflow);
      }
    };

    // Check on mount and when children change
    checkOverflow();

    // Debounce resize check
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkOverflow, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [children]);

  if (isOverflowing) {
    const maskClass = isMarqueePlaying
      ? "[mask-image:linear-gradient(to_right,transparent_0%,black_2%,black_98%,transparent_100%)]"
      : "[mask-image:linear-gradient(to_right,black_0%,black_98%,transparent_100%)]";

    return (
      <div className={`w-full overflow-hidden whitespace-nowrap ${className} ${maskClass} transition-all duration-500 ease-in-out`} ref={containerRef}>
        <Marquee
          play={isMarqueePlaying}
          onCycleComplete={handleMarqueeCycle}
          speed={30}
          gradient={false}
          className="w-full"
        >
          <div ref={contentRef} className="mr-12">{children}</div>
        </Marquee>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden whitespace-nowrap ${className}`} ref={containerRef}>
      <div ref={contentRef} className="inline-block">{children}</div>
    </div>
  );
}
