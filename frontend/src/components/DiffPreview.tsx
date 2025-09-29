import React, { useMemo } from "react";
import { diffLines } from "diff";

type Props = {
  left?: string;  
  right?: string;   
  className?: string;
};

type Row = {
  leftText: string | null;
  rightText: string | null;
  kind: "same" | "add" | "del";
};

const DiffPreview: React.FC<Props> = ({ left = "", right = "", className = "" }) => {
  const { rows, added, removed, unchanged } = useMemo(() => {
    const rows: Row[] = [];
    let added = 0, removed = 0, unchanged = 0;

    const parts = diffLines(left, right, { newlineIsToken: false });

    for (const p of parts) {
      const lines = (p.value ?? "").split("\n");

      if (lines.length && lines[lines.length - 1] === "") lines.pop();

      if (p.added) {

        added += lines.length;
        for (const ln of lines) rows.push({ leftText: null, rightText: ln, kind: "add" });
      } else if (p.removed) {

        removed += lines.length;
        for (const ln of lines) rows.push({ leftText: ln, rightText: null, kind: "del" });
      } else {

        unchanged += lines.length;
        for (const ln of lines) rows.push({ leftText: ln, rightText: ln, kind: "same" });
      }
    }

    return { rows, added, removed, unchanged };
  }, [left, right]);

  return (
    <section className={`w-full ${className}`}>
      <div className="mx-auto max-w-8xl px-4 py-6 rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Difference Preview</h2>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 font-medium text-green-800">
              + {added}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 font-medium text-red-800">
              - {removed}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 font-medium text-neutral-700">
              = {unchanged}
            </span>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-neutral-200 overflow-hidden">
          {/* headers */}
          <div className="grid grid-cols-2 text-xs text-neutral-500 border-b border-neutral-200 bg-neutral-50">
            <div className="px-3 py-2">Document A</div>
            <div className="px-3 py-2 border-l border-neutral-200">Document B</div>
          </div>

          {/* rows */}
          <div className="max-h-[28rem] overflow-auto font-mono text-[13px] leading-6">
            {rows.length === 0 ? (
              <div className="p-6 text-sm text-neutral-400 text-center">
                Upload two PDF files or load the sample to view file differences.
              </div>
            ) : (
              rows.map((r, i) => {
                const leftClasses =
                  r.kind === "del"
                    ? "bg-red-50"
                    : r.kind === "same"
                    ? ""
                    : "bg-white";
                const rightClasses =
                  r.kind === "add"
                    ? "bg-green-50"
                    : r.kind === "same"
                    ? ""
                    : "bg-white";

                return (
                  <div key={i} className="grid grid-cols-2">
                    <div className={`px-3 py-1 border-b border-neutral-100 ${leftClasses}`}>
                      {r.leftText !== null ? r.leftText : <span className="text-neutral-300">•</span>}
                    </div>
                    <div className={`px-3 py-1 border-b border-neutral-100 border-l border-neutral-100 ${rightClasses}`}>
                      {r.rightText !== null ? r.rightText : <span className="text-neutral-300">•</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiffPreview;
