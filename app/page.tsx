import Link from "next/link";

const categories = [
  { name: "Forex", slug: "forex", desc: "Mercado cambial global" },
  { name: "Criptomoedas", slug: "crypto", desc: "Bitcoin, altcoins e mais" },
  { name: "Ações Internacionais", slug: "acoes", desc: "Mercados de ações globais" },
  { name: "BODIVA", slug: "bodiva", desc: "Bolsa de Dívida e Valores de Angola" },
  { name: "Commodities", slug: "commodities", desc: "Ouro, petróleo e mais" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="border-b border-zinc-800 px-6 py-20 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Aprende com quem <span className="text-emerald-400">negoceia de verdade</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
          Conteúdo, aulas e análises de traders e analistas verificados.
          Formação em mercados financeiros, feita para Angola.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-md bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
          >
            Começar agora
          </Link>
          <Link
            href="/diretorio"
            className="rounded-md border border-zinc-700 px-6 py-3 font-semibold text-white transition hover:border-zinc-500"
          >
            Explorar traders
          </Link>
        </div>
      </section>

      {/* Categorias */}
      <section className="px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-semibold">
          Escolhe o teu mercado
        </h2>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/diretorio?categoria=${cat.slug}`}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500 hover:bg-zinc-800"
            >
              <h3 className="text-lg font-semibold">{cat.name}</h3>
              <p className="mt-1 text-sm text-zinc-400">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
          }
