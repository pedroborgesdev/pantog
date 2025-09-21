
import { Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Widget } from "@/components/Widget";
import { useNavigate } from "react-router-dom";
import { LinkData } from "@/utils/api";

interface RecentLinksProps {
  links: LinkData[];
  loading: boolean;
}

export function RecentLinks({ links, loading }: RecentLinksProps) {
  const navigate = useNavigate();

  return (
    <Widget>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Clock size={20} />
        Links Recentes
      </h2>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2 bg-foreground" />
                  <Skeleton className="h-4 w-48 mb-2 bg-foreground" />
                  <div className="flex items-center gap-4 mt-2">
                    <Skeleton className="h-3 w-20 bg-foreground" />
                    <Skeleton className="h-3 w-16 bg-foreground" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 bg-foreground rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : links.length === 0 ? (
        <p className="text-gray-400">Nenhum link recente disponível.</p>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id} className="bg-background border border-border rounded-lg p-4 hover:bg-foreground transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{link.shortened}</h3>
                  <p className="text-green-400 text-sm font-mono">{link.shortUrl}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-border">
                    <span>Criado {link.createdAt || "N/A"}</span>
                    <span>{link.visits || 0} cliques</span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate(`/link/${link.shortened || link.id}`)}
                  variant="outline"
                  size="sm"
                  className="bg-background border border-border text-white hover:bg-foreground hover:text-white hover:border-border"
                >
                  <ExternalLink size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Button
        onClick={() => navigate("/links")}
        variant="outline"
        className="w-full mt-4 border border-border bg-background text-gray-300 hover:bg-foreground hover:text-white hover:border-border"
      >
        Ver todos os links
      </Button>
    </Widget>
  );
}
