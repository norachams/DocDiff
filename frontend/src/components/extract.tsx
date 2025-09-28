import React, { useState } from "react";

type Props = {
  markdownA?: string;
  markdownB?: string;
  className?: string;
};

const Extract: React.FC<Props> = ({ markdownA = "", markdownB = "", className = "" }) => {
  const [tab, setTab] = useState<"A" | "B">("A");
  const current = tab === "A" ? markdownA : markdownB;

  return (
    <section className={`w-full ${className}`}>
      {/* Simple tabs */}
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab("A")}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
            tab === "A"
              ? "bg-neutral-100 text-neutral-900"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Version A
        </button>
        <button
          type="button"
          onClick={() => setTab("B")}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
            tab === "B"
              ? "bg-neutral-100 text-neutral-900"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Version B
        </button>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          Source ({tab})
        </h3>

        <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-3">
          {current ? (
            <pre className="whitespace-pre-wrap break-words text-sm text-neutral-800 font-mono">
              {current}
            </pre>
          ) : (
            <div className="text-sm text-neutral-400 font-mono">(empty)</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Extract;
