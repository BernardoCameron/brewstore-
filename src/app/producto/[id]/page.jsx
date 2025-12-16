import { headers } from "next/headers";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductoDetallePage({ params }) {
  const { id } = params;

  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/v1/productos/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="py-16 px-4 md:px-8" style={{ backgroundColor: "var(--bg-principal)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="section-title" style={{ color: "var(--secundario-malta)" }}>
            Producto no encontrado
          </h2>
          <p style={{ color: "var(--texto-secundario)" }}>
            No pudimos cargar el producto solicitado.
          </p>
        </div>
      </main>
    );
  }

  const producto = await res.json();

  if (!producto) {
    return (
      <main className="py-16 px-4 md:px-8" style={{ backgroundColor: "var(--bg-principal)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="section-title" style={{ color: "var(--secundario-malta)" }}>
            Producto no encontrado
          </h2>
        </div>
      </main>
    );
  }

  return <ProductDetailClient producto={producto} />;
}
