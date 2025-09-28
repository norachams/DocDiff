import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6 text-center max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-1 text-sm font-medium ring-1 ring-white/10">
          <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
          Tailwind is ready to go
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Build your UI with Tailwind&nbsp;CSS
        </h1>
        <p className="text-slate-400">
          Edit <code className="rounded bg-slate-900/60 px-1.5 py-1">src/App.tsx</code> and save to see changes instantly.
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={() => setCount((value) => value + 1)}
          className="rounded-lg bg-emerald-500 px-5 py-2.5 text-base font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
        >
          Count is {count}
        </button>
        <p className="text-sm text-slate-500">
          Try editing <span className="font-medium">tailwind.config.ts</span> to customize the design tokens.
        </p>
      </div>
    </main>
  )
}

export default App
