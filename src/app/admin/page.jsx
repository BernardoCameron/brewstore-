"use client";

import { useEffect, useState } from "react";

const EMPTY_PRODUCTO = {
  nombre: "",
  precio: "",
  categoria: "",
  descripcion: "",
  imagen: "",
};

const EMPTY_CATEGORIA = {
  nombre: "",
  descripcion: "",
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("productos");

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [loadingProductos, setLoadingProductos] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  const [productoForm, setProductoForm] = useState(EMPTY_PRODUCTO);
  const [editingProductoId, setEditingProductoId] = useState(null);

  const [categoriaForm, setCategoriaForm] = useState(EMPTY_CATEGORIA);
  const [editingCategoriaId, setEditingCategoriaId] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [uploadingImagen, setUploadingImagen] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchUsuarios();
  }, []);

  // --------- PRODUCTOS ---------

  async function fetchProductos() {
    setLoadingProductos(true);
    try {
      const res = await fetch("/api/v1/productos");
      if (!res.ok) throw new Error("Error HTTP al obtener productos");
      const json = await res.json();
      setProductos(json.data || []);
    } catch (error) {
      console.error(error);
      setProductos([]);
      setMensaje("Error al cargar productos.");
    } finally {
      setLoadingProductos(false);
    }
  }

  function handleProductoChange(e) {
    const { name, value } = e.target;
    setProductoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleImagenFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImagen(true);
    setMensaje("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/imagenes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error HTTP al subir imagen");
      }

      const data = await res.json();

      // guardamos la URL en el formulario de producto
      setProductoForm((prev) => ({
        ...prev,
        imagen: data.url,
      }));

      setMensaje("Imagen subida correctamente.");
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error al subir la imagen.");
    } finally {
      setUploadingImagen(false);
    }
  }

  function startNuevoProducto() {
    setProductoForm(EMPTY_PRODUCTO);
    setEditingProductoId(null);
    setMensaje("");
  }

  function startEditarProducto(prod) {
    setProductoForm({
      nombre: prod.nombre || "",
      precio: prod.precio?.toString() || "",
      categoria: prod.categoria?.toString() || "",
      descripcion: prod.descripcion || "",
      imagen: prod.imagen || "",
    });
    setEditingProductoId(prod.id);
    setMensaje("");
  }

  async function handleProductoSubmit(e) {
    e.preventDefault();
    setMensaje("");

    const payload = {
      ...productoForm,
      precio: Number(productoForm.precio) || 0,
      categoria: productoForm.categoria === "" ? null : productoForm.categoria,
    };

    try {
      let res;

      if (editingProductoId) {
        res = await fetch(`/api/v1/productos/${editingProductoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/v1/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Error al guardar producto:", result);
        setMensaje(
          result?.message || result?.supabaseError || "Ocurrió un error al guardar el producto."
        );
        return;
      }

      setMensaje(
        editingProductoId ? "Producto actualizado correctamente." : "Producto creado correctamente."
      );
      setProductoForm(EMPTY_PRODUCTO);
      setEditingProductoId(null);
      await fetchProductos();
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error al guardar el producto (excepción).");
    }
  }

  async function handleEliminarProducto(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/v1/productos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      setMensaje("Producto eliminado correctamente.");
      await fetchProductos();
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error al eliminar el producto.");
    }
  }

  // --------- CATEGORÍAS ---------

  async function fetchCategorias() {
    setLoadingCategorias(true);
    try {
      const res = await fetch("/api/v1/categorias");
      if (!res.ok) throw new Error("Error HTTP al obtener categorías");
      const data = await res.json();
      setCategorias(data || []);
    } catch (error) {
      console.error(error);
      setCategorias([]);
      setMensaje("Error al cargar categorías.");
    } finally {
      setLoadingCategorias(false);
    }
  }

  function handleCategoriaChange(e) {
    const { name, value } = e.target;
    setCategoriaForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function startNuevaCategoria() {
    setCategoriaForm(EMPTY_CATEGORIA);
    setEditingCategoriaId(null);
    setMensaje("");
  }

  function startEditarCategoria(cat) {
    setCategoriaForm({
      nombre: cat.nombre || "",
      descripcion: cat.descripcion || "",
    });
    setEditingCategoriaId(cat.id);
    setMensaje("");
  }

  async function handleCategoriaSubmit(e) {
    e.preventDefault();
    setMensaje("");

    const payload = { ...categoriaForm };

    try {
      let res;

      if (editingCategoriaId) {
        res = await fetch(`/api/v1/categorias/${editingCategoriaId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/v1/categorias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Error al guardar categoría:", result);
        setMensaje(
          result?.message || result?.supabaseError || "Ocurrió un error al guardar la categoría."
        );
        return;
      }

      setMensaje(
        editingCategoriaId
          ? "Categoría actualizada correctamente."
          : "Categoría creada correctamente."
      );
      setCategoriaForm(EMPTY_CATEGORIA);
      setEditingCategoriaId(null);
      await fetchCategorias();
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error al guardar la categoría (excepción).");
    }
  }

  async function handleEliminarCategoria(id) {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;

    try {
      const res = await fetch(`/api/v1/categorias/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar categoría");
      setMensaje("Categoría eliminada correctamente.");
      await fetchCategorias();
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error al eliminar la categoría.");
    }
  }

  // --------- USUARIOS ---------

  async function fetchUsuarios() {
    setLoadingUsuarios(true);
    try {
      const res = await fetch("/api/v1/usuarios");
      if (!res.ok) throw new Error("Error HTTP al obtener usuarios");
      const data = await res.json();
      setUsuarios(data || []);
    } catch (error) {
      console.error(error);
      setUsuarios([]);
      setMensaje("Error al cargar usuarios.");
    } finally {
      setLoadingUsuarios(false);
    }
  }

  async function handleCambiarRol(usuario) {
    const nuevoAdmin = !usuario.admin;

    try {
      const res = await fetch(`/api/v1/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin: nuevoAdmin }),
      });

      if (!res.ok) {
        throw new Error("Error al cambiar rol");
      }

      setMensaje("Rol actualizado correctamente.");

      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuario.id ? { ...u, admin: nuevoAdmin } : u))
      );
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error al cambiar el rol del usuario.");
    }
  }

  async function handleEliminarUsuario(usuario) {
    if (!window.confirm(`¿Seguro que deseas eliminar al usuario ${usuario.email}?`)) return;

    try {
      const res = await fetch(`/api/v1/usuarios/${usuario.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar usuario");
      }

      setMensaje("Usuario eliminado correctamente.");
      setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error al eliminar el usuario.");
    }
  }

  // --------- RENDER ---------

  return (
    <section
      className="py-10 px-4"
      style={{ backgroundColor: "var(--bg-principal)", color: "var(--texto-principal)" }}
    >
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-10">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--secundario-malta)" }}>
          Panel de administración
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b mb-4">
          <button
            onClick={() => setActiveTab("productos")}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "productos"
                ? "border-[var(--primario-amber)] text-[var(--secundario-malta)]"
                : "border-transparent text-[var(--texto-secundario)]"
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab("categorias")}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "categorias"
                ? "border-[var(--primario-amber)] text-[var(--secundario-malta)]"
                : "border-transparent text-[var(--texto-secundario)]"
            }`}
          >
            Categorías
          </button>
          <button
            onClick={() => setActiveTab("usuarios")}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "usuarios"
                ? "border-[var(--primario-amber)] text-[var(--secundario-malta)]"
                : "border-transparent text-[var(--texto-secundario)]"
            }`}
          >
            Usuarios
          </button>
        </div>

        {mensaje && (
          <div className="mb-4 text-sm font-medium" style={{ color: "var(--acento-lupulo)" }}>
            {mensaje}
          </div>
        )}

        {/* --- TAB PRODUCTOS --- */}
        {activeTab === "productos" && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Gestión de productos</h2>
              <button
                onClick={startNuevoProducto}
                className="px-3 py-1 text-sm rounded-md"
                style={{
                  backgroundColor: "var(--primario-amber)",
                  color: "var(--secundario-malta)",
                }}
              >
                + Nuevo producto
              </button>
            </div>

            <form onSubmit={handleProductoSubmit} className="grid gap-3 mb-6 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={productoForm.nombre}
                  onChange={handleProductoChange}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={productoForm.precio}
                  onChange={handleProductoChange}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Categoría (ID)</label>
                <input
                  type="number"
                  name="categoria"
                  value={productoForm.categoria}
                  onChange={handleProductoChange}
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="Ej: 1, 2, 3..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Imagen del producto</label>

                {/* subir archivo */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenFileChange}
                  className="text-sm"
                />
                {uploadingImagen && (
                  <span className="text-xs text-[var(--texto-secundario)]">Subiendo imagen...</span>
                )}

                {/* URL resultante */}
                <input
                  type="text"
                  name="imagen"
                  value={productoForm.imagen}
                  onChange={handleProductoChange}
                  className="border rounded px-2 py-1 text-sm mt-1"
                  placeholder="URL de la imagen subida"
                />

                {/* preview opcional */}
                {productoForm.imagen && (
                  <img
                    src={productoForm.imagen}
                    alt="Preview producto"
                    className="mt-2 h-20 w-auto object-cover border rounded"
                  />
                )}
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  name="descripcion"
                  value={productoForm.descripcion}
                  onChange={handleProductoChange}
                  className="border rounded px-2 py-1 text-sm"
                  rows={2}
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: "var(--secundario-malta)",
                    color: "var(--blanco-puro)",
                  }}
                >
                  {editingProductoId ? "Guardar cambios" : "Agregar producto"}
                </button>
              </div>
            </form>

            {loadingProductos ? (
              <p>Cargando productos...</p>
            ) : productos.length === 0 ? (
              <p className="text-sm text-[var(--texto-secundario)]">
                No hay productos registrados.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="text-left" style={{ backgroundColor: "var(--bg-principal)" }}>
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Nombre</th>
                      <th className="p-2 border">Precio</th>
                      <th className="p-2 border">Categoría</th>
                      <th className="p-2 border">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((prod) => (
                      <tr key={prod.id} className="border-t">
                        <td className="p-2 border">{prod.id}</td>
                        <td className="p-2 border">{prod.nombre}</td>
                        <td className="p-2 border">${prod.precio}</td>
                        <td className="p-2 border">{prod.categoria}</td>
                        <td className="p-2 border">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEditarProducto(prod)}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: "var(--primario-amber)",
                                color: "var(--secundario-malta)",
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEliminarProducto(prod.id)}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: "var(--error)",
                                color: "var(--blanco-puro)",
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* --- TAB CATEGORÍAS --- */}
        {activeTab === "categorias" && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Gestión de categorías</h2>
              <button
                onClick={startNuevaCategoria}
                className="px-3 py-1 text-sm rounded-md"
                style={{
                  backgroundColor: "var(--primario-amber)",
                  color: "var(--secundario-malta)",
                }}
              >
                + Nueva categoría
              </button>
            </div>

            <form onSubmit={handleCategoriaSubmit} className="grid gap-3 mb-6 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={categoriaForm.nombre}
                  onChange={handleCategoriaChange}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  name="descripcion"
                  value={categoriaForm.descripcion}
                  onChange={handleCategoriaChange}
                  className="border rounded px-2 py-1 text-sm"
                  rows={2}
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: "var(--secundario-malta)",
                    color: "var(--blanco-puro)",
                  }}
                >
                  {editingCategoriaId ? "Guardar cambios" : "Agregar categoría"}
                </button>
              </div>
            </form>

            {loadingCategorias ? (
              <p>Cargando categorías...</p>
            ) : categorias.length === 0 ? (
              <p className="text-sm text-[var(--texto-secundario)]">
                No hay categorías registradas.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="text-left" style={{ backgroundColor: "var(--bg-principal)" }}>
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Nombre</th>
                      <th className="p-2 border">Descripción</th>
                      <th className="p-2 border">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((cat) => (
                      <tr key={cat.id} className="border-t">
                        <td className="p-2 border">{cat.id}</td>
                        <td className="p-2 border">{cat.nombre}</td>
                        <td className="p-2 border">{cat.descripcion}</td>
                        <td className="p-2 border">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEditarCategoria(cat)}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: "var(--primario-amber)",
                                color: "var(--secundario-malta)",
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEliminarCategoria(cat.id)}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: "var(--error)",
                                color: "var(--blanco-puro)",
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* --- TAB USUARIOS --- */}
        {activeTab === "usuarios" && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Gestión de usuarios</h2>
            </div>

            {loadingUsuarios ? (
              <p>Cargando usuarios...</p>
            ) : usuarios.length === 0 ? (
              <p className="text-sm text-[var(--texto-secundario)]">No hay usuarios registrados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="text-left" style={{ backgroundColor: "var(--bg-principal)" }}>
                      <th className="p-2 border">Nombre</th>
                      <th className="p-2 border">Correo</th>
                      <th className="p-2 border">Rol</th>
                      <th className="p-2 border">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="p-2 border">{u.username || "-"}</td>
                        <td className="p-2 border">{u.email}</td>
                        <td className="p-2 border">{u.admin ? "Admin" : "Cliente"}</td>
                        <td className="p-2 border">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleCambiarRol(u)}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: "var(--primario-amber)",
                                color: "var(--secundario-malta)",
                              }}
                            >
                              {u.admin ? "Hacer cliente" : "Hacer admin"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEliminarUsuario(u)}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: "var(--error)",
                                color: "var(--blanco-puro)",
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
