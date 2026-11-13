import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdminClient";

// Evita que Next guarde la respuesta en caché
export const dynamic = "force-dynamic";

// GET /api/ping -> consulta mínima para que Supabase no pause el proyecto
export async function GET(request) {
  // Vercel Cron manda este header cuando existe CRON_SECRET
  const secreto = process.env.CRON_SECRET;
  if (secreto && request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("producto")
    .select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, fecha: new Date().toISOString() });
}
