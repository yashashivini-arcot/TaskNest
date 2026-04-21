import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const format = (n) => n.toString().padStart(2, '0');

  return (
    <div className="inline-flex gap-2 font-mono text-sm font-bold text-accent tabular-nums">
      <span>{format(timeLeft.days)}d</span>
      <span className="opacity-30">:</span>
      <span>{format(timeLeft.hours)}h</span>
      <span className="opacity-30">:</span>
      <span>{format(timeLeft.minutes)}m</span>
      <span className="opacity-30">:</span>
      <span>{format(timeLeft.seconds)}s</span>
    </div>
  );
};

export default Countdown;
