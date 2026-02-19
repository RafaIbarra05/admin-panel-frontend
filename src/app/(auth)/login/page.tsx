import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-start justify-center pt-12 px-4">
      <Card className="w-full max-w-[520px] rounded-xl border shadow-sm">
        <CardContent className="p-10">
          <div className="flex justify-center mb-6">
            {/* Placeholder de logo (después lo reemplazás por imagen) */}
            <div className="h-10 w-40 bg-muted rounded-md" />
          </div>

          <h1 className="text-4xl font-semibold text-center">Inicia Sesión</h1>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Ingresa a tu cuenta para continuar
          </p>

          <div className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <Input placeholder="ejemplo@mail.com" />
            </div>

            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input type="password" placeholder="Contraseña" />
            </div>

            <button className="text-sm underline text-left text-foreground/80">
              ¿Olvidaste tu contraseña?
            </button>

            <div className="flex items-center gap-2 pt-2">
              <Checkbox id="keep" />
              <Label htmlFor="keep" className="font-normal">
                Mantener sesión iniciada
              </Label>
            </div>

            <Button
              className="w-full mt-2 bg-muted text-foreground hover:bg-muted/80"
              size="lg"
            >
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
