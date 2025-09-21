
import { useState, useEffect } from "react";
import { Globe, MapPin, Users } from "lucide-react";
import { Widget } from "./Widget";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService, MetricsResponse } from "@/utils/api";
import { toast } from "sonner";

interface LinkMetricsProps {
  shortened: string;
}

export function LinkMetrics({ shortened }: LinkMetricsProps) {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!shortened) return;
      
      setLoading(true);
      try {
        const metricsData = await apiService.getLinkMetrics(shortened);
        setMetrics(metricsData);
      } catch (error: any) {
        console.error('Erro ao carregar métricas:', error);
        if (error.message.includes("authorization token is missing")) {
          toast.error("Token de autorização necessário");
        } else {
          toast.error("Erro ao carregar métricas do link");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [shortened]);

  if (loading) {
    return (
      <Widget>
        <h3 className="text-lg font-semibold text-white mb-4">Métricas Detalhadas</h3>
        <div className="space-y-4">
          <Skeleton className="h-16 w-full bg-background" />
          <Skeleton className="h-32 w-full bg-background" />
        </div>
      </Widget>
    );
  }

  if (!metrics) {
    return (
      <Widget>
        <h3 className="text-lg font-semibold text-white mb-4">Métricas Detalhadas</h3>
        <p className="text-gray-400">Não foi possível carregar as métricas</p>
      </Widget>
    );
  }

  return (
    <Widget>
      <h3 className="text-lg font-semibold text-white mb-4">Métricas Detalhadas</h3>
      
      <div className="space-y-4">
        {/* Total de visitas */}
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Total de Visitas</p>
              <p className="text-white text-2xl font-bold">{metrics.visits}</p>
            </div>
          </div>
        </div>

        {/* Localizações */}
        {metrics.locations && metrics.locations.length > 0 ? (
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-5 w-5 text-green-500" />
              <h4 className="text-white font-medium">Localizações</h4>
            </div>
            
            <div className="space-y-3">
              {metrics.locations.map((location, index) => (
                <div key={index} className="border-l-2 border-green-500 pl-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-white font-medium">{location.country}</span>
                  </div>
                  
                  {location.regions && Object.entries(location.regions).map(([region, cities]) => (
                    <div key={region} className="ml-4 mb-2">
                      <p className="text-gray-300 text-sm font-medium">{region}</p>
                      <div className="ml-2">
                        {Object.entries(cities).map(([city, count]) => (
                          <div key={city} className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">{city}</span>
                            <span className="text-green-400">{count} visitas</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-background border border-border rounded-lg p-4 text-center">
            <Globe className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">Nenhuma localização registrada ainda</p>
          </div>
        )}
      </div>
    </Widget>
  );
}
