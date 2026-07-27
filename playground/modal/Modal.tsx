'use client';

import { useEffect, useId, useRef, useState, useCallback, type MouseEvent as ReactMouseEvent, type ReactNode, type RefObject } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  triggerRef?: RefObject<HTMLElement>;
};

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function Modal({ isOpen, onClose, title, children, triggerRef }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previouslyFocusedElementRef.current = triggerRef?.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);

    const focusableElements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
    const firstFocusable = focusableElements[0] ?? dialogRef.current;

    const frame = window.requestAnimationFrame(() => {
      firstFocusable?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!dialogRef.current?.contains(activeElement) || activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (!dialogRef.current?.contains(activeElement) || activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocusedElementRef.current?.focus();
      window.cancelAnimationFrame(frame);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 px-3 py-1 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalDemo() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div aria-hidden={isOpen} inert={isOpen} className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Modal demo</p>
          <h1 className="text-3xl font-semibold text-white">Accessible dialog playground</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300">
            Open the modal to test focus movement, focus trapping, the Escape key, and closing on overlay click.
          </p>
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
        >
          Open dialog
        </button>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <p className="font-medium text-white">Background content</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This content stays in the page behind the dialog and should not be reachable while the modal is open.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200">
              Secondary action
            </button>
            <button type="button" className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200">
              Another action
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title="Example dialog" triggerRef={triggerRef}>
        <p className="text-base text-slate-200">
          This dialog follows the W3C ARIA Authoring Practices pattern for modal dialogs with keyboard support.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button type="button" className="rounded-full bg-white px-4 py-2 font-medium text-slate-950">
            Primary action
          </button>
          <button type="button" className="rounded-full border border-slate-700 px-4 py-2 font-medium text-slate-200">
            Secondary action
          </button>
        </div>
      </Modal>
    </div>
  );
}
