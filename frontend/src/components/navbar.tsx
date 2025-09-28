import React from "react";
import { Download, RotateCcw, Sparkles } from "lucide-react";

type Props = {
  onLoadSample: () => void;
  onReset: () => void;
  onExport: () => void;
  className?: string;
};

const Navbar: React.FC<Props> = ({ onLoadSample, onReset, onExport, className = "" }) => {
  return (
    <header className={`w-full ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Doc Detective <span className="text-amber-600 font-bold">Lite</span>
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Compare two document versions using Cardinal-style extraction outputs (Markdown) and visualize changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100 active:scale-[.99]"
            aria-label="Load sample"
          >
            <Sparkles className="h-4 w-4" />
            Load sample
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
            aria-label="Reset"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-neutral-800 active:scale-[.99]"
            aria-label="Export report"
          >
            <Download className="h-4 w-4" />
            Export report
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
