import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface HeroSectionProps {
  onSubmit: (url: string, specificUrl?: string) => void;
  apiError?: string | null;
  apiBaseUrl?: string;
}

const ERROR_MESSAGES: Record<string, React.ReactNode> = {
  WAVE_TIMEOUT: (
    <>
      The scan is taking longer than expected. This can happen with larger stores. Try scanning a specific product or collection page URL instead of the homepage, or try again in a few minutes.
    </>
  ),
  WAVE_ERROR: (
    <>
      We couldn't scan this store — it may be blocking external requests. Contact us for a manual audit at{" "}
      <a href="https://accesslyscan.ai" className="underline hover:text-foreground transition-colors">accesslyscan.ai</a>
    </>
  ),
  INVALID_URL: "Please enter a valid URL starting with https:// — for example: https://yourstore.myshopify.com",
  GENERIC: (
    <>
      Something went wrong. Please try again or contact{" "}
      <a href="mailto:hello@accesslyscan.ai" className="underline hover:text-foreground transition-colors">hello@accesslyscan.ai</a>
    </>
  ),
};

const HeroSection = ({ onSubmit, apiError, apiBaseUrl = "" }: HeroSectionProps) => {
  const [url, setUrl] = useState("");
  const [specificUrl, setSpecificUrl] = useState("");
  const [showSpecific, setShowSpecific] = useState(false);
  const [error, setError] = useState("");

  // Rate-limit email flow
  const [rateLimitEmail, setRateLimitEmail] = useState("");
  const [rateLimitSubmitted, setRateLimitSubmitted] = useState(false);
  const [rateLimitError, setRateLimitError] = useState("");

  const validateUrl = (value: string) => {
    if (!value.trim()) return "Please enter a URL";
    try {
      new URL(value.startsWith("http") ? value : `https://${value}`);
      return "";
    } catch {
      return "Please enter a valid URL";
    }
  };

  const handleSubmit = () => {
    const err = validateUrl(url);
    if (err) {
      setError(err);
      return;
    }
    if (specificUrl.trim()) {
      const specErr = validateUrl(specificUrl);
      if (specErr) {
        setError("Specific page URL is invalid");
        return;
      }
    }
    setError("");
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const normalizedSpecific = specificUrl.trim()
      ? specificUrl.startsWith("http") ? specificUrl : `https://${specificUrl}`
      : undefined;
    onSubmit(normalizedUrl, normalizedSpecific);
  };

  const handleNotify = async () => {
    if (!rateLimitEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rateLimitEmail)) {
      setRateLimitError("Please enter a valid email");
      return;
    }
    try {
      await fetch(`${apiBaseUrl}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: rateLimitEmail }),
      });
      setRateLimitSubmitted(true);
      setRateLimitError("");
    } catch {
      setRateLimitError("Something went wrong. Please try again.");
    }
  };

  const isRateLimited = apiError === "RATE_LIMITED";
  const apiErrorMessage = apiError
    ? ERROR_MESSAGES[apiError] || ERROR_MESSAGES.GENERIC
    : null;

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-16 sm:px-6">
      <div className="mx-auto w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Find Out If Your Shopify Store Is a{" "}
          <span className="text-primary">Legal Liability</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          Free automated accessibility scan. Instant PDF report. No credit card required.
        </p>

        <div className="mt-10 space-y-3">
          <div>
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://yourstore.myshopify.com"
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {error && <p className="mt-1.5 text-left text-sm text-destructive">{error}</p>}
            {apiErrorMessage && !isRateLimited && (
              <p className="mt-1.5 text-left text-sm text-destructive">{apiErrorMessage}</p>
            )}
            {isRateLimited && (
              <div className="mt-2 space-y-2 text-left">
                <p className="text-sm text-destructive">
                  You've run 3 free scans today. Enter your email below and we'll notify you when you can scan again.
                </p>
                {rateLimitSubmitted ? (
                  <p className="text-sm text-muted-foreground">We'll let you know when you can scan again. Check your inbox shortly.</p>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={rateLimitEmail}
                      onChange={(e) => { setRateLimitEmail(e.target.value); setRateLimitError(""); }}
                      placeholder="Email address"
                      className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button variant="cta" size="sm" onClick={handleNotify}>Notify Me</Button>
                  </div>
                )}
                {rateLimitError && <p className="text-sm text-destructive">{rateLimitError}</p>}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowSpecific(!showSpecific)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Also want to scan a specific page? Add a second URL (optional)
            {showSpecific ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showSpecific && (
            <input
              type="url"
              value={specificUrl}
              onChange={(e) => setSpecificUrl(e.target.value)}
              placeholder="https://yourstore.myshopify.com/products/example"
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 animate-slide-up"
            />
          )}

          <Button variant="cta" size="lg" className="w-full text-base" onClick={handleSubmit}>
            Run Free Audit →
          </Button>

          <p className="text-xs text-muted-foreground">
            Used by Shopify merchants across the UK &amp; EU · WCAG 2.1 AA · EAA Compliant Reporting
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
