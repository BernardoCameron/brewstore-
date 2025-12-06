import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";

// GET /api/v1/productos/123  -> detalle de un producto
export async function GET(_request, { params }) {
  const supabase = getSupabaseServerClient();
  const { id } = params;

  const { data, error } = await supabase.from("producto").select("*").eq("id", id).single();

  if (error || !data) {
    console.error("Error al obtener producto:", error?.message);
    return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PUT /api/v1/productos/123  -> actualizar producto
export async function PUT(request, { params }) {
  const supabase = getSupabaseServerClient();
  const { id } = params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("producto")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar producto:", error.message);
    return NextResponse.json({ message: "Error al actualizar producto" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// DELETE /api/v1/productos/123  -> borrar producto
export async function DELETE(_request, { params }) {
  const supabase = getSupabaseServerClient();
  const { id } = params;

  const { error } = await supabase.from("producto").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar producto:", error.message);
    return NextResponse.json({ message: "Error al eliminar producto" }, { status: 500 });
  }

  return NextResponse.json({ message: "Producto eliminado" }, { status: 200 });
}
