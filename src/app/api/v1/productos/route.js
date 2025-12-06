import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";

// GET /api/v1/productos  -> lista productos (con filtro por categoría)
export async function GET(request) {
  const supabase = getSupabaseServerClient();

  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");

  let query = supabase.from("producto").select("*").order("id", { ascending: true });

  if (categoria) {
    query = query.eq("categoria", categoria.trim());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error Supabase /api/v1/productos:", error.message);
    return NextResponse.json({ message: "Error al obtener productos" }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

// POST /api/v1/productos  -> crea un producto nuevo
export async function POST(request) {
  const supabase = getSupabaseServerClient();
  const body = await request.json();

  const { nombre, precio, categoria, descripcion, imagen } = body;

  if (!nombre || !precio) {
    return NextResponse.json(
      { message: "Los campos 'nombre' y 'precio' son obligatorios" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("producto")
    .insert([{ nombre, precio, categoria, descripcion, imagen }])
    .select()
    .single();

  if (error) {
    console.error("Error al crear producto:", error.message);
    return NextResponse.json({ message: "Error al crear producto" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
