import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseServer";

type IngestBody = {
  namespace: string;
  documents: Array<{ id?: string; title?: string; text: string; metadata?: Record<string, any> }>;
};

export async function POST(req: Request) {
  try {
    const { namespace, documents }: IngestBody = await req.json();
    if (!namespace || !Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json({ error: "namespace and documents are required" }, { status: 400 });
    }

    const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

    // Create embeddings for each document
    const inputs = documents.map((d) => d.text);
    const embedResp = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, input: inputs }),
    });
    const embedJson = await embedResp.json();
    const vectors: number[][] = embedJson.data.map((d: any) => d.embedding);

    // Upsert into a table `documents` and `document_embeddings` (requires SQL setup)
    // Minimal schema expectations:
    // - documents(id uuid default gen_random_uuid() primary key, namespace text, title text, text text, metadata jsonb)
    // - document_embeddings(document_id uuid references documents(id), embedding vector(1536))
    const upserts = [] as any[];
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const { data: docRow, error: docErr } = await supabaseServer
        .from("documents")
        .insert({
          id: doc.id,
          namespace,
          title: doc.title ?? null,
          text: doc.text,
          metadata: doc.metadata ?? {},
        })
        .select("id")
        .single();
      if (docErr) throw docErr;

      const { error: embErr } = await supabaseServer
        .from("document_embeddings")
        .upsert({ document_id: docRow.id, embedding: vectors[i] as unknown as any });
      if (embErr) throw embErr;
      upserts.push(docRow.id);
    }

    return NextResponse.json({ status: "ok", inserted: upserts.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Ingest endpoint is alive 🚀" });
}



























