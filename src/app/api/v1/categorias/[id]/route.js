import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";

// GET /api/v1/categorias/123  -> detalle de una categoría
export async function GET(_request, { params }) {
  const supabase = getSupabaseServerClient();
  const { id } = params;

  const { data, error } = await supabase.from("categoria").select("*").eq("id", id).single();

  if (error || !data) {
    console.error("Error al obtener categoría:", error?.message);
    return NextResponse.json({ message: "Categoría no encontrada" }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PUT /api/v1/categorias/123  -> actualizar categoría
export async function PUT(request, { params }) {
  const supabase = getSupabaseServerClient();
  const { id } = params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("categoria")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar categoría:", error.message);
    return NextResponse.json({ message: "Error al actualizar categoría" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// DELETE /api/v1/categorias/123  -> eliminar categoría
export async function DELETE(_request, { params }) {
  const supabase = getSupabaseServerClient();
  const { id } = params;

  const { error } = await supabase.from("categoria").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar categoría:", error.message);
    return NextResponse.json({ message: "Error al eliminar categoría" }, { status: 500 });
  }

  return NextResponse.json({ message: "Categoría eliminada" }, { status: 200 });
}
