import { useState } from 'react';

export const useMarqueePause = (delay: number = 5000) => {
  const [isMarqueePlaying, setIsMarqueePlaying] = useState(true);

  const handleMarqueeCycle = () => {
    setIsMarqueePlaying(false);
    setTimeout(() => {
      setIsMarqueePlaying(true);
    }, delay);
  };

  return { isMarqueePlaying, handleMarqueeCycle };
};
