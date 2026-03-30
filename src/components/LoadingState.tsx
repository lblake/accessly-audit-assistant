import { useState, useEffect } from "react";

const messages = [
  "Connecting to your store...",
  "Running WCAG 2.1 accessibility scan...",
  "Analysing 50+ accessibility checkpoints...",
  "Generating your compliance report...",
  "Almost done...",
];

const LoadingState = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-16">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000"
            style={{
              width: `${((messageIndex + 1) / messages.length) * 100}%`,
              animation: "progress-pulse 2s ease-in-out infinite",
            }}
          />
        </div>

        <p key={messageIndex} className="mt-8 text-lg font-medium animate-slide-up">
          {messages[messageIndex]}
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          This usually takes 15–30 seconds
        </p>
      </div>
    </section>
  );
};

export default LoadingState;
