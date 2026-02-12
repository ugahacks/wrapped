"use client";

import Link from "next/link";

type FooterProps = {
  className?: string;
};

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`mx-auto mb-0 mt-6 max-w-4xl px-4 text-center text-sm text-cream/70 md:px-6 ${className}`}>
      <div className="mx-auto mb-4 h-px w-full max-w-3xl bg-cream/10" />
      <p className="text-cream/70">Made with ✨ by UGAHacks
</p>
<p className="text-cream/70">© 2026 UGAHacks. All rights reserved.

</p>
      <p className="mt-1 text-cream/55">
        <Link
          href="https://ugahacks.com"
          className="underline underline-offset-4 transition-colors hover:text-cream"
          target="_blank"
          rel="noreferrer"
          
        >
          UGAHacks Main Website
        </Link>
        <span className="mx-2 text-cream/30">•</span>
        <Link
          href="https://11.ugahacks.com"
          className="underline underline-offset-4 transition-colors hover:text-cream"
          target="_blank"
          rel="noreferrer"
        >
          UGAHacks 11 Website
        </Link>
      </p>
    </footer>
  );
}
