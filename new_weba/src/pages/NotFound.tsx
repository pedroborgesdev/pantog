

import { Navbar } from "@/components/Navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-20 p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Página não encontrada</h1>
          <p className="text-gray-400 text-sm sm:text-base">A página que você procura não existe.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

