import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Issue {
  title: string;
  description: string;
  severity: "Critical" | "Major" | "Minor";
  legalRisk: string;
  howToFix: string;
}

interface ResultsPanelProps {
  riskScore: number;
  totalIssues: number;
  categories: number;
  topIssues: Issue[];
  scanId: string;
  apiBaseUrl: string;
  onScanAnother: () => void;
}

const severityColors: Record<string, string> = {
  Critical: "bg-destructive text-destructive-foreground",
  Major: "bg-warning text-primary-foreground",
  Minor: "bg-muted text-muted-foreground",
};

const getScoreColor = (score: number) => {
  if (score <= 3) return "text-success";
  if (score <= 6) return "text-warning";
  return "text-destructive";
};

const ResultsPanel = ({
  riskScore,
  totalIssues,
  categories,
  topIssues,
  scanId,
  apiBaseUrl,
  onScanAnother,
}: ResultsPanelProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-8 pt-24 sm:px-6">
      {/* Risk Score */}
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Compliance Risk Score
        </p>
        <p className={`mt-2 text-7xl font-bold tabular-nums ${getScoreColor(riskScore)}`}>
          {riskScore}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Based on {totalIssues} issues found across {categories} categories
        </p>
      </div>

      {/* Top Issues */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Top Issues</h2>
        {topIssues.map((issue, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 animate-slide-up">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold">{issue.title}</h3>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${severityColors[issue.severity]}`}>
                {issue.severity}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{issue.description}</p>
            <p className="mt-2 text-sm italic text-muted-foreground">{issue.legalRisk}</p>

            <button
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              How to fix this →
              {expandedIndex === i ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {expandedIndex === i && (
              <p className="mt-2 text-sm text-muted-foreground animate-slide-up">{issue.howToFix}</p>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="cta" size="lg" className="flex-1" asChild>
          <a href={`${apiBaseUrl}/api/audit/${scanId}/pdf`} download>
            Download Full Report
          </a>
        </Button>
        <Button variant="outline-accent" size="lg" className="flex-1" onClick={onScanAnother}>
          Scan Another Store
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-center text-muted-foreground">
        Automated scans detect approximately 30% of accessibility issues. Manual review required for full compliance.
      </p>
    </section>
  );
};

export default ResultsPanel;
