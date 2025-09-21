
import { useState } from "react";
import { LogIn, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Widget } from "@/components/Widget";
import { toast } from "sonner";
import { apiService } from "@/utils/api";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onBack: () => void;
  onGoToRegister: () => void;
}

export default function Login({ onLogin, onBack, onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      console.log('Login response:', response);
      onLogin(email, password);
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      console.error('Erro no login:', error);
      let errorMessage = "Erro ao fazer login";
      
      if (error.message.includes("user not registered")) {
        errorMessage = "Usuário não cadastrado";
      } else if (error.message.includes("Field validation for 'Password' failed")) {
        errorMessage = "Senha é obrigatória";
      } else if (error.message.includes("Field validation for 'Email' failed")) {
        errorMessage = "Email é obrigatório";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar
        </Button>

        <Widget>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Entrar no Pantog</h1>
            <p className="text-gray-400">Acesse sua conta e gerencie seus links</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                <Lock size={16} className="inline mr-2" />
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Não tem uma conta?{" "}
              <button
                onClick={onGoToRegister}
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Registre-se
              </button>
            </p>
          </div>
        </Widget>
      </div>
    </div>
  );
}
