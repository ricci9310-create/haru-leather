"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CartItem {
  product: { id: number; name: string; price: number; category: string };
  size: number;
  qty: number;
}

interface FormData {
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  notas: string;
}

const DEPARTAMENTOS = [
  "Amazonas", "Antioquia", "Arauca", "Atlantico", "Bogota D.C.", "Bolivar",
  "Boyaca", "Caldas", "Caqueta", "Casanare", "Cauca", "Cesar", "Choco",
  "Cordoba", "Cundinamarca", "Guainia", "Guaviare", "Huila", "La Guajira",
  "Magdalena", "Meta", "Narino", "Norte de Santander", "Putumayo", "Quindio",
  "Risaralda", "San Andres y Providencia", "Santander", "Sucre", "Tolima",
  "Valle del Cauca", "Vaupes", "Vichada",
];

const SHIPPING_COST = 12000;
const FREE_SHIPPING_MIN = 300000;
const WHATSAPP_NUMBER = "573044426006";

function formatCOP(value: number): string {
  return (
    "$ " +
    value.toLocaleString("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [form, setForm] = useState<FormData>({
    nombre: "",
    cedula: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    notas: "",
  });

  // Load cart from page state via localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("haru-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.nombre.trim()) newErrors.nombre = "Requerido";
    if (!form.cedula.trim()) newErrors.cedula = "Requerido";
    if (!form.email.trim() || !form.email.includes("@")) newErrors.email = "Email invalido";
    if (!form.telefono.trim()) newErrors.telefono = "Requerido";
    if (!form.direccion.trim()) newErrors.direccion = "Requerido";
    if (!form.ciudad.trim()) newErrors.ciudad = "Requerido";
    if (!form.departamento) newErrors.departamento = "Selecciona un departamento";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build WhatsApp order message
    const itemLines = cart
      .map(
        (i) =>
          `- ${i.product.name} (Talla ${i.size}) x${i.qty} = ${formatCOP(i.product.price * i.qty)}`
      )
      .join("\n");

    const message = `*Nuevo Pedido HARU Leather*\n\n` +
      `*Cliente:* ${form.nombre}\n` +
      `*Cedula:* ${form.cedula}\n` +
      `*Email:* ${form.email}\n` +
      `*Telefono:* ${form.telefono}\n` +
      `*Direccion:* ${form.direccion}, ${form.ciudad}, ${form.departamento}\n` +
      (form.notas ? `*Notas:* ${form.notas}\n` : "") +
      `\n*Productos:*\n${itemLines}\n\n` +
      `*Subtotal:* ${formatCOP(subtotal)}\n` +
      `*Envio:* ${shipping === 0 ? "GRATIS" : formatCOP(shipping)}\n` +
      `*TOTAL:* ${formatCOP(total)}`;

    // Open WhatsApp with order (BOLD integration placeholder)
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // Clear cart
    localStorage.removeItem("haru-cart");
    setSubmitted(true);
  };

  /* ---- SUBMITTED STATE ---- */
  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-600/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-brand-text mb-4">
            Pedido Enviado
          </h1>
          <p className="text-brand-text-muted mb-8">
            Tu pedido fue enviado por WhatsApp. Nuestro equipo te confirmara la
            disponibilidad y te enviara el link de pago BOLD en breve.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-white rounded-sm text-sm uppercase tracking-wider transition-colors"
            >
              Volver a la Tienda
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-green-600 text-green-500 hover:bg-green-600/10 rounded-sm text-sm uppercase tracking-wider transition-colors"
            >
              Contactar WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ---- EMPTY CART ---- */
  if (cart.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <div className="text-center">
          <svg className="w-20 h-20 mx-auto text-brand-border mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <h1 className="font-display text-2xl font-bold text-brand-text mb-3">
            Tu carrito esta vacio
          </h1>
          <p className="text-brand-text-muted mb-6">
            Agrega productos antes de continuar al checkout.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-brand-primary hover:bg-brand-primary-light text-white rounded-sm text-sm uppercase tracking-wider transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  /* ---- CHECKOUT FORM ---- */
  const inputClass = (field: keyof FormData) =>
    `w-full bg-brand-card border ${
      errors[field] ? "border-red-500" : "border-brand-border"
    } text-brand-text rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-dim`;

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top bar */}
      <header className="border-b border-brand-border bg-brand-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-bold tracking-wider text-brand-accent">
              HARU
            </span>
            <span className="text-xs text-brand-text-muted tracking-[0.3em] uppercase mt-1">
              Leather
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver a la tienda
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-text mb-2">
          Checkout
        </h1>
        <p className="text-brand-text-muted mb-10">
          Completa tus datos para finalizar el pedido
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* ---- LEFT: FORM ---- */}
            <div className="lg:col-span-3 space-y-6">
              <h2 className="text-brand-accent text-sm tracking-[0.2em] uppercase font-semibold">
                Datos del Cliente
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-text-muted text-xs mb-1.5">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => updateField("nombre", e.target.value)}
                    className={inputClass("nombre")}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-brand-text-muted text-xs mb-1.5">
                    Cedula / NIT *
                  </label>
                  <input
                    type="text"
                    value={form.cedula}
                    onChange={(e) => updateField("cedula", e.target.value)}
                    className={inputClass("cedula")}
                    placeholder="1234567890"
                  />
                  {errors.cedula && <p className="text-red-400 text-xs mt-1">{errors.cedula}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-text-muted text-xs mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={inputClass("email")}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-brand-text-muted text-xs mb-1.5">
                    Telefono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => updateField("telefono", e.target.value)}
                    className={inputClass("telefono")}
                    placeholder="300 123 4567"
                  />
                  {errors.telefono && <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>}
                </div>
              </div>

              <h2 className="text-brand-accent text-sm tracking-[0.2em] uppercase font-semibold pt-4">
                Direccion de Envio
              </h2>

              <div>
                <label className="block text-brand-text-muted text-xs mb-1.5">
                  Direccion *
                </label>
                <input
                  type="text"
                  value={form.direccion}
                  onChange={(e) => updateField("direccion", e.target.value)}
                  className={inputClass("direccion")}
                  placeholder="Calle 123 #45-67, Apto 101"
                />
                {errors.direccion && <p className="text-red-400 text-xs mt-1">{errors.direccion}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-text-muted text-xs mb-1.5">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={form.ciudad}
                    onChange={(e) => updateField("ciudad", e.target.value)}
                    className={inputClass("ciudad")}
                    placeholder="Bogota"
                  />
                  {errors.ciudad && <p className="text-red-400 text-xs mt-1">{errors.ciudad}</p>}
                </div>
                <div>
                  <label className="block text-brand-text-muted text-xs mb-1.5">
                    Departamento *
                  </label>
                  <select
                    value={form.departamento}
                    onChange={(e) => updateField("departamento", e.target.value)}
                    className={inputClass("departamento")}
                  >
                    <option value="">Seleccionar...</option>
                    {DEPARTAMENTOS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {errors.departamento && <p className="text-red-400 text-xs mt-1">{errors.departamento}</p>}
                </div>
              </div>

              <div>
                <label className="block text-brand-text-muted text-xs mb-1.5">
                  Notas adicionales
                </label>
                <textarea
                  value={form.notas}
                  onChange={(e) => updateField("notas", e.target.value)}
                  className={`${inputClass("notas")} resize-none`}
                  rows={3}
                  placeholder="Instrucciones especiales de entrega..."
                />
              </div>
            </div>

            {/* ---- RIGHT: ORDER SUMMARY ---- */}
            <div className="lg:col-span-2">
              <div className="bg-brand-surface border border-brand-border rounded-sm p-6 lg:sticky lg:top-24">
                <h2 className="text-brand-accent text-sm tracking-[0.2em] uppercase font-semibold mb-6">
                  Resumen del Pedido
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-brand-text text-sm font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="text-brand-text-dim text-xs">
                          Talla {item.size} &middot; Cant: {item.qty}
                        </p>
                      </div>
                      <p className="text-brand-text text-sm font-medium whitespace-nowrap">
                        {formatCOP(item.product.price * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-muted">Subtotal</span>
                    <span className="text-brand-text">{formatCOP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-muted">Envio</span>
                    <span className={shipping === 0 ? "text-green-500 font-medium" : "text-brand-text"}>
                      {shipping === 0 ? "GRATIS" : formatCOP(shipping)}
                    </span>
                  </div>
                  {subtotal > 0 && subtotal < FREE_SHIPPING_MIN && (
                    <p className="text-brand-text-dim text-xs">
                      Envio gratis en compras desde {formatCOP(FREE_SHIPPING_MIN)}
                    </p>
                  )}
                </div>

                <div className="border-t border-brand-border mt-4 pt-4">
                  <div className="flex justify-between">
                    <span className="text-brand-text font-semibold">Total</span>
                    <span className="text-brand-accent text-xl font-bold">
                      {formatCOP(total)}
                    </span>
                  </div>
                </div>

                {/* Pay button */}
                <button
                  type="submit"
                  className="w-full mt-6 py-4 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-sm text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-[#0066FF]/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                  Pagar con BOLD
                </button>

                <p className="text-brand-text-dim text-xs text-center mt-3">
                  Seras redirigido a WhatsApp para confirmar tu pedido y recibir el link de pago seguro.
                </p>

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-brand-border/50">
                  <div className="flex items-center gap-1.5 text-brand-text-dim text-xs">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    Pago seguro
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-text-dim text-xs">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Datos protegidos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
