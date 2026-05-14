"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function CategoryDialog({ isOpen, onClose, title, children }: CategoryDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </Card>
    </div>
  );
}
