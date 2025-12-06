import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdminClient";

const TABLE_NAME = "producto";

// GET /api/v1/productos  -> lista productos (con filtro por categoría)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");

  let query = supabaseAdmin.from(TABLE_NAME).select("*").order("id", { ascending: true });

  if (categoria) {
    query = query.eq("categoria", Number(categoria));
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error Supabase GET /productos:", error);
    return NextResponse.json(
      {
        message: "Error al obtener productos",
        supabaseError: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 200 });
}

// POST /api/v1/productos  -> crea un producto nuevo
export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, precio, categoria, descripcion, imagen } = body;

    if (!nombre || precio === undefined || precio === null) {
      return NextResponse.json(
        { message: "Los campos 'nombre' y 'precio' son obligatorios" },
        { status: 400 }
      );
    }

    const insertData = {
      nombre,
      precio: Number(precio),
      categoria: categoria === null || categoria === "" ? null : Number(categoria),
      descripcion: descripcion ?? null,
      imagen: imagen ?? null,
      // si tu columna destacado tiene default en la BD, no hace falta enviarla
    };

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error("Error Supabase POST /productos:", error);
      return NextResponse.json(
        {
          message: "Error al crear producto",
          supabaseError: error.message,
          details: error.details,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Error inesperado POST /productos:", err);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
