import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RateLimitedStateProps {
  apiBaseUrl: string;
}

const RateLimitedState = ({ apiBaseUrl }: RateLimitedStateProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleNotify = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    try {
      await fetch(`${apiBaseUrl}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-16">
        <div className="mx-auto w-full max-w-md text-center">
          <p className="text-lg font-medium">We'll let you know when you can scan again.</p>
          <p className="mt-2 text-sm text-muted-foreground">Check your inbox shortly.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-16">
      <div className="mx-auto w-full max-w-md text-center space-y-4">
        <p className="text-lg font-medium">You've run 3 free scans today.</p>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll notify you when you can scan again.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="Email address"
          className="h-11 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button variant="cta" className="w-full" onClick={handleNotify}>
          Notify Me
        </Button>
      </div>
    </section>
  );
};

export default RateLimitedState;
