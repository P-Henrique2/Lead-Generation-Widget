'use client';

import { useId, useState, type ReactNode } from 'react';

type DisclosureProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function Disclosure({ title, children, defaultOpen = false }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-700 px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
      >
        <span>{title}</span>
        <span className="text-cyan-300">{isOpen ? '−' : '+'}</span>
      </button>

      <div id={contentId} hidden={!isOpen} className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm leading-7 text-slate-300">
        {children}
      </div>
    </div>
  );
}

export function DisclosureDemo() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Disclosure demo</p>
          <h1 className="text-3xl font-semibold text-white">Accessible show/hide playground</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300">
            This demo uses two separate disclosures to show the W3C ARIA show/hide pattern in action.
          </p>
        </div>

        <div className="space-y-4">
          <Disclosure title="What is this component?" defaultOpen>
            <p>
              This disclosure uses a real button element with aria-expanded and aria-controls so assistive technology can understand its state.
            </p>
          </Disclosure>

          <Disclosure title="How does it behave?">
            <ul className="list-disc space-y-2 pl-5">
              <li>The content region is hidden from the accessibility tree when collapsed.</li>
              <li>Enter and Space toggle the disclosure when the button has focus.</li>
              <li>Each disclosure is independent, so the open state is scoped to its own instance.</li>
            </ul>
          </Disclosure>
        </div>
      </div>
    </div>
  );
}
