"use client";

export default function WhatsAppButton() {
  const phoneNumber = "573000000000";
  const message = encodeURIComponent(
    "Hola HARU Leather! Me interesa conocer mas sobre su calzado en cuero."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
      <span className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse-slow" />

      {/* Button */}
      <div className="relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 group-hover:scale-110">
        <svg
          viewBox="0 0 32 32"
          fill="white"
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.004 3.2C8.94 3.2 3.206 8.934 3.206 15.998c0 2.26.588 4.464 1.706 6.404L3.2 28.8l6.6-1.73a12.77 12.77 0 0 0 6.204 1.6c7.064 0 12.796-5.734 12.796-12.8S23.068 3.2 16.004 3.2Zm0 23.198a10.37 10.37 0 0 1-5.576-1.618l-.4-.238-4.144 1.088 1.106-4.04-.26-.416A10.35 10.35 0 0 1 5.608 16c0-5.738 4.67-10.398 10.396-10.398 5.726 0 10.396 4.66 10.396 10.396 0 5.738-4.67 10.4-10.396 10.4Zm5.7-7.784c-.312-.156-1.85-.912-2.138-1.016-.286-.106-.496-.156-.704.156-.21.312-.81 1.016-.994 1.228-.182.21-.366.234-.678.078-.312-.156-1.318-.486-2.512-1.548-.928-.826-1.554-1.848-1.736-2.16-.182-.312-.02-.48.136-.636.142-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.704-1.696-.964-2.32-.254-.61-.512-.526-.704-.536l-.6-.01c-.208 0-.546.078-.832.39-.286.312-1.092 1.066-1.092 2.6s1.118 3.016 1.274 3.226c.156.208 2.2 3.358 5.33 4.71.744.322 1.326.514 1.778.658.748.238 1.428.204 1.966.124.6-.09 1.85-.756 2.112-1.486.26-.73.26-1.356.182-1.486-.078-.13-.286-.208-.598-.364Z" />
        </svg>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Escríbenos por WhatsApp
        <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-brand-border" />
      </div>
    </a>
  );
}
