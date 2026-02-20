"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // cierra al click afuera
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
     const res = await fetch("/api/auth/logout", { method: "POST" });

    if (!res.ok) {
      console.error("Error al cerrar sesión");
      return;
    }
      router.refresh();
      router.push("/login");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{ border: "none", background: "transparent", cursor: "pointer" }}
      >
        {/* Reemplazá esto por tu Avatar actual */}
        <Image
          src="/avatar.png"
          alt="Usuario"
          width={32}
          height={32}
          style={{ borderRadius: 999 }}
        />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 200,
            border: "1px solid #e5e7eb",
            background: "white",
            borderRadius: 12,
            padding: 8,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <button
            role="menuitem"
            type="button"
            onClick={logout}
            disabled={loading}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      )}
    </div>
  );
}