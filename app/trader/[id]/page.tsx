import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function PerfilTrader({ id }: { id: string }) {
  const supabase = await createClient();

  const { data: trader } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "trader")
    .single();

  if (!trader) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  let hasAccess = false;
  if (user) {
    const { data: grant } = await supabase
      .from("access_grants")
      .select("*")
      .eq("trader_id", id)
      .eq("client_id", user.id)
      .eq("active", true)
      .maybeSingle();
    hasAccess = !!grant;
  }

  const { data: content } = await supabase
    .from("content")
    .select("*")
    .eq("trader_id", id)
    .order("created_at", { ascending: false });

  const freeContent = content?.filter((c) => !c.is_premium) || [];
  const visiblePremiumContent = content?.filter((c) => c.is_premium) || [];

  const { data: premiumCount } = await supabase.rpc(
    "count_premium_content",
    { trader: id },
  );

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/diretorio" className="text-sm text-zinc-400 hover:text-white">
          ← Voltar ao diretório
        </Link>

        <div className="mt-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {trader.full_name || "Trader"}
            </h1>
            <p className="mt-1 text-emerald-400">
              {trader.market_category || "Mercado não definido"}
            </p>
          </div>
          {trader.verified && (
            <span className="rounded bg-emerald-900 px-3 py-1 text-sm text-emerald-300">
              ✓ Verificado
            </span>
          )}
        </div>

        <p className="mt-4 text-zinc-400">
          {trader.bio || "Este trader ainda não adicionou uma biografia."}
        </p>

        {trader.whatsapp && (
          <a
            href={`https://wa.me/${trader.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            className="mt-4 inline-block rounded-md bg-emerald-500 px-5 py-2 font-semibold text-black hover:bg-emerald-400"
          >
            Falar no WhatsApp
          </a>
        )}

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Conteúdo gratuito</h2>
          {freeContent.length > 0 ? (
            <div className="space-y-3">
              {freeContent.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {item.description}
                  </p>
                  {item.media_url && (
                    <a
                      href={item.media_url}
                      target="_blank"
                      className="mt-2 inline-block text-sm text-emerald-400 hover:underline"
                    >
                      Ver conteúdo →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              Ainda sem conteúdo gratuito publicado.
            </p>
          )}
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Conteúdo premium</h2>
          {hasAccess && visiblePremiumContent.length > 0 ? (
            <div className="space-y-3">
              {visiblePremiumContent.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-emerald-800 bg-zinc-900 p-4"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {item.description}
                  </p>
                  {item.media_url && (
                    <a
                      href={item.media_url}
                      target="_blank"
                      className="mt-2 inline-block text-sm text-emerald-400 hover:underline"
                    >
                      Ver conteúdo →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : premiumCount && premiumCount > 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p className="text-zinc-300">
                🔒 Este trader tem {premiumCount} conteúdo(s) premium
                bloqueado(s).
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Contacta o trader via WhatsApp para saberes como obter
                acesso.
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              Ainda sem conteúdo premium publicado.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default function TraderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black px-6 py-12 text-white">
          <p className="text-zinc-500">A carregar...</p>
        </div>
      }
    >
      <PerfilTraderWrapper params={params} />
    </Suspense>
  );
}

async function PerfilTraderWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PerfilTrader id={id} />;
                                         }
