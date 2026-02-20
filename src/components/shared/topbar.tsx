"use client";

import { Bell, Sun, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar({ breadcrumb }: { breadcrumb: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (!res.ok) {
        console.error("No se pudo cerrar sesión");
        return;
      }

      // Re-ejecuta middleware y refresca estado
      router.refresh();
      // Te manda al login
      router.push("/login");
    } catch (error) {
      console.error("Error de red al cerrar sesión", error);
    }
  };

  return (
    <header className="h-14 bg-white border-b">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{breadcrumb}</div>

        <div className="flex items-center gap-4">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <Sun className="h-5 w-5 text-muted-foreground" />
          <Separator orientation="vertical" className="h-6" />

          {/* Avatar + Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="rounded-full focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>RI</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}