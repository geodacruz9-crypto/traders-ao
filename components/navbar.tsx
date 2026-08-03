import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="font-bold text-white">
          Traders<span className="text-emerald-400">AO</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/diretorio" className="text-zinc-300 hover:text-white">
            Diretório
          </Link>

          {role === "trader" && (
            <Link href="/painel" className="text-zinc-300 hover:text-white">
              Painel
            </Link>
          )}

          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-zinc-300 hover:text-white"
              >
                Entrar
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-md bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
      }
