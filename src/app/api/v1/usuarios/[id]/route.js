import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdminClient";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";

// PUT /api/v1/usuarios/:id  -> cambiar rol (admin true/false)
export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();
    const { admin } = body;

    if (typeof admin !== "boolean") {
      return NextResponse.json({ message: "El campo 'admin' debe ser boolean" }, { status: 400 });
    }

    // solo actualizamos la tabla perfiles, usando service role
    const { data, error } = await supabaseAdmin
      .from("perfiles")
      .update({ admin })
      .eq("user_id", id)
      .select("user_id, admin")
      .single(); // debe existir EXACTAMENTE una fila por user_id

    if (error) {
      console.error("Error actualizando rol:", error.message);
      return NextResponse.json({ message: "Error al actualizar rol" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error inesperado en PUT /usuarios/:id:", err);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

// DELETE /api/v1/usuarios/:id  -> borra usuario (auth + perfil)
export async function DELETE(_request, { params }) {
  const { id } = params;

  try {
    const supabase = getSupabaseServerClient();

    // Borrar perfil si existe
    const { error: perfilesError } = await supabase.from("perfiles").delete().eq("user_id", id);

    if (perfilesError) {
      console.error("Error borrando perfil:", perfilesError.message);
    }

    // Borrar usuario en auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (deleteError) {
      console.error("Error borrando usuario auth:", deleteError.message);
      return NextResponse.json({ message: "Error al eliminar usuario" }, { status: 500 });
    }

    return NextResponse.json({ message: "Usuario eliminado correctamente" }, { status: 200 });
  } catch (err) {
    console.error("Error inesperado en DELETE /usuarios/:id:", err);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
