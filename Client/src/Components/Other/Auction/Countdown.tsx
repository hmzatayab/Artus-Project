import { RiTimeLine } from "@remixicon/react";
import { useState, useEffect } from "react";

interface AuctionCountdownProps {
  endTime: string;
}

const AuctionCountdown: React.FC<AuctionCountdownProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Auction Ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      let displayTime = "";
      if (days > 0) displayTime += `${days}d `;
      if (hours > 0 || days > 0) displayTime += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) displayTime += `${minutes}m `;
      displayTime += `${seconds}s`;

      setTimeLeft(displayTime.trim());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <h2 className="text-2xl font-bold tracking-wide flex items-center gap-2">
      <span className=""><RiTimeLine></RiTimeLine></span> {timeLeft}
    </h2>
  );
};

export default AuctionCountdown;
