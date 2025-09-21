
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Link as LinkIcon, ExternalLink, Calendar, Eye } from "lucide-react";
import { apiService, LinkData } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { link } from "fs";

const Links = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [params, setParams] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await apiService.getLinks();
        setLinks(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Erro ao carregar links:", err.message);
          if (err.message.includes("authorization token is missing") || err.message.includes("invalid token")) {
            apiService.logout();
            window.location.href = "/";
            return;
          }
        } else {
          console.error("Erro desconhecido ao carregar links");
        }
        setError("Não foi possível carregar os links.");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleGenerateLink = async () => {
    if (!originalUrl.trim()) {
      toast.error("Por favor, insira uma URL válida");
      return;
    }

    setLoadingCreate(true);
    try {
      const newLink = await apiService.createLink(originalUrl, params || undefined);
      setGeneratedLink(newLink.shortUrl);
      setOriginalUrl("");
      setParams("");
      toast.success("Link gerado com sucesso!");
      
      // Recarregar a lista de links
      const updatedLinks = await apiService.getLinks();
      setLinks(updatedLinks);
    } catch (error: any) {
      console.error('Erro ao gerar link:', error);
      let errorMessage = "Erro ao gerar link";
      
      if (error.message.includes("invalid params format")) {
        errorMessage = "Formato de parâmetros inválido";
      } else if (error.message.includes("Field validation for 'Url' failed")) {
        errorMessage = "URL é obrigatória";
      } else if (error.message.includes("authorization token is missing")) {
        errorMessage = "Você precisa estar logado para criar links";
        apiService.logout();
        window.location.href = "/";
        return;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const handleViewDetails = (link: LinkData) => {
    navigate(`/link/${link.shortened || link.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Gerenciar Links</h1>
          </div>

          {/* Formulário de criação de links */}
          <Card className="bg-foreground border-border mb-8">
            <CardHeader>
              <CardTitle className="text-white">Criar Novo Link</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">URL Original</label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Parâmetros (opcional)</label>
                  <input
                    type="text"
                    placeholder="parametros-customizados"
                    value={params}
                    onChange={(e) => setParams(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>

                <Button
                  onClick={handleGenerateLink}
                  disabled={loadingCreate}
                  className="bg-green-600 hover:bg-green-700 text-white border-none disabled:bg-gray-600 disabled:text-gray-400"
                >
                  {loadingCreate ? "Gerando..." : "Gerar Link"}
                </Button>

                {generatedLink && (
                  <div>
                    <label className="block text-gray-300 mb-2">Link Gerado</label>
                    <div className="flex gap-2">
                      <input
                        value={generatedLink}
                        readOnly
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                      />
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {loading && <p className="text-gray-400">Carregando links...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="grid gap-4">
              {links.map((link) => (
                <Card key={link.id} className="bg-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="truncate">{link.shortened ?? "Sem título"}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => window.open(link.shortUrl, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <LinkIcon className="w-4 h-4 text-green-500" />
                        <span className="text-green-400 font-mono">
                          {link.shortUrl}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm truncate">
                        {link.originalUrl ?? "Sem URL original"}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {link.visits} cliques
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(link.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <Button
                          onClick={() => handleViewDetails(link)}
                          variant="outline"
                          size="sm"
                          className="border-border text-gray-300 hover:bg-background"
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Links;
