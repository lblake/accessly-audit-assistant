import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LeadCaptureModalProps {
  onSubmit: (firstName: string, email: string, subscribe: boolean) => void;
}

const LeadCaptureModal = ({ onSubmit }: LeadCaptureModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(true);
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!firstName.trim()) newErrors.firstName = "Please enter your name";
    if (!email.trim()) newErrors.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    onSubmit(firstName.trim(), email.trim(), subscribe);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-2xl animate-slide-up">
        <div className="h-1 rounded-t-xl bg-primary" />
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Where should we send your report?</h2>

          <div className="mt-6 space-y-4">
            <div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: undefined })); }}
                placeholder="First name"
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.firstName && <p className="mt-1 text-sm text-destructive">{errors.firstName}</p>}
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="Email address"
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
            </div>

            <label className="flex items-start gap-3 cursor-pointer text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              />
              Notify me about accessibility updates and tips
            </label>

            <Button variant="cta" size="lg" className="w-full text-base" onClick={handleSubmit}>
              Start Scan →
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              No spam. Unsubscribe anytime. Your data is handled in line with UK GDPR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
