import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdminClient";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

// POST /api/v1/imagenes
// Body: multipart/form-data con campo "file"
// Respuesta: { url, path }
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object") {
      return NextResponse.json({ message: "No se recibió archivo" }, { status: 400 });
    }

    // nombre único para el archivo
    const ext = file.name?.split(".").pop() || "jpg";
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = `productos/${fileName}`; // carpeta opcional dentro del bucket

    // subir al bucket "productos"
    const { data, error } = await supabaseAdmin.storage.from("productos").upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      console.error("Error subiendo imagen:", error.message);
      return NextResponse.json({ message: "Error al subir la imagen" }, { status: 500 });
    }

    // obtener URL pública
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("productos").getPublicUrl(data.path);

    return NextResponse.json(
      {
        url: publicUrl,
        path: data.path,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error inesperado en /api/v1/imagenes:", err);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
