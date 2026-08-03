"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

const categories = [
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Criptomoedas" },
  { value: "acoes", label: "Ações Internacionais" },
  { value: "bodiva", label: "BODIVA" },
  { value: "commodities", label: "Commodities" },
];

type Profile = {
  bio: string | null;
  market_category: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  banner_url: string | null;
};

export function ProfileEditForm({
  userId,
  profile,
}: {
  userId: string;
  profile: Profile;
}) {
  const [bio, setBio] = useState(profile.bio || "");
  const [marketCategory, setMarketCategory] = useState(
    profile.market_category || "forex",
  );
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [bannerUrl, setBannerUrl] = useState(profile.banner_url || "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSaved(false);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          bio,
          market_category: marketCategory,
          whatsapp,
          avatar_url: avatarUrl || null,
          banner_url: bannerUrl || null,
        })
        .eq("id", userId);
      if (error) throw error;
      setSaved(true);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-800 bg-zinc-900 p-6"
    >
      <h2 className="mb-4 text-lg font-semibold">O teu perfil público</h2>
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="market-category">Mercado principal</Label>
          <select
            id="market-category"
            value={marketCategory}
            onChange={(e) => setMarketCategory(e.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fala um pouco sobre a tua experiência..."
            rows={3}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="whatsapp">WhatsApp (com código do país)</Label>
          <Input
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Ex: 244923000000"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="avatar-url">Link da foto de perfil</Label>
          <Input
            id="avatar-url"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="banner-url">Link da imagem de capa</Label>
          <Input
            id="banner-url"
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {saved && (
          <p className="text-sm text-emerald-400">Perfil atualizado.</p>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "A guardar..." : "Guardar perfil"}
        </Button>
      </div>
    </form>
  );
  }
