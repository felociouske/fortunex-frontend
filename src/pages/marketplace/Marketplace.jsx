import { useQuery } from "@tanstack/react-query";
import DashboardNavbar from "../../components/DashboardNavbar";
import { walletAPI } from "../../api/market";
import { botsAPI } from "../../api/bots";

export default function Marketplace() {
  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ["marketItems"],
    queryFn: marketAPI.getItems,
  });
  const { data: botsData, isLoading: botsLoading } = useQuery({
    queryKey: ["botCatalog"],
    queryFn: botsAPI.getCatalog,
  });

  const marketItems = marketData?.data || [];
  const bots = botsData?.data || [];

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <section className="rounded-[32px] border border-fx-border bg-fx-surface p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Marketplace</h1>
              <p className="text-fx-text-dim mt-2">Discover premium bots, AI modules and strategy tools.</p>
            </div>
            <div className="grid gap-2 sm:flex">
              <div className="rounded-3xl bg-[#11131f] px-4 py-3 text-sm text-fx-text-dim">Bots: {bots.length}</div>
              <div className="rounded-3xl bg-[#11131f] px-4 py-3 text-sm text-fx-text-dim">Items: {marketItems.length}</div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-[32px] border border-fx-border bg-[#11131f] p-6">
              <h2 className="text-xl font-semibold">Bots & AI modules</h2>
              {botsLoading ? (
                <p className="text-fx-text-dim mt-4">Loading bots…</p>
              ) : bots.length ? (
                <div className="mt-4 space-y-4">
                  {bots.map((bot) => (
                    <div key={bot.id} className="rounded-3xl bg-fx-surface2 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-white">{bot.name}</h3>
                          <p className="text-fx-text-dim text-sm mt-1">{bot.category || "Bot"}</p>
                        </div>
                        <span className="text-fx-teal font-semibold">${bot.price}</span>
                      </div>
                      <p className="mt-3 text-fx-text-dim text-sm">{bot.description || "No details provided."}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-fx-text-dim mt-4">No bots available.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[32px] border border-fx-border bg-[#11131f] p-6">
              <h2 className="text-xl font-semibold">Market offers</h2>
              {marketLoading ? (
                <p className="text-fx-text-dim mt-4">Loading marketplace…</p>
              ) : marketItems.length ? (
                <div className="mt-4 space-y-4">
                  {marketItems.map((item) => (
                    <div key={item.id} className="rounded-3xl bg-fx-surface2 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          <p className="text-fx-text-dim text-sm mt-1">{item.category || "Marketplace item"}</p>
                        </div>
                        <span className="text-fx-teal font-semibold">${item.price}</span>
                      </div>
                      <p className="mt-3 text-fx-text-dim text-sm">{item.description || "No description available."}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-fx-text-dim mt-4">No marketplace offers available.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
