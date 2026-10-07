import { getTranslations } from "next-intl/server";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

/**
 * Floating WhatsApp contact — WhatsApp is the default business channel in
 * Algeria. It uses the real WhatsApp mark in WhatsApp's own green so it is
 * recognised at a glance (DS: brand colour "only where recognition matters").
 *
 * The label ("Write on WhatsApp") slides out in a navy pill on hover / keyboard
 * focus: white text directly on #25D366 would be too low-contrast to read.
 * Sits at the inline-end corner, so it moves to the left in Arabic.
 */
export async function WhatsAppFab() {
  const t = await getTranslations("home.cta");
  const label = t("secondary");
  const number = site.whatsapp.replace(/\D+/g, "");

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed bottom-5 end-5 z-[80] flex flex-row-reverse items-center gap-3 md:bottom-8 md:end-8"
    >
      <span className="grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-8px_rgba(37,211,102,0.65),0_2px_6px_rgba(0,0,0,0.3)] transition-[background-color,transform] duration-[var(--dur-ds-normal)] ease-[var(--ease-ds)] group-hover:bg-[#1fbd5a] group-active:translate-y-[0.5px]">
        <WhatsappLogo weight="fill" aria-hidden className="size-8" />
      </span>
      <span
        aria-hidden
        className="pointer-events-none hidden whitespace-nowrap rounded-lg border border-white/10 bg-[var(--coshift-haze)] px-3.5 py-2 text-sm font-semibold text-white opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-[opacity,translate] duration-[var(--dur-ds-slow)] ease-[var(--ease-ds)] [translate:6px_0] group-hover:opacity-100 group-hover:[translate:0_0] group-focus-visible:opacity-100 group-focus-visible:[translate:0_0] rtl:[translate:-6px_0] rtl:group-hover:[translate:0_0] rtl:group-focus-visible:[translate:0_0] md:block"
      >
        {label}
      </span>
    </a>
  );
}
