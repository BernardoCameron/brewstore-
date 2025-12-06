import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdminClient";

const TABLE_NAME = "categoria";

// GET /api/v1/categorias/123
export async function GET(_request, { params }) {
  const { id } = params;

  const { data, error } = await supabaseAdmin.from(TABLE_NAME).select("*").eq("id", id).single();

  if (error || !data) {
    console.error("Error Supabase GET /categorias/:id:", error?.message);
    return NextResponse.json({ message: "Categoría no encontrada" }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PUT /api/v1/categorias/123
export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();
    const { nombre, descripcion } = body;

    const updateData = {
      ...(nombre !== undefined && { nombre }),
      ...(descripcion !== undefined && { descripcion }),
    };

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error Supabase PUT /categorias/:id:", error);
      return NextResponse.json(
        {
          message: "Error al actualizar categoría",
          supabaseError: error.message,
          details: error.details,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error inesperado PUT /categorias/:id:", err);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

// DELETE /api/v1/categorias/123
export async function DELETE(_request, { params }) {
  const { id } = params;

  const { error } = await supabaseAdmin.from(TABLE_NAME).delete().eq("id", id);

  if (error) {
    console.error("Error Supabase DELETE /categorias/:id:", error.message);
    return NextResponse.json(
      { message: "Error al eliminar categoría", supabaseError: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Categoría eliminada" }, { status: 200 });
}
