import { LucideIcon } from "lucide-react";

interface ModulePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ModulePlaceholder({ icon: Icon, title, description }: ModulePlaceholderProps) {
  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl">{title}</h1>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="bg-card border-2 border-border rounded-2xl p-12 text-center">
        <Icon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl mb-2 text-muted-foreground">Módulo em Desenvolvimento</h2>
        <p className="text-muted-foreground">
          Este módulo estará disponível em breve com funcionalidades completas de gerenciamento.
        </p>
      </div>
    </div>
  );
}
