import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PainelForm } from "@/components/painel-form";

async function PainelContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "trader") {
    return (
      <div className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold">Área exclusiva de traders</h1>
          <p className="mt-4 text-zinc-400">
            Esta página é só para contas de trader. Se és cliente, explora o{" "}
            <Link href="/diretorio" className="text-emerald-400 underline">
              diretório de traders
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  const { data: content } = await supabase
    .from("content")
    .select("*")
    .eq("trader_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">O teu painel</h1>
          <Link
            href={`/trader/${user.id}`}
            className="text-sm text-emerald-400 hover:underline"
          >
            Ver o meu perfil público →
          </Link>
        </div>

        <PainelForm traderId={user.id} />

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">O teu conteúdo</h2>
          {content && content.length > 0 ? (
            <div className="space-y-3">
              {content.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-zinc-500">
                      {item.content_type} ·{" "}
                      {item.is_premium ? "Premium" : "Gratuito"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              Ainda não publicaste nenhum conteúdo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PainelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black px-6 py-12 text-white">
          <p className="text-zinc-500">A carregar...</p>
        </div>
      }
    >
      <PainelContent />
    </Suspense>
  );
    }
