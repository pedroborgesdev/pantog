

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Calendar, Eye, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Widget } from "@/components/Widget";
import { Navbar } from "@/components/Navbar";
import { apiService, LinkData } from "@/utils/api";
import { toast } from "sonner";

const LinkDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLink = async () => {
      if (!id) return;
      
      try {
        const linkData = await apiService.getLink(id);
        if (!linkData) {
          toast.error("Link não encontrado");
          navigate("/links");
          return;
        }
        setLink(linkData);
      } catch (error) {
        toast.error("Erro ao carregar detalhes do link");
      } finally {
        setLoading(false);
      }
    };

    loadLink();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 text-center text-gray-400 py-8 px-4">
          Carregando detalhes...
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 text-center text-gray-400 py-8 px-4">
          Link não encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button
            onClick={() => navigate("/links")}
            variant="outline"
            size="sm"
            className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border text-xs sm:text-sm"
          >
            <ArrowLeft size={14} className="mr-1 sm:mr-2" />
            Voltar
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Detalhes do Link</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Informações básicas */}
          <Widget>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <ExternalLink size={18} className="sm:w-5 sm:h-5" />
              Informações do Link
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm mb-1">Link Curto</label>
                <p className="text-green-400 font-medium break-all text-sm sm:text-base">{link.shortUrl}</p>
              </div>
              
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm mb-1">URL Original</label>
                <p className="text-gray-200 break-all text-sm sm:text-base">{link.originalUrl}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-300 text-xs sm:text-sm mb-1">Visitas</label>
                  <p className="text-white text-base sm:text-lg font-semibold">{link.visits}</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-xs sm:text-sm mb-1">Criado em</label>
                  <p className="text-gray-200 text-sm sm:text-base">{link.createdAt}</p>
                </div>
              </div>
            </div>
          </Widget>

          {/* Estatísticas */}
          <Widget>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Eye size={18} className="sm:w-5 sm:h-5" />
              Estatísticas
            </h2>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-background p-3 sm:p-4 rounded-lg text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-400">{link.visits}</div>
                <div className="text-gray-300 text-xs sm:text-sm">Total de Cliques</div>
              </div>
              
              <div className="bg-background p-3 sm:p-4 rounded-lg text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-400">
                  {Math.round(link.visits / 30)}
                </div>
                <div className="text-gray-300 text-xs sm:text-sm">Cliques/Dia (média)</div>
              </div>
              
              <div className="bg-background p-3 sm:p-4 rounded-lg text-center">
                <div className="text-lg sm:text-2xl font-bold text-purple-400">85%</div>
                <div className="text-gray-300 text-xs sm:text-sm">Taxa de Sucesso</div>
              </div>
              
              <div className="bg-background p-3 sm:p-4 rounded-lg text-center">
                <div className="text-lg sm:text-2xl font-bold text-yellow-400">1.2s</div>
                <div className="text-gray-300 text-xs sm:text-sm">Tempo de Resposta</div>
              </div>
            </div>
          </Widget>

          {/* Ações */}
          <Widget className="lg:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Share size={18} className="sm:w-5 sm:h-5" />
              Ações
            </h2>
            
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Button 
                onClick={() => navigator.clipboard.writeText(link.shortUrl)}
                className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                Copiar Link
              </Button>
              
              <Button 
                onClick={() => window.open(link.originalUrl, '_blank')}
                variant="outline"
                className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                Abrir Original
              </Button>
              
              <Button 
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                variant="outline"
                className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                Editar Link
              </Button>
              
              <Button 
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                variant="outline"
                className="border-red-600 bg-foreground text-red-400 hover:bg-red-900 hover:text-red-300 hover:border-red-500 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                Excluir Link
              </Button>
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
};

export default LinkDetails;

