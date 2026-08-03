"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

const contentTypes = [
  { value: "video", label: "Vídeo" },
  { value: "ebook", label: "E-book" },
  { value: "update", label: "Atualização" },
];

export function PainelForm({ traderId }: { traderId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("video");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("content").insert({
        trader_id: traderId,
        title,
        description,
        content_type: contentType,
        media_url: mediaUrl,
        is_premium: isPremium,
      });
      if (error) throw error;

      setTitle("");
      setDescription("");
      setMediaUrl("");
      setIsPremium(false);
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
      <h2 className="mb-4 text-lg font-semibold">Publicar novo conteúdo</h2>
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Introdução à análise técnica"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descrição</Label>
          <textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Do que trata este conteúdo?"
            rows={3}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content-type">Tipo</Label>
          <select
            id="content-type"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          >
            {contentTypes.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="media-url">Link (YouTube, Vimeo, e-book...)</Label>
          <Input
            id="media-url"
            type="url"
            required
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4"
          />
          Conteúdo premium (só clientes com acesso liberado veem)
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "A publicar..." : "Publicar conteúdo"}
        </Button>
      </div>
    </form>
  );
}
