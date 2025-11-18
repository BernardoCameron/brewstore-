"use client";

import Image from "next/image";

export default function NosotrosPage() {
  return (
    <main className="py-20 px-6" style={{ backgroundColor: "var(--bg-crema)" }}>
      <div className="container mx-auto max-w-6xl">
        {/* Título */}
        <h2
          className="text-center text-xl font-semibold mb-14"
          style={{ color: "var(--texto-principal)" }}
        >
          Nuestra Historia
        </h2>

        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div className="leading-relaxed text-[var(--texto-principal)]">
            <p className="mb-6">
              Desde 2015, Brewstore ha sido sinónimo de calidad y tradición en el mundo de la
              cerveza artesanal.
            </p>

            <p className="mb-6">
              Comenzamos como un pequeño proyecto familiar con la pasión de crear cervezas únicas y
              memorables. Hoy, somos reconocidos por nuestra dedicación a la excelencia y nuestro
              compromiso con ingredientes de la más alta calidad.
            </p>

            <p className="mb-10">
              Cada botella que producimos lleva consigo años de experiencia, innovación constante y
              el amor por el arte de la cervecería. Nuestro equipo de maestros cerveceros trabaja
              incansablemente para ofrecerte sabores únicos que despierten tus sentidos.
            </p>

            {/* Beneficios */}
            <div className="grid grid-cols-2 gap-8 text-left">
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--acento-lupulo)" }}>
                  100%
                </p>
                <span className="text-[var(--texto-principal)]">Ingredientes Naturales</span>
              </div>

              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--acento-lupulo)" }}>
                  Artesanal
                </p>
                <span className="text-[var(--texto-principal)]">Proceso Tradicional</span>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="flex justify-center">
            <Image
              src="/img-historia.jpg"
              alt="Maestro Cervecero"
              width={600}
              height={400}
              className="rounded-lg shadow-md object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
