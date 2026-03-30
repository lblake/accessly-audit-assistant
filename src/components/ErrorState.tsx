import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  type: "blocked" | "generic";
  onRetry: () => void;
}

const ErrorState = ({ type, onRetry }: ErrorStateProps) => (
  <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-16">
    <div className="mx-auto w-full max-w-md text-center space-y-4">
      {type === "blocked" ? (
        <>
          <p className="text-lg font-medium">We couldn't scan this store</p>
          <p className="text-sm text-muted-foreground">
            It may be blocking external requests. Contact us for a manual audit.
          </p>
          <Button variant="cta" asChild>
            <a href="mailto:hello@merchantautomations.ai">Contact Us</a>
          </Button>
        </>
      ) : (
        <>
          <p className="text-lg font-medium">Something went wrong</p>
          <p className="text-sm text-muted-foreground">
            Please try again or contact{" "}
            <a href="mailto:hello@merchantautomations.ai" className="underline hover:text-foreground transition-colors">
              hello@merchantautomations.ai
            </a>
          </p>
          <Button variant="cta" onClick={onRetry}>Try Again</Button>
        </>
      )}
    </div>
  </section>
);

export default ErrorState;
