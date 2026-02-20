"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Credenciales inválidas");
      }

      // Si el login fue exitoso, el route handler ya setea la cookie
      router.push("/ventas");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-12 px-4">
      <Card className="w-full max-w-[420px] rounded-xl border shadow-sm">
        <CardContent className="p-10">
          <div className="flex justify-center mb-6">
            <div className="h-10 w-40 bg-muted rounded-md" />
          </div>

          <h1 className="text-3xl font-semibold text-center tracking-tight">
            Inicia Sesión
          </h1>

          <p className="text-sm text-muted-foreground text-center mt-2">
            Ingresa a tu cuenta para continuar
          </p>

          {/* 👇 FORM REAL */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="button"
              className="text-sm underline text-left text-foreground/80"
            >
              ¿Olvidaste tu contraseña?
            </button>

            <div className="flex items-center gap-2 pt-2">
              <Checkbox id="keep" />
              <Label htmlFor="keep" className="font-normal">
                Mantener sesión iniciada
              </Label>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full mt-2 bg-slate-900 text-white hover:bg-slate-800"
              size="lg"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Enviar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
