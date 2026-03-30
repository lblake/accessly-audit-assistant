import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import LoadingState from "@/components/LoadingState";
import ResultsPanel from "@/components/ResultsPanel";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import RateLimitedState from "@/components/RateLimitedState";
import ErrorState from "@/components/ErrorState";

type AppState = "input" | "modal" | "loading" | "results" | "rate-limited" | "error-blocked" | "error-generic";

const API_BASE_URL = ""; // Replace with your Render URL once deployed

interface ScanResult {
  scanId: string;
  riskScore: number;
  topIssues: Array<{
    title: string;
    description: string;
    severity: "Critical" | "Major" | "Minor";
    legalRisk: string;
    howToFix: string;
  }>;
  executiveSummary: string;
  pdfUrl: string;
  pageScanned: string;
}

const Index = () => {
  const [state, setState] = useState<AppState>("input");
  const [url, setUrl] = useState("");
  const [specificUrl, setSpecificUrl] = useState<string | undefined>();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleUrlSubmit = useCallback((submittedUrl: string, specific?: string) => {
    setUrl(submittedUrl);
    setSpecificUrl(specific);
    setState("modal");
  }, []);

  const handleLeadSubmit = useCallback(
    async (firstName: string, email: string, _subscribe: boolean) => {
      setState("loading");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      try {
        const response = await fetch(`${API_BASE_URL}/api/audit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, specificUrl, email, firstName }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (data?.code === "RATE_LIMITED") {
            setState("rate-limited");
            return;
          }
          if (data?.code === "BLOCKED") {
            setState("error-blocked");
            return;
          }
          setState("error-generic");
          return;
        }

        const data = await response.json();
        setScanResult(data);
        setState("results");
      } catch (err: any) {
        clearTimeout(timeout);
        if (err?.name === "AbortError") {
          setState("error-generic");
        } else {
          setState("error-generic");
        }
      }
    },
    [url, specificUrl]
  );

  const handleReset = useCallback(() => {
    setState("input");
    setUrl("");
    setSpecificUrl(undefined);
    setScanResult(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {state === "input" && <HeroSection onSubmit={handleUrlSubmit} />}

        {state === "modal" && (
          <>
            <HeroSection onSubmit={handleUrlSubmit} />
            <LeadCaptureModal onSubmit={handleLeadSubmit} />
          </>
        )}

        {state === "loading" && <LoadingState />}

        {state === "results" && scanResult && (
          <>
            <ResultsPanel
              riskScore={scanResult.riskScore}
              totalIssues={scanResult.topIssues.length}
              categories={new Set(scanResult.topIssues.map((i) => i.severity)).size}
              topIssues={scanResult.topIssues}
              scanId={scanResult.scanId}
              apiBaseUrl={API_BASE_URL}
              onScanAnother={handleReset}
            />
            <CTABanner />
          </>
        )}

        {state === "rate-limited" && <RateLimitedState apiBaseUrl={API_BASE_URL} />}
        {state === "error-blocked" && <ErrorState type="blocked" onRetry={handleReset} />}
        {state === "error-generic" && <ErrorState type="generic" onRetry={handleReset} />}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
