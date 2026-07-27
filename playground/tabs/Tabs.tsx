'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  initialIndex?: number;
};

export function Tabs({ items, initialIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activateTab = (index: number) => {
    if (index < 0 || index >= items.length) {
      return;
    }

    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        const nextIndex = (index + 1) % items.length;
        activateTab(nextIndex);
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const previousIndex = (index - 1 + items.length) % items.length;
        activateTab(previousIndex);
        break;
      }
      case 'Home': {
        event.preventDefault();
        activateTab(0);
        break;
      }
      case 'End': {
        event.preventDefault();
        activateTab(items.length - 1);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
      <div role="tablist" aria-label="Demo tabs" className="flex flex-wrap gap-2">
        {items.map((item, index) => {
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;
          const isSelected = index === activeIndex;

          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-lg'
                  : 'border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-300'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item, index) => {
        const tabId = `${baseId}-tab-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        const isSelected = index === activeIndex;

        return (
          <div
            key={item.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isSelected}
            className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm leading-7 text-slate-300"
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}

export function TabsDemo() {
  const items = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Overview panel</h3>
          <p>This is the first tab panel. It is shown when the Overview tab is selected.</p>
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Details panel</h3>
          <p>This tab demonstrates the keyboard interaction model for moving between tabs.</p>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Settings panel</h3>
          <p>Use Arrow Left/Right to move between tabs, Home/End to jump to the ends, and Tab to leave the tablist normally.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Tabs demo</p>
          <h1 className="text-3xl font-semibold text-white">Accessible tablist playground</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300">
            This demo follows the W3C ARIA Authoring Practices model for tabs with keyboard support.
          </p>
        </div>

        <Tabs items={items} />
      </div>
    </div>
  );
}
