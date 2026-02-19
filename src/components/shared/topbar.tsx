"use client";

import { Bell, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function Topbar({ breadcrumb }: { breadcrumb: string }) {
  return (
    <header className="h-14 bg-white border-b">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{breadcrumb}</div>

        <div className="flex items-center gap-4">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <Sun className="h-5 w-5 text-muted-foreground" />
          <Separator orientation="vertical" className="h-6" />
          <Avatar className="h-8 w-8">
            <AvatarFallback>RI</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
