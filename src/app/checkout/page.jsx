"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

function formatCLP(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  });
}

function isValidEmail(email) {
  // Suficiente para checkout (no excesivamente estricto)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function cleanRut(rut) {
  return String(rut || "")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .trim()
    .toUpperCase();
}

// Validador RUT Chile (incluye K)
function isValidRut(rutInput) {
  const rut = cleanRut(rutInput);
  if (rut.length < 2) return false;

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);

  if (!/^\d+$/.test(cuerpo)) return false;
  if (!/^[0-9K]$/.test(dv)) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = suma % 11;
  const dvEsperado = 11 - resto;

  let dvCalc = "";
  if (dvEsperado === 11) dvCalc = "0";
  else if (dvEsperado === 10) dvCalc = "K";
  else dvCalc = String(dvEsperado);

  return dvCalc === dv;
}

export default function CheckoutPage() {
  const { cart } = useCart();

  const subtotal = useMemo(() => {
    return cart.reduce((acc, p) => acc + (Number(p.precio) || 0) * (Number(p.cantidad) || 1), 0);
  }, [cart]);

  // Si quieres agregar envío después:
  const envio = 0;
  const total = subtotal + envio;

  const [docType, setDocType] = useState("boleta"); // boleta | factura
  const [payMethod, setPayMethod] = useState("webpay"); // webpay | transferencia | tarjeta

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    comuna: "",
    ciudad: "",
    rutEmpresa: "",
    razonSocial: "",
    giro: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const onChange = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const validate = () => {
    const e = {};

    if (!cart?.length) e.cart = "Tu carrito está vacío.";
    if (!form.nombre.trim()) e.nombre = "Nombre es requerido.";
    if (!form.apellido.trim()) e.apellido = "Apellido es requerido.";
    if (!isValidEmail(form.email)) e.email = "Email inválido.";
    if (String(form.telefono).replace(/\D/g, "").length < 8) e.telefono = "Teléfono inválido.";
    if (!form.direccion.trim()) e.direccion = "Dirección es requerida.";
    if (!form.comuna.trim()) e.comuna = "Comuna es requerida.";
    if (!form.ciudad.trim()) e.ciudad = "Ciudad es requerida.";

    if (docType === "factura") {
      if (!form.razonSocial.trim()) e.razonSocial = "Razón social es requerida para factura.";
      if (!isValidRut(form.rutEmpresa)) e.rutEmpresa = "RUT de empresa inválido.";
      if (!form.giro.trim()) e.giro = "Giro es requerido para factura.";
    }

    if (!payMethod) e.payMethod = "Selecciona un método de pago.";

    return e;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setSubmitted(false);

    const e = validate();
    setErrors(e);

    if (Object.keys(e).length === 0) {
      setSubmitted(true);

      console.log("Checkout OK:", {
        docType,
        payMethod,
        form,
        cart,
        total,
      });
    }
  };

  return (
    <main className="py-16 px-4 md:px-8" style={{ backgroundColor: "var(--bg-principal)" }}>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/productos"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--secundario-malta)" }}
          >
            ← Seguir comprando
          </Link>
        </div>

        <h2 className="section-title text-center mb-8" style={{ color: "var(--secundario-malta)" }}>
          Checkout
        </h2>

        {errors.cart && (
          <p className="text-center mb-6" style={{ color: "crimson" }}>
            {errors.cart}
          </p>
        )}

        {submitted && (
          <div
            className="p-4 mb-6 rounded-md text-center"
            style={{ backgroundColor: "rgba(0,128,0,0.08)", color: "green" }}
          >
            Orden validada correctamente (demo). Falta integrar pago/orden real.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumen */}
          <section className="card-custom p-6" style={{ borderRadius: "18px" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--secundario-malta)" }}>
              Resumen del carrito
            </h3>

            {cart?.length ? (
              <div className="flex flex-col gap-4">
                {cart.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold" style={{ color: "var(--texto-principal)" }}>
                        {p.nombre}
                      </p>
                      <p className="text-sm" style={{ color: "var(--texto-secundario)" }}>
                        Cantidad: {p.cantidad} · Unitario: {formatCLP(p.precio)}
                      </p>
                    </div>
                    <p
                      className="font-bold whitespace-nowrap"
                      style={{ color: "var(--acento-lupulo)" }}
                    >
                      {formatCLP((Number(p.precio) || 0) * (Number(p.cantidad) || 1))}
                    </p>
                  </div>
                ))}

                <hr className="my-2 opacity-30" />

                <div className="flex justify-between">
                  <span style={{ color: "var(--texto-secundario)" }}>Subtotal</span>
                  <span className="font-semibold">{formatCLP(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "var(--texto-secundario)" }}>Envío</span>
                  <span className="font-semibold">{formatCLP(envio)}</span>
                </div>

                <div className="flex justify-between text-lg">
                  <span className="font-bold" style={{ color: "var(--secundario-malta)" }}>
                    Total
                  </span>
                  <span className="font-extrabold" style={{ color: "var(--acento-lupulo)" }}>
                    {formatCLP(total)}
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--texto-secundario)" }}>No hay productos en el carrito.</p>
            )}
          </section>

          {/* Formulario */}
          <section className="card-custom p-6" style={{ borderRadius: "18px" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--secundario-malta)" }}>
              Datos de contacto y pago
            </h3>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              {/* Documento */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="docType"
                    value="boleta"
                    checked={docType === "boleta"}
                    onChange={() => setDocType("boleta")}
                  />
                  Boleta
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="docType"
                    value="factura"
                    checked={docType === "factura"}
                    onChange={() => setDocType("factura")}
                  />
                  Factura
                </label>
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input
                    value={form.nombre}
                    onChange={onChange("nombre")}
                    placeholder="Nombre"
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  {errors.nombre && <p style={{ color: "crimson" }}>{errors.nombre}</p>}
                </div>

                <div>
                  <input
                    value={form.apellido}
                    onChange={onChange("apellido")}
                    placeholder="Apellido"
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  {errors.apellido && <p style={{ color: "crimson" }}>{errors.apellido}</p>}
                </div>

                <div>
                  <input
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="Email"
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  {errors.email && <p style={{ color: "crimson" }}>{errors.email}</p>}
                </div>

                <div>
                  <input
                    value={form.telefono}
                    onChange={onChange("telefono")}
                    placeholder="Teléfono"
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  {errors.telefono && <p style={{ color: "crimson" }}>{errors.telefono}</p>}
                </div>
              </div>

              {/* Direccion */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <input
                    value={form.direccion}
                    onChange={onChange("direccion")}
                    placeholder="Dirección"
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  {errors.direccion && <p style={{ color: "crimson" }}>{errors.direccion}</p>}
                </div>

                <div>
                  <input
                    value={form.comuna}
                    onChange={onChange("comuna")}
                    placeholder="Comuna"
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  {errors.comuna && <p style={{ color: "crimson" }}>{errors.comuna}</p>}
                </div>

                <div>
                  <input
                    value={form.ciudad}
                    onChange={onChange("ciudad")}
                    placeholder="Ciudad"
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  {errors.ciudad && <p style={{ color: "crimson" }}>{errors.ciudad}</p>}
                </div>
              </div>

              {/* Factura fields */}
              {docType === "factura" && (
                <div className="border rounded-md p-4" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                  <p className="font-semibold mb-3" style={{ color: "var(--texto-principal)" }}>
                    Datos para factura
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <input
                        value={form.razonSocial}
                        onChange={onChange("razonSocial")}
                        placeholder="Razón social"
                        className="border rounded-md px-3 py-2 w-full"
                      />
                      {errors.razonSocial && (
                        <p style={{ color: "crimson" }}>{errors.razonSocial}</p>
                      )}
                    </div>

                    <div>
                      <input
                        value={form.rutEmpresa}
                        onChange={onChange("rutEmpresa")}
                        placeholder="RUT empresa (ej: 76123456-7)"
                        className="border rounded-md px-3 py-2 w-full"
                      />
                      {errors.rutEmpresa && <p style={{ color: "crimson" }}>{errors.rutEmpresa}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <input
                        value={form.giro}
                        onChange={onChange("giro")}
                        placeholder="Giro"
                        className="border rounded-md px-3 py-2 w-full"
                      />
                      {errors.giro && <p style={{ color: "crimson" }}>{errors.giro}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Metodo de pago */}
              <div className="mt-2">
                <p className="font-semibold mb-2" style={{ color: "var(--texto-principal)" }}>
                  Método de pago
                </p>

                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payMethod"
                      value="webpay"
                      checked={payMethod === "webpay"}
                      onChange={() => setPayMethod("webpay")}
                    />
                    Webpay (demo)
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payMethod"
                      value="transferencia"
                      checked={payMethod === "transferencia"}
                      onChange={() => setPayMethod("transferencia")}
                    />
                    Transferencia (demo)
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payMethod"
                      value="tarjeta"
                      checked={payMethod === "tarjeta"}
                      onChange={() => setPayMethod("tarjeta")}
                    />
                    Tarjeta (demo)
                  </label>
                </div>

                {errors.payMethod && <p style={{ color: "crimson" }}>{errors.payMethod}</p>}
              </div>

              <button
                type="submit"
                className="btn-primary-custom text-sm px-6 py-3 rounded-full font-semibold mt-4"
                disabled={!cart?.length}
                title={!cart?.length ? "Agrega productos al carrito para continuar" : "Continuar"}
              >
                Confirmar pedido (demo)
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
