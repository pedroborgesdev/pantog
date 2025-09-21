
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona automaticamente para /home
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Dashboard</h1>
        <p className="text-xl text-gray-400">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
