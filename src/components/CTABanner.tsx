import { Button } from "@/components/ui/button";

const CTABanner = () => (
  <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 border-l-4 border-l-primary">
      <h3 className="text-lg font-semibold">Want the full picture?</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Our manual accessibility audit covers everything the automated scan misses — prioritised fix list, developer-ready notes, and compliance documentation. Starting from £1,500.
      </p>
      <Button variant="cta" size="lg" className="mt-4" asChild>
        <a href="https://merchantautomations.ai" target="_blank" rel="noopener noreferrer">
          Book a Free 20-Minute Call
        </a>
      </Button>
    </div>
  </section>
);

export default CTABanner;
