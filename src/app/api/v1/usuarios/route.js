import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdminClient";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";

// GET /api/v1/usuarios
// Devuelve: [{ id, email, username, admin }, ...]
export async function GET() {
  try {
    // Traemos usuarios desde auth (email + username en user_metadata)
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError) {
      console.error("Error listando usuarios:", usersError.message);
      return NextResponse.json({ message: "Error al obtener usuarios" }, { status: 500 });
    }

    // Traemos roles desde la tabla perfiles
    const supabase = getSupabaseServerClient();
    const { data: perfilesData, error: perfilesError } = await supabase
      .from("perfiles")
      .select("user_id, admin");

    if (perfilesError) {
      console.error("Error obteniendo perfiles:", perfilesError.message);
      return NextResponse.json({ message: "Error al obtener perfiles" }, { status: 500 });
    }

    const perfilesMap = new Map((perfilesData || []).map((p) => [p.user_id, p.admin]));

    const usuarios = (usersData?.users || []).map((u) => ({
      id: u.id,
      email: u.email,
      // viene desde raw_user_meta_data / user_metadata.username
      username: u.user_metadata?.username ?? null,
      admin: !!perfilesMap.get(u.id),
    }));

    return NextResponse.json(usuarios, { status: 200 });
  } catch (err) {
    console.error("Error inesperado en /api/v1/usuarios:", err);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
