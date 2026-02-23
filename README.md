# Panel Administrativo -- Ecommerce (Frontend)

## 📌 Descripción General

Este proyecto es un panel administrativo reutilizable para ecommerce,
desarrollado con Next.js (App Router).

Permite la gestión (CRUD) de:

- Productos
- Categorías
- Ventas

El objetivo principal es demostrar una arquitectura limpia,
reutilización de componentes y una estructura escalable en el frontend.

---

## 🚀 Tecnologías Utilizadas

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- Lucide Icons

---

## 📂 Estructura del Proyecto

    src/

app/ → Rutas del proyecto (App Router)
(auth)/ → Rutas públicas (login)
(dashboard)/ → Rutas protegidas (productos, categorías, ventas)

components/
ui/ → Primitivas del sistema de diseño (Button, Input, Card, Dialog, Select...)
common/ → Componentes reutilizables de la aplicación (TableToolbar, PaginationControls, TableStateRows...)
products/ → Componentes específicos de la feature Productos
categories/ → Componentes específicos de la feature Categorías
sales/ → Componentes específicos de la feature Ventas
shared/ → Componentes de layout global (Sidebar, Topbar)
layout/ → Componentes relacionados al layout estructural (UserMenu, etc.)

lib/
api/ → Capa de comunicación con el backend (fetchers tipados)
hooks/ → Hooks reutilizables (usePaginatedResource, useMutation, useMe...)
format.ts → Helpers de formato (fechas, moneda)
jwt.ts → Helpers de autenticación
utils.ts → Utilidades generales

Flujo arquitectónico:

    app (ruta)

↓
feature components (products / categories / sales)
↓
common / ui (componentes reutilizables y primitivas)
↓
hooks (estado y lógica)
↓
api (comunicación con backend)

---

## ⚙️ Instalación

```bash
npm install
```

---

## 🧪 Desarrollo

```bash
npm run dev
```

La aplicación se ejecuta en:

    http://localhost:3000

---

## 🔐 Variables de Entorno

Crear un archivo `.env.local` si es necesario:

    NEXT_PUBLIC_API_URL=http://localhost:3001

Ajustar según la configuración del backend.

---

## 🧠 Decisiones Arquitectónicas

- Separación clara entre primitivas visuales (`ui/`) y componentes
  reutilizables de la aplicación (`common/`).
- Organización por features (`products/`, `categories/`, `sales/`).
- Capa centralizada para comunicación con el backend (`lib/api`).
- Hook reutilizable para listados paginados (`usePaginatedResource`).
- Sistema de tablas consistente usando componentes compartidos.

---

## 📈 Posibles Mejoras

- Componente global reutilizable `PageHeader`.
- Wrapper genérico `DataTableCard` para evitar repetición visual.
- Implementación de testing (unit/integration).
- Integración de Error Boundaries.
- Documentación visual con Storybook.

---

## 👨‍💻 Autor

Rafael Ibarra\
Desarrollador Fullstack (Enfoque Backend)
