

import { useState } from "react";
import { UserPlus, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Widget } from "@/components/Widget";
import { toast } from "sonner";
import { apiService } from "@/utils/api";

interface RegisterProps {
  onRegister: (name: string, email: string, password: string) => void;
  onBack: () => void;
  onGoToLogin: () => void;
}

export default function Register({ onRegister, onBack, onGoToLogin }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.register(email, password, username);
      console.log('Register response:', response);
      onRegister(username, email, password);
      toast.success("Conta criada com sucesso!");
    } catch (error: any) {
      console.error('Erro no registro:', error);
      let errorMessage = "Erro ao criar conta";
      
      if (error.message.includes("email already registered")) {
        errorMessage = "Email já cadastrado";
      } else if (error.message.includes("Field validation for 'Username' failed")) {
        errorMessage = "Nome de usuário é obrigatório";
      } else if (error.message.includes("Field validation for 'Email' failed")) {
        errorMessage = "Email é obrigatório";
      } else if (error.message.includes("Field validation for 'Password' failed")) {
        errorMessage = "Senha é obrigatória";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white hover:border-gray-500 mb-4 sm:mb-6 text-xs sm:text-sm"
        >
          <ArrowLeft size={14} className="mr-1 sm:mr-2" />
          Voltar
        </Button>

        <Widget>
          <div className="text-center mb-6 sm:mb-8 p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <UserPlus size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Criar Conta</h1>
            <p className="text-gray-400 text-sm sm:text-base">Junte-se ao Pantog e comece gratuitamente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm mb-2">
                <User size={14} className="inline mr-1 sm:mr-2" />
                Nome de usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 text-sm sm:text-base"
                placeholder="Seu nome de usuário"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-xs sm:text-sm mb-2">
                <Mail size={14} className="inline mr-1 sm:mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 text-sm sm:text-base"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-xs sm:text-sm mb-2">
                <Lock size={14} className="inline mr-1 sm:mr-2" />
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 text-sm sm:text-base"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-xs sm:text-sm mb-2">
                <Lock size={14} className="inline mr-1 sm:mr-2" />
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 text-sm sm:text-base"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 sm:py-3 text-sm sm:text-base"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="text-center mt-4 sm:mt-6 pb-4 sm:pb-6">
            <p className="text-gray-400 text-xs sm:text-sm">
              Já tem uma conta?{" "}
              <button
                onClick={onGoToLogin}
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Fazer login
              </button>
            </p>
          </div>
        </Widget>
      </div>
    </div>
  );
}

