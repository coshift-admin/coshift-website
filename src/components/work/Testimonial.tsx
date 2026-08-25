import { ShiftGlyph } from "@/components/icons/ShiftGlyph";

/**
 * Renders a client pull-quote — only when a real, cleared quote is supplied
 * (see CaseStudy.quote). Never shown with invented text.
 */
export function Testimonial({
  quote,
  author,
  role,
}: {
  quote?: string;
  author?: string;
  role?: string;
}) {
  if (!quote) return null;
  return (
    <section
      aria-label="Client testimonial"
      className="container-x mx-auto max-w-[1600px] border-t border-white/10 py-20 md:py-28"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-16">
        <ShiftGlyph className="hidden h-12 w-auto text-[var(--coshift-cyan)] md:col-span-2 md:block" />
        <blockquote className="md:col-span-10">
          <p className="font-display max-w-[24ch] text-[length:var(--fs-h3)] font-medium leading-[1.25] tracking-[-0.01em] text-[var(--coshift-bone)] md:max-w-[32ch]">
            “{quote}”
          </p>
          {(author || role) && (
            <footer className="text-mono mt-8 text-[var(--coshift-bone)]/60">
              {author}
              {author && role ? " · " : ""}
              {role}
            </footer>
          )}
        </blockquote>
      </div>
    </section>
  );
}
