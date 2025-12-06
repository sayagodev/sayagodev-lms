import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground ",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Arrastra tus archivos aquí o{" "}
        <span className="text-primary font-bold cursor-pointer">
          haz clic para subirlos
        </span>
      </p>
      <Button className="mt-4" type="button">
        Seleccionar archivos
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-6 text-destructive mb-0.5 ")} />
      </div>

      <p className="text-base font-semibold">No se pudo subir este archivo</p>
      <p className="text-sm mt-1 text-muted-foreground">Algo salió mal</p>
      <Button className="mt-4" type="button" variant="outline">
        Volver a subir archivos
      </Button>
    </div>
  );
}
