import { Button } from "@/components/ui/button";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
      <div className="text-xl font-bold tracking-tight">
        Accessly<span className="text-primary">.</span>
      </div>
      <Button variant="outline-accent" size="sm" asChild>
        <a href="https://merchantautomations.ai" target="_blank" rel="noopener noreferrer">
          Book an Audit
        </a>
      </Button>
    </div>
  </nav>
);

export default Navbar;
