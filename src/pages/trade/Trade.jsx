import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardNavbar from "../../components/DashboardNavbar";
import { tradingAPI } from "../../api/trading";

export default function TradePage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["marketInstruments"],
    queryFn: tradingAPI.getMarket,
  });
  const instruments = data?.data || [];

  const filtered = useMemo(() => {
    return instruments.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [instruments, search]);

  const categories = Array.from(new Set(instruments.map((item) => item.category))).slice(0, 5);

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="rounded-[32px] border border-fx-border bg-fx-surface p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Trade types</h1>
              <p className="text-fx-text-dim mt-2">Choose a market type and open your next contract.</p>
            </div>
            <div className="w-full max-w-sm">
              <div className="relative rounded-3xl border border-fx-border bg-[#11131f] px-4 py-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-fx-text placeholder-fx-text-dim outline-none"
                  placeholder="Search trades"
                />
                <div className="pointer-events-none absolute inset-y-0 right-4 top-1/2 -translate-y-1/2 text-fx-text-dim">🔍</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 rounded-[32px] border border-fx-border bg-fx-surface p-5">
            <div className="text-fx-text-dim uppercase tracking-[0.3em] text-xs">Categories</div>
            <div className="space-y-3">
              {categories.length ? categories.map((category) => (
                <div key={category} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left bg-[#11131f] text-white">
                  <span className="h-10 w-10 rounded-2xl bg-[#0f1222] grid place-items-center text-xl">•</span>
                  <div>
                    <div className="text-sm font-semibold">{category}</div>
                  </div>
                </div>
              )) : (
                <div className="text-fx-text-dim">No categories available.</div>
              )}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[32px] border border-fx-border bg-fx-surface p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-fx-text-dim text-sm uppercase tracking-[0.3em]">Featured instruments</p>
                  <h2 className="text-2xl font-semibold">Available contracts</h2>
                </div>
                <button className="btn-outline w-full max-w-max">Refresh</button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {isLoading ? (
                <div className="text-fx-text-dim">Loading market data…</div>
              ) : filtered.length ? filtered.map((instrument) => (
                <div key={instrument.id} className="rounded-[32px] border border-fx-border bg-[#11131f] p-5 transition hover:border-fx-teal">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-fx-text-dim">{instrument.category}</div>
                      <h3 className="mt-3 text-xl font-semibold">{instrument.name}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-3xl bg-fx-surface2 grid place-items-center text-xl">{instrument.symbol}</div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-fx-text-dim">
                    <div className="rounded-2xl bg-[#0f1222] p-3">Status</div>
                    <div className="rounded-2xl bg-[#0f1222] p-3">{instrument.active ? "Active" : "Paused"}</div>
                  </div>
                  <p className="mt-4 text-fx-text-dim">{instrument.description || "No description available."}</p>
                </div>
              )) : (
                <div className="rounded-[32px] border border-fx-border bg-[#11131f] p-5 text-fx-text-dim">No market instruments found.</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
