
import { Lightbulb, Target, Share2, TrendingUp } from "lucide-react";
import { Widget } from "@/components/Widget";

const tips = [
  {
    icon: Target,
    title: "Use CTAs claras",
    description: "Adicione chamadas para ação específicas em seus links para aumentar conversões."
  },
  {
    icon: Share2,
    title: "Compartilhe no momento certo",
    description: "Publique seus links quando sua audiência estiver mais ativa nas redes sociais."
  },
  {
    icon: TrendingUp,
    title: "Monitore regularmente",
    description: "Acompanhe as métricas dos seus links para identificar padrões e oportunidades."
  }
];

export function TipsWidget() {
  return (
    <Widget>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Lightbulb size={20} />
        Dicas para Melhorar seus Links
      </h2>
      
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <tip.icon size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">{tip.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}
