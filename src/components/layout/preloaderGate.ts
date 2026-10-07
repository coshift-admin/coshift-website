/**
 * Inline boot script, rendered by the locale layout before <Preloader /> is
 * parsed: a repeat visit in the same session gets `data-preloaded` on <html>
 * before first paint, so the preloader never flashes and the hero entrance
 * runs without the --intro-delay offset.
 *
 * Pairs with `html[data-preloaded]` in globals.css. Lives outside
 * Preloader.tsx because that file is "use client": a string exported from it
 * reaches server components as a client reference, not text.
 */
export const PRELOADER_GATE = `try{var d=document.documentElement,k="coshift:preloaded";if(sessionStorage.getItem(k)){d.dataset.preloaded="1"}sessionStorage.setItem(k,"1")}catch(e){}`;
