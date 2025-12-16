"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductCard({ producto, cantidad = 1, onCantidadChange, onAddToCart }) {
  const router = useRouter();

  const { id, nombre, descripcion, precio, imagen } = producto;

  const goToDetail = () => router.push(`/producto/${id}`);

  // Evita navegar al detalle cuando se clickea en botones
  const stop = (e) => e.stopPropagation();

  const formatCurrency = (value) =>
    value?.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }) ?? "$0";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goToDetail()}
      className="card-custom flex flex-col p-4 text-center cursor-pointer"
    >
      {/* Imagen (alto fijo para que todas queden iguales) */}
      <div className="relative w-full h-56 mb-4">
        <Image
          src={imagen || "/ipa-dorada.png"}
          alt={nombre}
          fill
          className="rounded-lg object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Texto */}
      <div className="flex-1 flex flex-col">
        <h3 className="card-title text-lg mb-2">{nombre}</h3>

        {/* Descripción: limita líneas para no romper el layout */}
        <p className="card-text text-sm mb-3 line-clamp-3">{descripcion}</p>

        <span className="price block font-semibold mt-auto">{formatCurrency(precio)}</span>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-center gap-2 mt-4" onClick={stop}>
        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={() => onCantidadChange(id, -1)}
            className="px-2 font-bold"
            style={{ color: "var(--secundario-malta)" }}
            aria-label="Disminuir cantidad"
          >
            −
          </button>

          <span className="px-3 select-none">{cantidad}</span>

          <button
            onClick={() => onCantidadChange(id, 1)}
            className="px-2 font-bold"
            style={{ color: "var(--secundario-malta)" }}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          onClick={() =>
            onAddToCart(
              {
                id,
                nombre,
                imagen: imagen || "/ipa-dorada.png",
                precio: Number(precio) || 0,
                descripcion: descripcion || "",
              },
              cantidad
            )
          }
          className="btn-primary-custom text-sm px-4 py-2 rounded-full font-semibold"
          title="Añadir al carrito"
        >
          Añadir
        </button>
      </div>
    </div>
  );
}
