import { Waves } from "lucide-react";
import { Link } from "react-router-dom";

export function OceanGuardLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
        <Waves className="h-5 w-5 text-primary-foreground" />
      </div>
      {!collapsed && (
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          Ocean<span className="text-primary">Guard</span>
        </span>
      )}
    </Link>
  );
}
