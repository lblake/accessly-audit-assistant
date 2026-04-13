import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import LoadingState from "@/components/LoadingState";
import ResultsPanel from "@/components/ResultsPanel";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

type AppState = "input" | "modal" | "loading" | "results";

// ── Backend URL ───────────────────────────────────────────────────────────────
const API_BASE_URL = "https://accesslyscan-backend.onrender.com";

// ── Fallback shown in results UI during development / if scan result is null ──
const MOCK_RESULT = {
  scanId: "mock-123",
  riskScore: 8,
  pageScanned: "gymshark.com/collections/all",
  executiveSummary: "This store has several critical accessibility issues that create significant legal exposure under the EAA and Equality Act 2010. Multiple issues prevent disabled customers from completing purchases.",
  topIssues: [
    {
      title: "Images missing alternative text",
      description: "47 product images have no descriptive text, making them completely invisible to screen reader users and visually impaired customers.",
      severity: "Critical" as const,
      legalRisk: "Potential EAA exposure · Equality Act 2010 risk",
      howToFix: "Add an alt attribute to every img tag describing what the image shows.",
    },
    {
      title: "Form fields have no labels",
      description: "Email signup and checkout forms use placeholder text instead of proper labels, which disappear when a user starts typing.",
      severity: "Critical" as const,
      legalRisk: "WCAG 2.1 AA failure · High conversion impact",
      howToFix: "Replace placeholder-only inputs with visible label elements linked via for and id attributes.",
    },
    {
      title: "Insufficient colour contrast on buttons",
      description: "Primary CTA buttons fail the 4.5:1 contrast ratio required by WCAG 2.1 AA.",
      severity: "Major" as const,
      legalRisk: "EAA compliance gap · Affects conversion rate",
      howToFix: "Darken the button text or adjust the background colour until contrast ratio reaches 4.5:1.",
    },
  ],
  fullIssueList: [],
  pdfUrl: "#",
};

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
  // Full list returned by the API — used for accurate issue counts
  fullIssueList: Array<{
    title: string;
    severity: "Critical" | "Major" | "Minor";
    count: number;
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
      const timeout = setTimeout(() => controller.abort(), 90000); // 90s — WAVE + Claude can take ~60s

      try {
        const response = await fetch(`${API_BASE_URL}/api/audit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // If a specific page URL was provided use that, otherwise use the store URL
            url: specificUrl || url,
            email,
            firstName,
          }),
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

        const data: ScanResult = await response.json();
        setScanResult(data);
        setState("results");
      } catch (err: any) {
        clearTimeout(timeout);
        if (err?.name === "AbortError") {
          setApiError("WAVE_TIMEOUT");
        } else {
          setApiError("GENERIC");
        }
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

  const displayResult = scanResult || MOCK_RESULT;

  // Total issues from the full list; fall back to topIssues length if not available
  const totalIssues = displayResult.fullIssueList?.length || displayResult.topIssues.length;
  // Count unique severity levels across all issues as a proxy for categories
  const categories = new Set(
    (displayResult.fullIssueList?.length ? displayResult.fullIssueList : displayResult.topIssues)
      .map((i) => i.severity)
  ).size;

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

        {state === "results" && displayResult && (
          <>
            <ResultsPanel
              riskScore={displayResult.riskScore}
              totalIssues={totalIssues}
              categories={categories}
              topIssues={displayResult.topIssues}
              scanId={displayResult.scanId}
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
