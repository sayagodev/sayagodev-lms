"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, useRef, useState } from "react";

interface CollapsibleTextProps {
  preview: ReactNode;
  fullContent: ReactNode;
  defaultOpen?: boolean;
  previewClassName?: string;
  contentClassName?: string;
  triggerClassName?: string;
}

export function CollapsibleText({
  preview,
  fullContent,
  defaultOpen = false,
  previewClassName,
  contentClassName,
  triggerClassName,
}: CollapsibleTextProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [wasOpen, setWasOpen] = useState(defaultOpen);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (open: boolean) => {
    // Si se está cerrando (de true a false), hacer scroll
    if (wasOpen && !open && previewRef.current) {
      // Pequeño delay para que la animación de colapso comience
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
    setWasOpen(open);
    setIsOpen(open);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
      {!isOpen ? (
        <div ref={previewRef} className={previewClassName}>
          {preview}
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={cn(
                "text-primary underline ml-1 text-sm font-medium hover:text-primary/80 transition-colors inline-flex items-center gap-1",
                triggerClassName
              )}
            >
              <span>ver más</span>
              <ChevronDown className="size-3 transition-transform" />
            </button>
          </CollapsibleTrigger>
        </div>
      ) : (
        <>
          <div ref={previewRef} className={previewClassName}>
            {preview}
          </div>
          <CollapsibleContent className={cn("mt-2", contentClassName)}>
            {fullContent}
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={cn(
                "text-primary underline mt-2 text-sm font-medium hover:text-primary/80 transition-colors inline-flex items-center gap-1",
                triggerClassName
              )}
            >
              <span>ver menos</span>
              <ChevronDown className="size-3 transition-transform rotate-180" />
            </button>
          </CollapsibleTrigger>
        </>
      )}
    </Collapsible>
  );
}
