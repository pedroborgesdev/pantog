
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  showAuthButtons?: boolean;
  onLogin?: () => void;
  onRegister?: () => void;
}

export function Navbar({ showAuthButtons = false, onLogin, onRegister }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-400 hover:text-white" />
          <h1 className="text-green-500 text-xl font-bold">Pantog</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {showAuthButtons ? (
            <>
              <Button
                onClick={onLogin}
                variant="outline"
                size="sm"
                className="border border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border"
              >
                Entrar
              </Button>
              <Button
                onClick={onRegister}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Registrar
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/premium")}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Virar Assinante
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
