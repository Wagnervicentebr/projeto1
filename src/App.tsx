import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import Dashboard from "./components/Dashboard";
import Vendedores from "./components/Vendedores";
import Empresas from "./components/Empresas";
import Colaboradores from "./components/Colaboradores";
import NotasFiscais from "./components/NotasFiscais";
import Configuracoes from "./components/Configuracoes";
import AdminProfile from "./components/AdminProfile";
import Login from "./components/Login";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  UserCircle,
  Moon,
  Sun,
  Building2,
  TrendingUp,
  Settings,
} from "lucide-react";
import { useDarkMode } from "./hooks/useDarkMode";
import novigoLogo from "figma:asset/8bae1cc516bcd2caddce7ede9f944e7d79bb5b32.png";
import { motion } from "motion/react";
import { migrateData, checkMigration } from "./utils/migration";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark, toggle: toggleDarkMode } = useDarkMode();

  useEffect(() => {
    // Executar migração de dados se necessário
    if (!checkMigration()) {
      console.log("Executando migração de dados...");
      migrateData();
      console.log("Migração concluída!");
    }

    // TEMPORÁRIO: Garantir que empresas tomadoras existam
    const empresasStored = localStorage.getItem("empresas");
    if (
      !empresasStored ||
      JSON.parse(empresasStored).length === 0
    ) {
      const empresasTomadoras = [
        {
          id: "et1",
          razaoSocial: "MICROSOFT BRASIL LTDA",
          cnpj: "04.712.500/0001-07",
          inscricaoEstadual: "117.690.111.118",
          inscricaoMunicipal: "8.345.632-0",
          endereco:
            "AV. PRESIDENTE JUSCELINO KUBITSCHEK, 1909 - 4º ANDAR - VILA NOVA CONCEIÇÃO",
          cep: "04543-011",
          municipio: "SÃO PAULO",
          uf: "SP",
          email: "contato@microsoft.com.br",
          telefone: "(11) 3443-8200",
        },
        {
          id: "et2",
          razaoSocial: "GOOGLE BRASIL INTERNET LTDA",
          cnpj: "06.990.590/0001-23",
          inscricaoEstadual: "149.418.890.113",
          inscricaoMunicipal: "9.235.874-1",
          endereco:
            "AV. BRIG. FARIA LIMA, 3477 - 12º ANDAR - ITAIM BIBI",
          cep: "04538-133",
          municipio: "SÃO PAULO",
          uf: "SP",
          email: "contato@google.com.br",
          telefone: "(11) 2395-8400",
        },
        {
          id: "et3",
          razaoSocial:
            "AMAZON SERVICOS DE VAREJO DO BRASIL LTDA",
          cnpj: "15.436.940/0001-03",
          inscricaoEstadual: "153.589.912.110",
          inscricaoMunicipal: "7.892.345-2",
          endereco:
            "AV. PRESIDENTE JUSCELINO KUBITSCHEK, 2041 - TORRE A - VILA OLÍMPIA",
          cep: "04543-011",
          municipio: "SÃO PAULO",
          uf: "SP",
          email: "contato@amazon.com.br",
          telefone: "(11) 3003-2244",
        },
        {
          id: "et4",
          razaoSocial: "BANCO BRADESCO S.A.",
          cnpj: "60.746.948/0001-12",
          inscricaoEstadual: "107.548.890.111",
          inscricaoMunicipal: "5.678.234-8",
          endereco: "RUA HENRIQUE MONTEIRO, 236 - PINHEIROS",
          cep: "05423-020",
          municipio: "SÃO PAULO",
          uf: "SP",
          email: "relacionamento@bradesco.com.br",
          telefone: "(11) 2178-0800",
        },
        {
          id: "et5",
          razaoSocial: "ITAÚ UNIBANCO S.A.",
          cnpj: "60.701.190/0001-04",
          inscricaoEstadual: "106.443.856.117",
          inscricaoMunicipal: "4.234.567-3",
          endereco:
            "PRAÇA ALFREDO EGYDIO DE SOUZA ARANHA, 100 - PARQUE JABAQUARA",
          cep: "04344-902",
          municipio: "SÃO PAULO",
          uf: "SP",
          email: "contato@itau-unibanco.com.br",
          telefone: "(11) 5029-1300",
        },
        {
          id: "et6",
          razaoSocial: "PETROBRAS - PETRÓLEO BRASILEIRO S.A.",
          cnpj: "33.000.167/0001-01",
          inscricaoEstadual: "78.916.764.119",
          inscricaoMunicipal: "3.456.789-5",
          endereco: "AV. REPÚBLICA DO CHILE, 65 - CENTRO",
          cep: "20031-912",
          municipio: "RIO DE JANEIRO",
          uf: "RJ",
          email: "relacionamento@petrobras.com.br",
          telefone: "(21) 3224-1510",
        },
        {
          id: "et7",
          razaoSocial: "VALE S.A.",
          cnpj: "33.592.510/0001-54",
          inscricaoEstadual: "062.286.285.0081",
          inscricaoMunicipal: "2.345.678-1",
          endereco:
            "AV. DAS AMÉRICAS, 700 - BL. 2 - 5º ANDAR - BARRA DA TIJUCA",
          cep: "22640-100",
          municipio: "RIO DE JANEIRO",
          uf: "RJ",
          email: "contato@vale.com",
          telefone: "(21) 3485-3900",
        },
        {
          id: "et8",
          razaoSocial:
            "AMBEV - COMPANHIA DE BEBIDAS DAS AMÉRICAS",
          cnpj: "07.526.557/0001-00",
          inscricaoEstadual: "117.511.726.116",
          inscricaoMunicipal: "8.901.234-7",
          endereco:
            "RUA DR. RENATO PAES DE BARROS, 1017 - 4º ANDAR - ITAIM BIBI",
          cep: "04530-001",
          municipio: "SÃO PAULO",
          uf: "SP",
          email: "sac@ambev.com.br",
          telefone: "(11) 2122-1300",
        },
        {
          id: "et9",
          razaoSocial: "MAGAZINE LUIZA S.A.",
          cnpj: "47.960.950/0001-21",
          inscricaoEstadual: "283.062.408.119",
          inscricaoMunicipal: "6.789.012-4",
          endereco:
            "RUA ARNULFO DE LIMA, 2385 - VILA SANTA CRUZ",
          cep: "14.403-471",
          municipio: "FRANCA",
          uf: "SP",
          email: "contato@magazineluiza.com.br",
          telefone: "(16) 3711-2300",
        },
        {
          id: "et10",
          razaoSocial: "TELEFÔNICA BRASIL S.A.",
          cnpj: "02.558.157/0001-62",
          inscricaoEstadual: "111.234.567.118",
          inscricaoMunicipal: "1.234.567-9",
          endereco:
            "AV. ENGENHEIRO LUÍS CARLOS BERRINI, 1376 - CIDADE MONÇÕES",
          cep: "04571-936",
          municipio: "SÃO PAULO",
          uf: "SP",
          email: "atendimento@telefonica.com.br",
          telefone: "(11) 3430-3000",
        },
      ];
      localStorage.setItem(
        "empresas",
        JSON.stringify(empresasTomadoras),
      );
      console.log("Empresas tomadoras criadas!");
    }

    // Verificar se há usuário logado
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (
    userType: "admin" | "user",
    userData: any,
  ) => {
    // Permitir login de administrador e funcionário
    setCurrentUser({ ...userData, tipo: userType });
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary">Carregando...</p>
      </div>
    );
  }

  // Se não estiver logado, mostrar tela de login
  if (!currentUser) {
    return (
      <Login
        onLogin={handleLogin}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Se for comercial, mostrar apenas a tela de notas fiscais
  if (currentUser.tipo === "user") {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 dark:from-blue-700 dark:via-blue-800 dark:to-blue-700 border-b border-blue-500 dark:border-blue-600 sticky top-0 z-50 shadow-2xl backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a
                  href="https://novigo-it.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg p-2 hover:scale-105 transition-transform cursor-pointer"
                >
                  <img
                    src={novigoLogo}
                    alt="Novigo IT"
                    className="w-full h-full object-contain"
                  />
                </a>
                <div>
                  <h1 className="text-white">
                    Faturamento Novigo
                  </h1>
                  <p className="text-slate-300 text-xs">
                    Portal do Comercial
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-white text-sm">
                    Comercial
                  </p>
                  <p className="text-slate-300 text-xs">
                    {currentUser.nome}
                  </p>
                </div>
                <Button
                  onClick={toggleDarkMode}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg backdrop-blur-sm"
                  size="sm"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg backdrop-blur-sm"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="inline-flex w-auto mb-8 bg-card border border-border shadow-lg p-1.5 rounded-2xl mx-auto relative">
              <TabsTrigger
                value="dashboard"
                className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
              >
                {activeTab === "dashboard" && (
                  <motion.div
                    layoutId="activeTabUser"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <LayoutDashboard className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline whitespace-nowrap relative z-10">
                  Dashboard
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="colaboradores"
                className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
              >
                {activeTab === "colaboradores" && (
                  <motion.div
                    layoutId="activeTabUser"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <Users className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline whitespace-nowrap relative z-10">
                  Colaboradores
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="notas"
                className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
              >
                {activeTab === "notas" && (
                  <motion.div
                    layoutId="activeTabUser"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <FileText className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline whitespace-nowrap relative z-10">
                  Notas Fiscais
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="empresas"
                className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
              >
                {activeTab === "empresas" && (
                  <motion.div
                    layoutId="activeTabUser"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <Building2 className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline whitespace-nowrap relative z-10">
                  Empresas
                </span>
              </TabsTrigger>
              {/* Configurações removida para funcionários */}
              <TabsTrigger
                value="perfil"
                className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
              >
                {activeTab === "perfil" && (
                  <motion.div
                    layoutId="activeTabUser"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <UserCircle className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline whitespace-nowrap relative z-10">
                  Perfil
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard
                onNavigate={setActiveTab}
                vendedorLogado={currentUser}
              />
            </TabsContent>

            <TabsContent value="colaboradores">
              <Colaboradores currentUser={currentUser} />
            </TabsContent>

            <TabsContent value="notas">
              <NotasFiscais currentUser={currentUser} />
            </TabsContent>

            <TabsContent value="empresas">
              <Empresas currentUser={currentUser} />
            </TabsContent>

            <TabsContent value="perfil">
              <AdminProfile userData={currentUser} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  // Mostrar dashboard administrativo
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 dark:from-blue-700 dark:via-blue-800 dark:to-blue-700 border-b border-blue-500 dark:border-blue-600 sticky top-0 z-50 shadow-2xl backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href="https://novigo-it.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg p-2 hover:scale-105 transition-transform cursor-pointer"
              >
                <img
                  src={novigoLogo}
                  alt="Novigo IT"
                  className="w-full h-full object-contain"
                />
              </a>
              <h1 className="text-white">Faturamento Novigo</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm">Usuário</p>
                <p className="text-slate-300 text-xs">
                  {currentUser.nome}
                </p>
              </div>
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg backdrop-blur-sm"
                size="sm"
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg backdrop-blur-sm"
                size="sm"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="inline-flex w-auto mb-8 bg-card border border-border shadow-lg p-1.5 rounded-2xl mx-auto relative">
            <TabsTrigger
              value="dashboard"
              className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
            >
              {activeTab === "dashboard" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <LayoutDashboard className="w-4 h-4 relative z-10" />
              <span className="hidden sm:inline whitespace-nowrap relative z-10">
                Dashboard
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="colaboradores"
              className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
            >
              {activeTab === "colaboradores" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <Users className="w-4 h-4 relative z-10" />
              <span className="hidden sm:inline whitespace-nowrap relative z-10">
                Colaboradores
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="notas"
              className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
            >
              {activeTab === "notas" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <FileText className="w-4 h-4 relative z-10" />
              <span className="hidden sm:inline whitespace-nowrap relative z-10">
                Notas Fiscais
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="empresas"
              className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
            >
              {activeTab === "empresas" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <Building2 className="w-4 h-4 relative z-10" />
              <span className="hidden sm:inline whitespace-nowrap relative z-10">
                Empresas
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="configuracoes"
              className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
            >
              {activeTab === "configuracoes" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <Settings className="w-4 h-4 relative z-10" />
              <span className="hidden sm:inline whitespace-nowrap relative z-10">
                Configurações
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="perfil"
              className="flex items-center justify-center gap-2 data-[state=active]:text-white text-foreground rounded-xl transition-colors px-4 py-2.5 relative z-10"
            >
              {activeTab === "perfil" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <UserCircle className="w-4 h-4 relative z-10" />
              <span className="hidden sm:inline whitespace-nowrap relative z-10">
                Perfil
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              onNavigate={setActiveTab}
              vendedorLogado={null}
            />
          </TabsContent>

          <TabsContent value="colaboradores">
            <Colaboradores />
          </TabsContent>

          <TabsContent value="notas">
            <NotasFiscais />
          </TabsContent>

          <TabsContent value="empresas">
            <Empresas />
          </TabsContent>

          <TabsContent value="configuracoes">
            <Configuracoes />
          </TabsContent>

          <TabsContent value="perfil">
            <AdminProfile userData={currentUser} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}