"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Tags,
  Tag,
  Package,
  Users,
  BarChart3,
  BadgePercent,
  Award,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/ventas", label: "Ventas", icon: ShoppingCart },
  { href: "/categorias", label: "Categorias", icon: Tags },
  { href: "/marcas", label: "Marcas", icon: Tag },
  { href: "/productos", label: "Productos", icon: Package },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/estadisticas", label: "Estadisticas", icon: BarChart3 },
  { href: "/descuentos", label: "Descuentos", icon: BadgePercent },
  { href: "/puntos", label: "Puntos de Lealtad", icon: Award },
  { href: "/membresias", label: "Membresías", icon: CreditCard },
  { href: "/notificaciones", label: "Notificaciones", icon: Bell },
  { href: "/configuracion", label: "Configuración", icon: Settings },
  { href: "/ayuda", label: "Ayuda", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-65 shrink-0 bg-white">
      <div className="h-14 flex items-center px-6 font-semibold text-base">
        Ecommerce
      </div>

      <nav className="px-3 py-2 space-y-1">
        {nav.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
  "flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium text-slate-600 transition-colors",
  "hover:bg-slate-100 hover:text-slate-900",
  active && "bg-slate-100 text-slate-900"
)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}