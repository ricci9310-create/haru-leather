"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface Product {
  id: number;
  name: string;
  price: number;
  category: "tenis" | "botas";
  sizes: number[];
  colors: string[];
  gradient: string;
}

interface CartItem {
  product: Product;
  size: number;
  qty: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Tenis Classic Brown",
    price: 175000,
    category: "tenis",
    sizes: [37, 38, 39, 40, 41, 42, 43],
    colors: ["Cafe", "Miel"],
    gradient: "from-amber-900 via-yellow-900 to-amber-800",
  },
  {
    id: 2,
    name: "Tenis Urban Black",
    price: 175000,
    category: "tenis",
    sizes: [37, 38, 39, 40, 41, 42, 43],
    colors: ["Negro", "Gris Oscuro"],
    gradient: "from-gray-900 via-zinc-800 to-gray-900",
  },
  {
    id: 3,
    name: "Tenis Executive Tan",
    price: 195000,
    category: "tenis",
    sizes: [37, 38, 39, 40, 41, 42, 43],
    colors: ["Tan", "Caramelo"],
    gradient: "from-orange-900 via-amber-800 to-orange-900",
  },
  {
    id: 4,
    name: "Bota Chelsea Cafe",
    price: 239900,
    category: "botas",
    sizes: [37, 38, 39, 40, 41, 42, 43],
    colors: ["Cafe", "Chocolate"],
    gradient: "from-yellow-950 via-amber-900 to-yellow-950",
  },
  {
    id: 5,
    name: "Bota Urban Black",
    price: 259900,
    category: "botas",
    sizes: [37, 38, 39, 40, 41, 42, 43],
    colors: ["Negro"],
    gradient: "from-neutral-900 via-stone-800 to-neutral-900",
  },
  {
    id: 6,
    name: "Bota Premium Cognac",
    price: 279900,
    category: "botas",
    sizes: [37, 38, 39, 40, 41, 42, 43],
    colors: ["Cognac", "Brandy"],
    gradient: "from-red-950 via-orange-900 to-red-950",
  },
];

const testimonials = [
  {
    name: "Andres M.",
    city: "Bogota",
    text: "La calidad del cuero es impresionante. Llevo mis Classic Brown todos los dias y se ven cada vez mejor con el uso.",
    stars: 5,
  },
  {
    name: "Sebastian R.",
    city: "Medellin",
    text: "Compre las Botas Chelsea y superaron mis expectativas. El envio fue rapido y el empaque muy premium.",
    stars: 5,
  },
  {
    name: "Carlos G.",
    city: "Cali",
    text: "Excelente atencion al cliente y un producto de primera. Ya tengo dos pares y voy por el tercero.",
    stars: 5,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, number>>({});
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  /* Persist cart to localStorage */
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("haru-cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("haru-cart");
    }
  }, [cart]);

  /* Load cart from localStorage */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("haru-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Cart helpers */
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = useCallback(
    (product: Product) => {
      const size = selectedSizes[product.id] || product.sizes[3]; // default 41
      setCart((prev) => {
        const existing = prev.find(
          (i) => i.product.id === product.id && i.size === size
        );
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id && i.size === size
              ? { ...i, qty: i.qty + 1 }
              : i
          );
        }
        return [...prev, { product, size, qty: 1 }];
      });
      // Flash feedback
      setAddedIds((prev) => new Set(prev).add(product.id));
      setTimeout(() => {
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      }, 1200);
    },
    [selectedSizes]
  );

  const removeFromCart = (productId: number, size: number) => {
    setCart((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size))
    );
  };

  const whatsappNumber = "573044426006";

  return (
    <>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <WhatsAppButton />

      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient"
      >
        {/* Decorative circles */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-brand-accent/5 blur-3xl" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,165,116,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,165,116,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Overline */}
          <p className="text-brand-text-muted text-sm tracking-[0.4em] uppercase mb-6 animate-fade-in">
            Calzado Artesanal en Cuero
          </p>

          {/* Brand name */}
          <h1 className="font-display text-7xl sm:text-8xl md:text-9xl font-bold tracking-wider mb-4">
            <span className="text-gradient">HARU</span>
          </h1>

          {/* Tagline */}
          <p className="font-display text-xl sm:text-2xl md:text-3xl text-brand-text-muted italic mb-10 animate-slide-up">
            Cuero que cuenta tu historia
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <a
              href="#productos"
              className="px-8 py-3.5 bg-brand-primary hover:bg-brand-primary-light text-white rounded-sm tracking-wide uppercase text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/30 w-full sm:w-auto text-center"
            >
              Ver Coleccion
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "Hola HARU! Quiero conocer su coleccion de calzado en cuero."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border border-brand-accent/40 text-brand-accent hover:bg-brand-accent/10 rounded-sm tracking-wide uppercase text-sm font-medium transition-all duration-300 w-full sm:w-auto text-center"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <span className="text-brand-text-dim text-xs tracking-widest uppercase">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-brand-accent/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
            />
          </svg>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  ABOUT / BRAND                                               */}
      {/* ============================================================ */}
      <section
        id="nosotros"
        className="relative py-24 md:py-32 bg-brand-surface bg-leather-pattern"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="reveal text-center mb-16">
            <p className="text-brand-accent text-sm tracking-[0.3em] uppercase mb-3">
              Nuestra Esencia
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text mb-6">
              Tradicion Artesanal Colombiana
            </h2>
            <p className="text-brand-text-muted max-w-2xl mx-auto leading-relaxed">
              Cada par de HARU nace de las manos expertas de artesanos
              colombianos que han perfeccionado su oficio por generaciones.
              Seleccionamos los mejores cueros del pais para crear calzado que
              combina elegancia atemporal con comodidad excepcional.
            </p>
          </div>

          {/* Selling points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                ),
                title: "100% Cuero Genuino",
                desc: "Utilizamos solo cuero de la mas alta calidad, curtido naturalmente para garantizar durabilidad y un envejecimiento elegante.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                ),
                title: "Hecho en Colombia",
                desc: "Cada par es fabricado por artesanos colombianos, apoyando el talento local y la tradicion marroquinera del pais.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.079-.504 1.007-1.12l-1.09-9.305a1.125 1.125 0 0 0-1.116-.995H5.672a1.125 1.125 0 0 0-1.116.995L3.45 17.63c-.072.616.386 1.12 1.007 1.12H4.5m14.25 0H8.25" />
                  </svg>
                ),
                title: "Envio Nacional",
                desc: "Llevamos tu calzado HARU a cualquier rincon de Colombia. Empaque premium y seguimiento de envio incluido.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal text-center p-8 rounded-sm bg-brand-card/50 border border-brand-border/50 hover:border-brand-accent/30 transition-all duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-accent mb-5 group-hover:bg-brand-primary/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-brand-text mb-3">
                  {item.title}
                </h3>
                <p className="text-brand-text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRODUCTS                                                    */}
      {/* ============================================================ */}
      <section id="productos" className="relative py-24 md:py-32 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="reveal text-center mb-16">
            <p className="text-brand-accent text-sm tracking-[0.3em] uppercase mb-3">
              Coleccion
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text mb-4">
              Nuestros Productos
            </h2>
            <p className="text-brand-text-muted max-w-xl mx-auto">
              Encuentra el par perfecto que refleje tu estilo. Tallas
              disponibles desde la 37 a 43.
            </p>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="reveal group bg-brand-card border border-brand-border/50 rounded-sm overflow-hidden hover:border-brand-accent/30 transition-all duration-500 card-shine"
              >
                {/* Image placeholder */}
                <div
                  className={`relative h-64 bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden`}
                >
                  {/* Leather texture overlay */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  }} />
                  <div className="relative text-center">
                    <div className="w-20 h-20 mx-auto mb-3 border-2 border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      {product.category === "tenis" ? (
                        <svg className="w-10 h-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                        </svg>
                      ) : (
                        <svg className="w-10 h-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-white/40 text-xs tracking-[0.2em] uppercase">
                      {product.category === "tenis" ? "Tenis" : "Botas"}
                    </span>
                  </div>
                  {/* Category badge */}
                  <span className="absolute top-4 left-4 text-xs bg-black/40 backdrop-blur-sm text-white/70 px-3 py-1 rounded-sm uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-brand-text mb-1 group-hover:text-brand-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-brand-accent text-xl font-bold mb-3">
                    {formatCOP(product.price)}
                  </p>

                  {/* Colors */}
                  <p className="text-brand-text-muted text-xs mb-3">
                    Colores: {product.colors.join(", ")}
                  </p>

                  {/* Size selector */}
                  <div className="mb-4">
                    <p className="text-brand-text-muted text-xs mb-2">Talla:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            setSelectedSizes((prev) => ({
                              ...prev,
                              [product.id]: size,
                            }))
                          }
                          className={`w-9 h-9 text-xs rounded-sm border transition-all duration-200 ${
                            (selectedSizes[product.id] || 41) === size
                              ? "border-brand-accent bg-brand-accent/20 text-brand-accent"
                              : "border-brand-border text-brand-text-muted hover:border-brand-accent/50"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability note */}
                  <p className="text-brand-text-dim text-xs mb-3 italic">
                    * Si tu talla no esta disponible, la fabricamos en 8 dias habiles.
                  </p>

                  {/* Add to cart */}
                  <button
                    onClick={() => addToCart(product)}
                    className={`w-full py-3 rounded-sm text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                      addedIds.has(product.id)
                        ? "bg-green-600 text-white"
                        : "bg-brand-primary hover:bg-brand-primary-light text-white hover:shadow-lg hover:shadow-brand-primary/20"
                    }`}
                  >
                    {addedIds.has(product.id) ? "Agregado!" : "Agregar al Carrito"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                */}
      {/* ============================================================ */}
      <section className="relative py-24 md:py-32 bg-brand-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="reveal text-center mb-16">
            <p className="text-brand-accent text-sm tracking-[0.3em] uppercase mb-3">
              Proceso
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text">
              Como Funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: "Elige tu Estilo",
                desc: "Explora nuestra coleccion de tenis y botas en cuero genuino. Cada modelo esta disenado para combinar con tu estilo de vida.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Selecciona Talla",
                desc: "Elige tu talla (38-44) y agrega al carrito. Si tienes dudas, contactanos por WhatsApp para asesorarte.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Paga Seguro con BOLD",
                desc: "Realiza tu pago de forma segura a traves de BOLD. Aceptamos tarjetas de credito, debito y otros medios.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="reveal text-center relative">
                {/* Connector line (hidden on mobile, shown between items on desktop) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 -right-6 md:-right-8 w-12 md:w-16 h-px bg-gradient-to-r from-brand-accent/40 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-card border border-brand-border mb-6 relative">
                  <div className="text-brand-accent">{item.icon}</div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-brand-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-brand-text mb-3">
                  {item.title}
                </h3>
                <p className="text-brand-text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                                */}
      {/* ============================================================ */}
      <section className="relative py-24 md:py-32 bg-brand-bg bg-leather-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="reveal text-center mb-16">
            <p className="text-brand-accent text-sm tracking-[0.3em] uppercase mb-3">
              Testimonios
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text">
              Lo Que Dicen Nuestros Clientes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="reveal bg-brand-card/60 border border-brand-border/50 rounded-sm p-8 hover:border-brand-accent/20 transition-all duration-500"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <svg
                      key={s}
                      className="w-5 h-5 text-brand-gold"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-brand-text-muted text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-accent font-semibold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-brand-text text-sm font-medium">
                      {t.name}
                    </p>
                    <p className="text-brand-text-dim text-xs">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <footer id="contacto" className="relative bg-brand-surface border-t border-brand-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-display text-3xl font-bold text-gradient mb-4">
                HARU
              </h3>
              <p className="text-brand-text-muted text-sm leading-relaxed mb-4">
                Calzado artesanal en cuero genuino. Disenado y fabricado con
                orgullo en Colombia.
              </p>
              <p className="text-brand-text-dim text-xs italic">
                Hecho con amor en Colombia
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-brand-text font-semibold text-sm uppercase tracking-wider mb-4">
                Navegacion
              </h4>
              <div className="space-y-2">
                {["Inicio", "Productos", "Nosotros", "Contacto"].map((l) => (
                  <a
                    key={l}
                    href={`#${l.toLowerCase()}`}
                    className="block text-brand-text-muted text-sm hover:text-brand-accent transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-brand-text font-semibold text-sm uppercase tracking-wider mb-4">
                Siguenos
              </h4>
              <div className="space-y-3">
                <a
                  href="https://instagram.com/haru.leatherr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-brand-text-muted hover:text-brand-accent transition-colors text-sm group"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                  </svg>
                  @haru.leatherr
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-brand-text-muted hover:text-green-400 transition-colors text-sm group"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.79 23.768a.5.5 0 0 0 .61.61l4.734-1.494A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0Zm0 21.75c-2.31 0-4.46-.666-6.282-1.816l-.45-.273-2.813.887.887-2.813-.273-.45A9.72 9.72 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-brand-border/50 text-center">
            <p className="text-brand-text-dim text-xs">
              &copy; 2026 HARU Leather. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/*  CART SIDEBAR                                                */}
      {/* ============================================================ */}
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-brand-surface border-l border-brand-border z-[70] transform transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-brand-border">
            <h3 className="font-display text-xl font-semibold text-brand-text">
              Tu Carrito ({cartCount})
            </h3>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 text-brand-text-muted hover:text-brand-text transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-brand-border mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <p className="text-brand-text-muted text-sm">
                  Tu carrito esta vacio
                </p>
                <a
                  href="#productos"
                  onClick={() => setCartOpen(false)}
                  className="inline-block mt-4 text-brand-accent text-sm hover:underline"
                >
                  Ver productos
                </a>
              </div>
            ) : (
              cart.map((item, i) => (
                <div
                  key={`${item.product.id}-${item.size}-${i}`}
                  className="flex items-center gap-4 bg-brand-card/50 rounded-sm p-4 border border-brand-border/30"
                >
                  {/* Mini color block */}
                  <div
                    className={`w-16 h-16 rounded-sm bg-gradient-to-br ${item.product.gradient} flex-shrink-0 flex items-center justify-center`}
                  >
                    <span className="text-white/50 text-xs font-bold">
                      {item.product.category === "tenis" ? "T" : "B"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-brand-text text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-brand-text-muted text-xs">
                      Talla {item.size} &middot; x{item.qty}
                    </p>
                    <p className="text-brand-accent text-sm font-semibold">
                      {formatCOP(item.product.price * item.qty)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.size)}
                    className="text-brand-text-dim hover:text-red-400 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-brand-text-muted text-sm">Total:</span>
                <span className="text-brand-text text-xl font-bold">
                  {formatCOP(cartTotal)}
                </span>
              </div>
              {/* Checkout */}
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="block w-full py-3.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-center rounded-sm text-sm font-medium uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-[#0066FF]/30"
              >
                Finalizar Compra
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hola HARU! Quiero realizar un pedido:\n${cart
                    .map(
                      (i) =>
                        `- ${i.product.name} (Talla ${i.size}) x${i.qty} = ${formatCOP(
                          i.product.price * i.qty
                        )}`
                    )
                    .join("\n")}\n\nTotal: ${formatCOP(cartTotal)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 border border-green-500/40 text-green-400 hover:bg-green-500/10 text-center rounded-sm text-sm font-medium uppercase tracking-wider transition-all duration-300"
              >
                Pedir por WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
