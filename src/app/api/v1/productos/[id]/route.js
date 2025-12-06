import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdminClient";

const TABLE_NAME = "producto";

// GET /api/v1/productos/123  -> detalle de un producto
export async function GET(_request, { params }) {
  const { id } = params;

  const { data, error } = await supabaseAdmin.from(TABLE_NAME).select("*").eq("id", id).single();

  if (error || !data) {
    console.error("Error Supabase GET /productos/:id:", error?.message);
    return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PUT /api/v1/productos/123  -> actualizar producto
export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();
    const { nombre, precio, categoria, descripcion, imagen, destacado } = body;

    const updateData = {
      ...(nombre !== undefined && { nombre }),
      ...(precio !== undefined && { precio: Number(precio) }),
      ...(categoria !== undefined && {
        categoria: categoria === null || categoria === "" ? null : Number(categoria),
      }),
      ...(descripcion !== undefined && { descripcion }),
      ...(imagen !== undefined && { imagen }),
      ...(destacado !== undefined && { destacado }),
    };

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error Supabase PUT /productos/:id:", error);
      return NextResponse.json(
        {
          message: "Error al actualizar producto",
          supabaseError: error.message,
          details: error.details,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error inesperado PUT /productos/:id:", err);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

// DELETE /api/v1/productos/123  -> borrar producto
export async function DELETE(_request, { params }) {
  const { id } = params;

  const { error } = await supabaseAdmin.from(TABLE_NAME).delete().eq("id", id);

  if (error) {
    console.error("Error Supabase DELETE /productos/:id:", error.message);
    return NextResponse.json(
      { message: "Error al eliminar producto", supabaseError: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Producto eliminado" }, { status: 200 });
}
