import { Button } from "@/components/ui/button";

const CTABanner = () => (
  <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 border-l-4 border-l-primary">
      <h3 className="text-lg font-semibold">Want the full picture?</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Automated scanners catch around 30% of accessibility issues. Our manual audit finds the rest — we tell your devs exactly what to fix first, in an order that protects you legally and ships faster, plus a report that proves you meet WCAG standards. Starting from £1,500.
      </p>
      <Button variant="cta" size="lg" className="mt-4" asChild>
        <a href="https://link.accesslyscan.ai/widget/booking/ilnrdPtvRfUBZ4gd4ltA" target="_blank" rel="noopener noreferrer">
          Book a Free Audit Review Call
        </a>
      </Button>
    </div>
  </section>
);

export default CTABanner;
