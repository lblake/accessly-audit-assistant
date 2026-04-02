import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import LoadingState from "@/components/LoadingState";
import ResultsPanel from "@/components/ResultsPanel";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

type AppState = "input" | "modal" | "loading" | "results";

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
  const [apiError, setApiError] = useState<string | null>(null);

  const handleUrlSubmit = useCallback((submittedUrl: string, specific?: string) => {
    setUrl(submittedUrl);
    setSpecificUrl(specific);
    setApiError(null);
    setState("modal");
  }, []);

  const handleLeadSubmit = useCallback(
    async (firstName: string, email: string, _subscribe: boolean) => {
      setState("loading");
      setApiError(null);

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
          const code = data?.code || "GENERIC";
          setApiError(code);
          setState("input");
          return;
        }

        const data = await response.json();
        setScanResult(data);
        setState("results");
      } catch (err: any) {
        clearTimeout(timeout);
        setApiError("GENERIC");
        setState("input");
      }
    },
    [url, specificUrl]
  );

  const handleReset = useCallback(() => {
    setState("input");
    setUrl("");
    setSpecificUrl(undefined);
    setScanResult(null);
    setApiError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {state === "input" && (
          <HeroSection onSubmit={handleUrlSubmit} apiError={apiError} apiBaseUrl={API_BASE_URL} />
        )}

        {state === "modal" && (
          <>
            <HeroSection onSubmit={handleUrlSubmit} apiError={apiError} apiBaseUrl={API_BASE_URL} />
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
      </main>

      <Footer />
    </div>
  );
};

export default Index;
