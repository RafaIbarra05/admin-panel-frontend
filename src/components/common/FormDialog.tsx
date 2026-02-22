"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function FormDialog({
  open,
  onOpenChange,
  title,
  children,
  canSubmit,
  loading,
  submitText = "Guardar",
  submittingText = "Guardando...",
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: React.ReactNode;
  canSubmit: boolean;
  loading: boolean;
  submitText?: string;
  submittingText?: string;
  onSubmit: () => void | Promise<void>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {children}

          <Button className="w-full" onClick={onSubmit} disabled={!canSubmit || loading}>
            {loading ? submittingText : submitText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}