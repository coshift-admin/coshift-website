import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";

/**
 * Discreet WhatsApp quick-contact. WhatsApp is the default business channel in
 * Algeria, so a low-key floating action earns its place — styled to match the
 * brand, not a loud green bubble. Expands to reveal a label on hover/focus.
 */
export async function WhatsAppFab() {
  const t = await getTranslations("contact.details");
  const number = site.whatsapp.replace(/\D+/g, "");

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappLabel")}
      data-cursor-label={t("whatsappLabel")}
      className="group fixed bottom-6 right-6 z-[80] inline-flex items-center gap-0 overflow-hidden rounded-full border border-white/15 bg-[color-mix(in_oklab,var(--coshift-ink)_70%,black)]/80 py-3 pl-3 pr-3 text-[var(--coshift-bone)] backdrop-blur-md transition-colors hover:border-[var(--coshift-cyan)] hover:text-[var(--coshift-cyan)] md:bottom-8 md:right-8"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-5 w-5 shrink-0 fill-current"
      >
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.17 0 4.2.84 5.74 2.38a8.06 8.06 0 0 1 2.37 5.72c0 4.48-3.64 8.12-8.12 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.14.82.84-3.06-.2-.31a8.09 8.09 0 0 1-1.24-4.3c0-4.48 3.64-8.1 8.12-8.1Zm-2.35 3.5c-.22 0-.58.08-.88.4-.3.33-1.15 1.13-1.15 2.75s1.18 3.19 1.34 3.41c.16.22 2.3 3.52 5.6 4.79 2.75 1.06 3.31.85 3.9.8.6-.06 1.93-.79 2.2-1.55.27-.76.27-1.42.19-1.55-.08-.13-.3-.22-.63-.38-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.74.17-.22.33-.85 1.06-1.04 1.28-.19.22-.38.24-.71.08-.33-.16-1.38-.51-2.63-1.62-.97-.87-1.63-1.94-1.82-2.27-.19-.33-.02-.5.15-.66.15-.15.33-.38.49-.58.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.58-.08-.16-.72-1.79-1.01-2.45-.26-.6-.53-.52-.72-.53l-.62-.01Z" />
      </svg>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-mono transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:ml-2 group-hover:max-w-[10rem] group-focus-visible:ml-2 group-focus-visible:max-w-[10rem]">
        {t("whatsappLabel")}
      </span>
    </a>
  );
}
