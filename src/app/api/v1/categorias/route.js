import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdminClient";

const TABLE_NAME = "categoria";

// GET /api/v1/categorias
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error Supabase GET /categorias:", error);
    return NextResponse.json(
      {
        message: "Error al obtener categorías",
        supabaseError: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

// POST /api/v1/categorias  -> crear categoría
export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, descripcion } = body;

    if (!nombre) {
      return NextResponse.json({ message: "El campo 'nombre' es obligatorio" }, { status: 400 });
    }

    const insertData = {
      nombre,
      descripcion: descripcion ?? null,
    };

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error("Error Supabase POST /categorias:", error);
      return NextResponse.json(
        {
          message: "Error al crear categoría",
          supabaseError: error.message,
          details: error.details,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Error inesperado POST /categorias:", err);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
