

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Palette, Database } from "lucide-react";

const Config = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Configurações</h1>
          
          <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-foreground gap-1">
              <TabsTrigger value="profile" className="data-[state=active]:bg-green-600 text-xs sm:text-sm p-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-green-600 text-xs sm:text-sm p-2">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-green-600 text-xs sm:text-sm p-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Segurança</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-green-600 text-xs sm:text-sm p-2">
                <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Aparência</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="data-[state=active]:bg-green-600 text-xs sm:text-sm p-2">
                <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Dados</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-white text-base sm:text-lg">Informações do Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300 text-xs sm:text-sm">Nome</Label>
                      <Input 
                        id="name" 
                        placeholder="Seu nome" 
                        className="bg-background border-border text-white text-sm mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300 text-xs sm:text-sm">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        className="bg-background border-border text-white text-sm mt-1" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-gray-300 text-xs sm:text-sm">Bio</Label>
                    <Input 
                      id="bio" 
                      placeholder="Conte um pouco sobre você" 
                      className="bg-background border-border text-white text-sm mt-1" 
                    />
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm">
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-white text-base sm:text-lg">Preferências de Notificação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 text-sm sm:text-base">Notificações por Email</Label>
                      <p className="text-xs sm:text-sm text-gray-400">Receba atualizações sobre seus links por email</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 text-sm sm:text-base">Relatórios Semanais</Label>
                      <p className="text-xs sm:text-sm text-gray-400">Receba relatórios semanais de performance</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 text-sm sm:text-base">Alertas de Segurança</Label>
                      <p className="text-xs sm:text-sm text-gray-400">Seja notificado sobre atividades suspeitas</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-white text-base sm:text-lg">Segurança da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="current-password" className="text-gray-300 text-xs sm:text-sm">Senha Atual</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      className="bg-background border-border text-white text-sm mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password" className="text-gray-300 text-xs sm:text-sm">Nova Senha</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      className="bg-background border-border text-white text-sm mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className="text-gray-300 text-xs sm:text-sm">Confirmar Nova Senha</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      className="bg-background border-border text-white text-sm mt-1" 
                    />
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm">
                    Alterar Senha
                  </Button>
                  
                  <div className="pt-4 sm:pt-6 border-t border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <Label className="text-gray-300 text-sm sm:text-base">Autenticação de Dois Fatores</Label>
                        <p className="text-xs sm:text-sm text-gray-400">Adicione uma camada extra de segurança</p>
                      </div>
                      <Button variant="outline" className="border-border text-gray-300 hover:bg-background text-xs sm:text-sm">
                        Configurar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="bg-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-white text-base sm:text-lg">Personalização</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 text-sm sm:text-base">Tema Escuro</Label>
                      <p className="text-xs sm:text-sm text-gray-400">Use o tema escuro da interface</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 text-sm sm:text-base">Animações</Label>
                      <p className="text-xs sm:text-sm text-gray-400">Ativar animações na interface</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card className="bg-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-white text-base sm:text-lg">Gerenciamento de Dados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-medium text-white">Exportar Dados</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Baixe uma cópia de todos os seus dados</p>
                    <Button variant="outline" className="border-border text-gray-300 hover:bg-background text-xs sm:text-sm">
                      Exportar Dados
                    </Button>
                  </div>
                  
                  <div className="space-y-2 pt-4 sm:pt-6 border-t border-border">
                    <h3 className="text-base sm:text-lg font-medium text-red-400">Zona de Perigo</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Ações irreversíveis que afetam sua conta</p>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm">
                      Deletar Conta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Config;

