"use client";

import { useEffect } from "react";

const POINTER_SELECTOR = ".interactive-pop, .nav-pill, .footer-link-pop";

export function PointerGlow() {
  useEffect(() => {
    const updatePointerPosition = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const element = event.target.closest(POINTER_SELECTOR);

      if (!(element instanceof HTMLElement)) {
        return;
      }

      const bounds = element.getBoundingClientRect();

      element.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      element.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    };

    document.addEventListener("pointermove", updatePointerPosition, { passive: true });

    return () => {
      document.removeEventListener("pointermove", updatePointerPosition);
    };
  }, []);

  return null;
}
