import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";

export async function GET() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("categoria")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error Supabase /api/v1/categorias:", error.message);
    return NextResponse.json({ message: "Error al obtener categorías" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
