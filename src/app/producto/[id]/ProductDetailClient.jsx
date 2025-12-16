"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductDetailClient({ producto }) {
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);

  const { id, nombre, descripcion, precio, imagen } = producto;

  const formatCurrency = (value) =>
    value?.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }) ?? "$0";

  const dec = () => setCantidad((c) => Math.max(1, c - 1));
  const inc = () => setCantidad((c) => c + 1);

  const handleAdd = () => {
    addToCart(
      {
        id,
        nombre,
        imagen: imagen || "/ipa-dorada.png",
        precio: Number(precio) || 0,
        descripcion: descripcion || "",
      },
      cantidad
    );
  };

  return (
    <main className="py-16 px-4 md:px-8" style={{ backgroundColor: "var(--bg-principal)" }}>
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href="/productos"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--secundario-malta)" }}
          >
            ← Volver a productos
          </Link>
        </div>

        <div className="card-custom p-6 md:p-10" style={{ borderRadius: "18px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Imagen */}
            <div className="relative w-full h-80 md:h-[420px]">
              <Image
                src={imagen || "/ipa-dorada.png"}
                alt={nombre}
                fill
                className="rounded-lg object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold" style={{ color: "var(--secundario-malta)" }}>
                {nombre}
              </h1>

              <p className="text-base" style={{ color: "var(--texto-secundario)" }}>
                {descripcion}
              </p>

              <p className="text-2xl font-extrabold" style={{ color: "var(--acento-lupulo)" }}>
                {formatCurrency(precio)}
              </p>

              {/* Cantidad + botón */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={dec}
                    className="px-3 py-2 font-bold"
                    style={{ color: "var(--secundario-malta)" }}
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>

                  <span className="px-5 select-none">{cantidad}</span>

                  <button
                    onClick={inc}
                    className="px-3 py-2 font-bold"
                    style={{ color: "var(--secundario-malta)" }}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="btn-primary-custom text-sm px-6 py-3 rounded-full font-semibold"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
