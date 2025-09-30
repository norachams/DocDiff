import React, { useEffect, useMemo, useState } from "react";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

import { unified } from "unified"; 
import remarkParse from "remark-parse"; 
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw"; 
import rehypeSanitize from "rehype-sanitize"; 
import rehypeStringify from "rehype-stringify"; 


type Props = {
  left?: string;
  right?: string;
  className?: string;
};

type Op = [ "equal" | "replace" | "delete" | "insert", number, number, number, number ];

type Row = {
  left: string | null;
  right: string | null;
  tag: "same" | "add" | "del" | "replace";
};


const DiffPreview: React.FC<Props> = ({ left = "", right = "", className = "" }) => {
  const a = useMemo(() => left.split("\n"), [left]);
  const b = useMemo(() => right.split("\n"), [right]);

  const [rows, setRows] = useState<Row[]>([]);
  const [added, setAdded] = useState(0);
  const [removed, setRemoved] = useState(0);
  const [unchanged, setUnchanged] = useState(0);

   const processor = useMemo(
    () =>
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSanitize)
        .use(rehypeStringify),
    []
  );

  const aHtml = useMemo(
    () => a.map((ln) => String(processor.processSync(ln || ""))), 
    [a, processor]
  );
  const bHtml = useMemo(
    () => b.map((ln) => String(processor.processSync(ln || ""))), 
    [b, processor]
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      const res = await fetch(`${API_BASE}/api/diff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: left, b: right }),
      });


      if (!res.ok) { if (alive) { setRows([]); setAdded(0); setRemoved(0); setUnchanged(0); } return; }

      const data: { ops: Op[] } = await res.json();
      if (!alive) return;

      const out: Row[] = [];
      let plus = 0, minus = 0, same = 0;

      for (const [tag, i1, i2, j1, j2] of data.ops) {
        if (tag === "equal") {
          for (let k = 0; k < i2 - i1; k++) {
            out.push({ left: a[i1 + k] ?? "", right: b[j1 + k] ?? "", tag: "same" });
          }
          same += (i2 - i1);
        } else if (tag === "delete") {
          for (let i = i1; i < i2; i++) out.push({ left: a[i] ?? "", right: null, tag: "del" });
          minus += (i2 - i1);
        } else if (tag === "insert") {
          for (let j = j1; j < j2; j++) out.push({ left: null, right: b[j] ?? "", tag: "add" });
          plus += (j2 - j1);
        } else { 
          const len = Math.max(i2 - i1, j2 - j1);
          for (let k = 0; k < len; k++) {
            out.push({
              left:  k < (i2 - i1) ? (a[i1 + k] ?? "") : null,
              right: k < (j2 - j1) ? (b[j1 + k] ?? "") : null,
              tag: "replace",
            });
          }
          minus += (i2 - i1);
          plus  += (j2 - j1);
        }
      }

      setRows(out);
      setAdded(plus);
      setRemoved(minus);
      setUnchanged(same);
    })();

    return () => { alive = false; };
  }, [left, right, a, b]);

  return (
    <section className={`w-full ${className}`}>
      <div className="mx-auto max-w-8xl px-4 py-6 rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Difference Preview</h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 font-medium text-green-800">+ {added}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 font-medium text-red-800">- {removed}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 font-medium text-neutral-700">= {unchanged}</span>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-neutral-200 overflow-hidden">
          {/* headers */}
          <div className="grid grid-cols-2 text-xs text-neutral-500 border-b border-neutral-200 bg-neutral-50">
            <div className="px-3 py-2">Document A</div>
            <div className="px-3 py-2 border-l border-neutral-200">Document B</div>
          </div>

          <div className="max-h-[28rem] overflow-auto text-[13px] leading-6">
            {rows.length === 0 ? (
              <div className="p-6 text-sm text-neutral-400 text-center">
                Upload two PDF files or load the sample to view file differences.
              </div>
            ) : (
              rows.map((r, i) => {
                const leftBg  = r.tag === "del" || r.tag === "replace" ? "bg-red-50"   : r.tag === "same" ? "" : "bg-white";
                const rightBg = r.tag === "add" || r.tag === "replace" ? "bg-green-50" : r.tag === "same" ? "" : "bg-white";

                return (
                  <div key={i} className="grid grid-cols-2">
                    <div className={`px-3 py-1 border-b border-neutral-100 ${leftBg}`}>
                      {r.left !== null ? (
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: aHtml[a.indexOf(r.left)] ?? "" }}
                        />

                      ) : (
                        <span className="text-neutral-300">•</span>
                      )}
                    </div>
                     <div className={`px-3 py-1 border-b border-l border-neutral-100 ${rightBg}`}>
                      {r.right !== null ? (
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: bHtml[b.indexOf(r.right)] ?? "" }}
                        />
                      ) : (
                        <span className="text-neutral-300">•</span>
                      )}
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
