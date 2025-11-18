"use client";

import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactoPage() {
  return (
    <main className="py-20 px-6" style={{ backgroundColor: "var(--bg-crema)" }}>
      <div className="container mx-auto max-w-6xl">
        {/* Título */}
        <h2
          className="text-center text-xl font-semibold mb-14"
          style={{ color: "var(--texto-principal)" }}
        >
          Contáctanos
        </h2>

        {/* AREA 1: TARJETAS DE CONTACTO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Ubicación */}
          <div className="card-custom p-8 text-center">
            <MapPin size={40} className="mx-auto mb-4" color="var(--primario-amber)" />
            <p className="font-medium text-[var(--texto-principal)]">Calle Cervecera 123</p>
            <p className="text-[var(--texto-secundario)]">Ciudad Artesanal, CA 12345</p>
          </div>

          {/* Teléfono */}
          <div className="card-custom p-8 text-center">
            <Phone size={40} className="mx-auto mb-4" color="var(--primario-amber)" />
            <p className="font-medium text-[var(--texto-principal)]">+56 9 1234 5678</p>
            <p className="text-[var(--texto-secundario)]">Lun – Vie: 9AM – 6PM</p>
          </div>

          {/* Email */}
          <div className="card-custom p-8 text-center">
            <Mail size={40} className="mx-auto mb-4" color="var(--primario-amber)" />
            <p className="font-medium text-[var(--texto-principal)]">info@brewstore.com</p>
            <p className="text-[var(--texto-secundario)]">ventas@brewstore.com</p>
          </div>
        </div>

        {/* AREA 2: FORMULARIO */}
        <div className="max-w-4xl mx-auto">
          <div className="card-custom p-10 shadow-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Mensaje enviado con éxito 🍻");
              }}
            >
              {/* Nombre + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="font-semibold">Nombre</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primario-amber)]"
                  />
                </div>

                <div>
                  <label className="font-semibold">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primario-amber)]"
                  />
                </div>
              </div>

              {/* Asunto */}
              <div className="mb-8">
                <label className="font-semibold">Asunto</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primario-amber)]"
                />
              </div>

              {/* Mensaje */}
              <div className="mb-10">
                <label className="font-semibold">Mensaje</label>
                <textarea
                  rows="5"
                  required
                  className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primario-amber)]"
                ></textarea>
              </div>

              {/* Botón */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[var(--primario-amber)] hover:bg-yellow-500 text-white font-semibold px-10 py-3 rounded-full flex items-center justify-center gap-2 mx-auto"
                >
                  <Send size={18} /> Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
