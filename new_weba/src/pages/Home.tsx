

import { useEffect, useState } from "react";
import { Plus, Pen, Link as LinkIcon, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Widget } from "@/components/Widget";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentLinks } from "@/components/RecentLinks";
import { TipsWidget } from "@/components/TipsWidget";
import { Navbar } from "@/components/Navbar";
import { apiService, LinkData, VisitData } from "@/utils/api";
import { toast } from "sonner";

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [visitsData, setVisitsData] = useState<VisitData[]>([]);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, visitsResult, linksResult] = await Promise.all([
          apiService.getStats(),
          apiService.getVisitsData(),
          apiService.getLinks(),
        ]);
        setStats(statsData);
        setVisitsData(visitsResult);
        setLinks(linksResult); 
      } catch (error) {
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 p-4 sm:p-6 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Widget de criação de link */}
          <Widget>
            <div className="text-center p-2">
              <Plus size={28} className="text-primary mx-auto mb-3" />
              <h3 className="text-white font-semibold text-sm sm:text-base">Criar Link</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3">Gere um novo link</p>
              <Button
                onClick={() => navigate("/links")}
                variant="outline"
                size="sm"
                className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border text-xs sm:text-sm"
              >
                Criar
              </Button>
            </div>
          </Widget>

          {/* Widget de gerenciamento de links */}
          <Widget>
            <div className="text-center p-2">
              <Pen size={28} className="text-primary mx-auto mb-3" />
              <h3 className="text-white font-semibold text-sm sm:text-base">Gerenciar</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3">Editar links existentes</p>
              <Button
                onClick={() => navigate("/links")}
                variant="outline"
                size="sm"
                className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border text-xs sm:text-sm"
              >
                Gerenciar
              </Button>
            </div>
          </Widget>

          {/* Widget de quantidade de links */}
          <Widget>
            <div className="text-center p-2">
              <LinkIcon size={28} className="text-primary mx-auto mb-3" />
              {loading ? (
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mx-auto mb-2 bg-gray-600" />
              ) : (
                <h3 className="text-white font-semibold text-xl sm:text-2xl">{stats?.totalLinks}</h3>
              )}
              <p className="text-gray-400 text-xs sm:text-sm mb-3">Total de Links</p>
              <Button
                onClick={() => navigate("/links")}
                variant="outline"
                size="sm"
                className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border text-xs sm:text-sm"
              >
                Gerenciar
              </Button>
            </div>
          </Widget>

          {/* Widget do link mais visitado */}
          <Widget>
            <div className="text-center p-2">
              <Eye size={28} className="text-primary mx-auto mb-3" />
              {loading ? (
                <>
                  <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 mx-auto mb-2 bg-gray-600" />
                  <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mx-auto mb-2 bg-gray-600" />
                </>
              ) : (
                <>
                  <h3 className="text-white font-semibold text-sm sm:text-base">
                    {stats?.mostVisitedLink?.visits} visitas
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 truncate px-1">
                    {stats?.mostVisitedLink?.shortUrl || "Link indisponível"}
                  </p>
                </>
              )}
              <Button
                onClick={() => navigate(`/link/${stats?.mostVisitedLink?.id}`)}
                variant="outline"
                size="sm"
                className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border text-xs sm:text-sm"
                disabled={loading || !stats?.mostVisitedLink?.id}
              >
                Veja mais
              </Button>
            </div>
          </Widget>
        </div>

        {/* Gráfico de visitas
        <Widget className="mt-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Visitas nos últimos 30 dias
          </h2>
          <div className="h-64 sm:h-80">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 bg-gray-600" />
                <Skeleton className="h-48 sm:h-64 w-full bg-gray-600" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                    labelStyle={{ color: "#F3F4F6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: "#10B981", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Widget> */}

        {/* Seção de Links Recentes e Dicas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentLinks links={links} loading={loading} />
          <TipsWidget />
        </div>
      </div>
    </div>
  );
};

export default Home;

