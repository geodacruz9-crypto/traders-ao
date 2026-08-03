export const dynamic = "force-dynamic";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const categories = [
  { value: "", label: "Todos os mercados" },
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Criptomoedas" },
  { value: "acoes", label: "Ações Internacionais" },
  { value: "bodiva", label: "BODIVA" },
  { value: "commodities", label: "Commodities" },
];

export default async function Diretorio({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("profiles").select("*").eq("role", "trader");

  if (params.categoria) {
    query = query.eq("market_category", params.categoria);
  }
  if (params.q) {
    query = query.ilike("full_name", `%${params.q}%`);
  }

  const { data: traders } = await query;

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white">
      <h1 className="mb-8 text-3xl font-bold">Diretório de Traders</h1>

      <form method="get" className="mb-10 flex flex-wrap gap-3">
        <input
          type="text"
          name="q"
          placeholder="Pesquisar por nome..."
          defaultValue={params.q}
          className="flex-1 min-w-[200px] rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-white placeholder-zinc-500"
        />
        <select
          name="categoria"
          defaultValue={params.categoria || ""}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-emerald-500 px-6 py-2 font-semibold text-black hover:bg-emerald-400"
        >
          Filtrar
        </button>
      </form>

      {traders && traders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {traders.map((trader) => (
            <Link
              key={trader.id}
              href={`/trader/${trader.id}`}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500"
            >
              <h3 className="text-lg font-semibold">
                {trader.full_name || "Trader sem nome"}
              </h3>
              <p className="mt-1 text-sm text-emerald-400">
                {trader.market_category || "Mercado não definido"}
              </p>
              <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                {trader.bio || "Sem descrição."}
              </p>
              {trader.verified && (
                <span className="mt-3 inline-block rounded bg-emerald-900 px-2 py-1 text-xs text-emerald-300">
                  ✓ Verificado
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500">
          Nenhum trader encontrado ainda. Sê o primeiro a inscrever-te.
        </p>
      )}
    </div>
  );
  }
