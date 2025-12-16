"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  // cantidades manejadas por id
  const [cantidades, setCantidades] = useState({});

  // paginador
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;

  // obtener productos desde el endpoint
  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (categoriaSeleccionada) {
          params.set("categoria", categoriaSeleccionada.trim());
        }

        const queryString = params.toString();
        const url = queryString ? `/api/v1/productos?${queryString}` : `/api/v1/productos`;

        const res = await fetch(url);

        if (!res.ok) {
          console.error("Error HTTP al obtener productos:", res.statusText);
          setProductos([]);
          setCantidades({});
          setLoading(false);
          setPaginaActual(1);
          return;
        }

        const json = await res.json();
        const data = json.data || [];

        setProductos(data);

        // inicializamos las cantidades en 1 (igual que antes)
        const inicial = {};
        data.forEach((p) => {
          inicial[p.id] = 1;
        });
        setCantidades(inicial);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductos([]);
        setCantidades({});
      } finally {
        setLoading(false);
        setPaginaActual(1);
      }
    }

    fetchProductos();
  }, [categoriaSeleccionada]);

  // obtener categorías
  // obtener categorías desde el endpoint
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch("/api/v1/categorias");
        if (!res.ok) {
          throw new Error("Error HTTP al obtener categorías");
        }

        const data = await res.json();
        setCategorias(data || []);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategorias([]);
      }
    }

    fetchCategorias();
  }, []);

  // paginación
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPaginados = productos.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  function cambiarPagina(pagina) {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // actualizar cantidad por id
  const cambiarCantidad = (id, valor) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + valor),
    }));
  };

  return (
    <main className="py-16 px-4 md:px-8" style={{ backgroundColor: "var(--bg-principal)" }}>
      <div className="container mx-auto max-w-6xl">
        <h2 className="section-title text-center mb-2" style={{ color: "var(--secundario-malta)" }}>
          Nuestros Productos
        </h2>

        {/* Filtro de categorías */}
        <div className="flex justify-center mb-8">
          <select
            id="categoriaFiltro"
            value={categoriaSeleccionada}
            onChange={(e) => {
              setCategoriaSeleccionada(e.target.value);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="border rounded-md px-3 py-2"
            style={{
              backgroundColor: "white",
              borderColor: "rgba(0,0,0,0.1)",
              color: "var(--texto-principal)",
              minWidth: "220px",
            }}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Cards de productos */}
        {loading ? (
          <p className="text-center" style={{ color: "var(--texto-secundario)" }}>
            Cargando productos...
          </p>
        ) : productosPaginados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosPaginados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                cantidad={cantidades[producto.id] || 1}
                onCantidadChange={cambiarCantidad}
                onAddToCart={(item, qty) => addToCart(item, qty)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center" style={{ color: "var(--texto-secundario)" }}>
            No hay productos disponibles en esta categoría.
          </p>
        )}

        {/* Paginador */}
        {totalPaginas > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-3 py-1 border rounded disabled:opacity-40"
              style={{
                borderColor: "var(--secundario-malta)",
                color: "var(--secundario-malta)",
              }}
            >
              ←
            </button>

            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                onClick={() => cambiarPagina(i + 1)}
                className={`px-3 py-1 border rounded ${
                  paginaActual === i + 1 ? "bg-[var(--primario-amber)]" : ""
                }`}
                style={{
                  borderColor: "var(--secundario-malta)",
                  color: "var(--secundario-malta)",
                  fontWeight: paginaActual === i + 1 ? "bold" : "normal",
                }}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1 border rounded disabled:opacity-40"
              style={{
                borderColor: "var(--secundario-malta)",
                color: "var(--secundario-malta)",
              }}
            >
              →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
