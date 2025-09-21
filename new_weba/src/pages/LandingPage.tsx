

import { useState } from "react";
import { Shield, Zap, BarChart3, Globe, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Widget } from "@/components/Widget";

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

const features = [
  {
    icon: Zap,
    title: "Links Rápidos",
    description: "Crie links encurtados em segundos com nossa interface intuitiva e moderna."
  },
  {
    icon: BarChart3,
    title: "Analytics Avançado",
    description: "Acompanhe cliques, localização geográfica e performance dos seus links em tempo real."
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Protegemos seus links com criptografia avançada e monitoramento contra spam."
  },
  {
    icon: Globe,
    title: "Alcance Global",
    description: "Compartilhe seus links em qualquer lugar do mundo com velocidade e confiabilidade."
  },
  {
    icon: Users,
    title: "Gestão de Equipe",
    description: "Colabore com sua equipe e gerencie links de forma organizada e eficiente."
  },
  {
    icon: Clock,
    title: "Histórico Completo",
    description: "Mantenha um registro detalhado de todos os seus links e suas estatísticas."
  }
];

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header com logo e botões de autenticação */}
      <nav className="bg-background border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-green-500 text-xl sm:text-2xl font-bold">Pantog</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={onLogin}
              variant="outline"
              size="sm"
              className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border text-xs sm:text-sm px-2 sm:px-3"
            >
              Entrar
            </Button>
            <Button
              onClick={onRegister}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3"
            >
              Registrar
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="px-4 sm:px-6">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Transforme seus <span className="text-green-500">links</span> em resultados
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            A plataforma mais avançada para encurtar, monitorar e otimizar seus links. 
            Aumente seu engajamento e acompanhe resultados em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              onClick={onRegister}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
            >
              Começar Gratuitamente
            </Button>
            <Button
              onClick={onLogin}
              variant="outline"
              size="lg"
              className="border-border bg-foreground text-gray-300 hover:bg-background hover:text-white hover:border-border px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
            >
              Já tenho conta
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12 px-4">
            Por que escolher o <span className="text-green-500">Pantog</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Widget key={index}>
                <div className="text-center p-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <feature.icon size={20} className="text-white sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Widget>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center py-12 sm:py-16">
          <Widget className="bg-gradient-to-r from-foreground to-background border-green-500/20">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                Pronto para começar?
              </h2>
              <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">
                Junte-se a milhares de usuários que já confiam no Pantog para seus links.
              </p>
              <Button
                onClick={onRegister}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg"
              >
                Criar Conta Gratuita
              </Button>
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
}

