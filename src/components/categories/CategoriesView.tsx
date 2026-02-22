"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoriesTable } from "./CategoriesTable";
import { CreateCategoryDialog } from "./CreateCategoryDialog";

export function CategoriesView() {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  function handleCreated() {
    setRefreshKey((k) => k + 1);
    setOpen(false);
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva categoría
        </Button>
      </div>

      <CategoriesTable
  refreshKey={refreshKey}
  onDeleted={() => setRefreshKey((k) => k + 1)}
/>

      <CreateCategoryDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={handleCreated}
      />
    </div>
  );
}