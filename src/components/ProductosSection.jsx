"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductosSection() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      const { data, error } = await supabase
        .from("producto")
        .select("*")
        .eq("destacado", true)
        .order("id", { ascending: true })
        .limit(8);

      if (error) console.error("Error al obtener productos:", error);
      else {
        setProductos(data || []);
        const inicial = {};
        data?.forEach((p) => (inicial[p.id] = 1));
        setCantidades(inicial);
      }
      setLoading(false);
    }
    fetchProductos();
  }, []);

  const cambiarCantidad = (id, valor) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + valor),
    }));
  };

  if (loading)
    return (
      <section id="productos" className="section-padding">
        <div className="container mx-auto text-center py-10">
          <p className="text-[var(--texto-secundario)]">Cargando productos...</p>
        </div>
      </section>
    );

  return (
    <section id="productos" className="section-padding">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Nuestros Packs de Cerveza Artesanal</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
          {productos.map((prod) => (
            <ProductCard
              key={prod.id}
              producto={prod}
              cantidad={cantidades[prod.id] || 1}
              onCantidadChange={cambiarCantidad}
              onAddToCart={addToCart}
            />
          ))}

          {productos.length === 0 && (
            <p className="col-span-full text-center text-[var(--texto-secundario)]">
              No hay productos destacados disponibles.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
