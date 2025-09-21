

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Shield, BarChart3 } from "lucide-react";

const Premium = () => {
  const features = [
    {
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Links Ilimitados",
      description: "Crie quantos links quiser sem limitações"
    },
    {
      icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Analytics Avançados",
      description: "Relatórios detalhados com dados de origem, dispositivos e localização"
    },
    {
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Links Personalizados",
      description: "Crie URLs personalizadas com seu próprio domínio"
    },
    {
      icon: <Crown className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Suporte Prioritário",
      description: "Atendimento exclusivo e suporte técnico 24/7"
    }
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      features: [
        "Até 100 links por mês",
        "Analytics básicos",
        "Suporte por email"
      ],
      current: true
    },
    {
      name: "Premium",
      price: "R$ 19,90",
      period: "/mês",
      features: [
        "Links ilimitados",
        "Analytics avançados",
        "URLs personalizadas",
        "Suporte prioritário",
        "Relatórios em PDF",
        "API de integração"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "R$ 49,90",
      period: "/mês",
      features: [
        "Tudo do Premium",
        "Múltiplos usuários",
        "White label",
        "Integração SSO",
        "Gerente de conta dedicado"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
              Desbloqueie todo o potencial do Pantog
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Acesse recursos avançados e analytics detalhados para maximizar o impacto dos seus links
            </p>
          </div>

          {/* Features em destaque */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="bg-foreground border-border text-center">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center text-white mb-3 sm:mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-base sm:text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-400 text-xs sm:text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`bg-foreground border-border relative ${
                  plan.recommended ? 'border-green-500 border-2' : ''
                }`}
              >
                {plan.recommended && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs">
                    Recomendado
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white text-lg sm:text-xl">{plan.name}</CardTitle>
                  <div className="mt-3 sm:mt-4">
                    <span className="text-2xl sm:text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-gray-300">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full text-xs sm:text-sm ${
                      plan.current 
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                        : plan.recommended 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-background hover:bg-border text-white'
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Plano Atual' : 'Escolher Plano'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
              Tem dúvidas? Entre em contato conosco
            </p>
            <Button variant="outline" className="border-border text-gray-300 hover:bg-background text-xs sm:text-sm">
              Falar com Vendas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;

