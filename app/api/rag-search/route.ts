import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabaseServer";

type SearchBody = {
  query: string;
  namespace?: string;
  topK?: number;
};

export async function POST(req: Request) {
  try {
    const { query, namespace, topK = 5 }: SearchBody = await req.json();
    if (!query) return NextResponse.json({ error: "query is required" }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is missing");
    const embedModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

    // Embed query
    const e = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: embedModel, input: query }),
    });
    const ej = await e.json();
    const qvec: number[] = ej.data?.[0]?.embedding;
    if (!qvec) throw new Error("No embedding returned for query");

    // Perform similarity search via RPC or pgvector operator (requires SQL setup)
    // Example expects a Postgres function: match_documents(namespace text, query_embedding vector, match_count int)
    const { data, error } = await getSupabaseServer().rpc("match_documents", {
      p_namespace: namespace ?? null,
      p_query_embedding: qvec as unknown as any,
      p_match_count: topK,
    });
    if (error) throw error;

    return NextResponse.json({ matches: data ?? [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "RAG search is alive 🚀" });
}



























