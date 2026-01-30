import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, X, Settings, Save, Building2, CreditCard, Bell, Tag, AlertCircle, Calendar, CheckCircle, DollarSign } from 'lucide-react';
import { Configuracoes as ConfiguracoesType, configuracoesPadrao } from '../types';
import { toast } from 'sonner@2.0.3';

export default function Configuracoes() {
  const [config, setConfig] = useState<ConfiguracoesType>(configuracoesPadrao);
  const [newCategoria, setNewCategoria] = useState('');
  const [newCategoriaColaborador, setNewCategoriaColaborador] = useState('');
  const [newTipoTrabalho, setNewTipoTrabalho] = useState('');
  const [newConfiguracaoHibrido, setNewConfiguracaoHibrido] = useState('');
  const [newRegimeTributario, setNewRegimeTributario] = useState('');

  // Dados da Empresa
  const [dadosEmpresa, setDadosEmpresa] = useState({
    razaoSocial: 'NOVIGO TECNOLOGIA DA INFORMAÇÃO S.A',
    cnpj: '41.512.775/0001-23',
    inscricaoMunicipal: '8.313.969-3',
    inscricaoEstadual: '149.239.477.119',
    endereco: 'AV. BRIG. FARIA LIMA, 1234 - 11º ANDAR - JARDIM PAULISTANO',
    cep: '01451-001',
    municipio: 'São Paulo',
    uf: 'SP',
    email: 'contato@novigo.com.br',
    telefone: '(11) 3456-7890'
  });

  // Dados Bancários
  const [dadosBancarios, setDadosBancarios] = useState({
    banco: 'Banco BTG Pactual 208',
    agencia: '0050',
    contaCorrente: '383628-6',
    pix: '41.512.775/0001-23'
  });

  // Configurações de Alertas
  const [configuracaoAlertas, setConfiguracaoAlertas] = useState({
    alertarVencimento: true,
    diasAntesVencimento: 7,
    alertarNotasPendentes: true,
    alertarNotasEmitidas: false,
    alertarNotasVencidas: true,
    alertarNotasProximasVencimento: true,
    diasProximoVencimento: 3,
    notificacoesPorEmail: false,
    emailNotificacao: ''
  });

  useEffect(() => {
    loadConfiguracoes();
  }, []);

  const loadConfiguracoes = () => {
    const stored = localStorage.getItem('configuracoes');
    if (stored) {
      setConfig(JSON.parse(stored));
    } else {
      setConfig(configuracoesPadrao);
    }

    // Carregar dados da empresa
    const storedEmpresa = localStorage.getItem('dadosEmpresa');
    if (storedEmpresa) {
      setDadosEmpresa(JSON.parse(storedEmpresa));
    }

    // Carregar dados bancários
    const storedBancarios = localStorage.getItem('dadosBancarios');
    if (storedBancarios) {
      setDadosBancarios(JSON.parse(storedBancarios));
    }

    // Carregar configurações de alertas
    const storedAlertas = localStorage.getItem('configuracaoAlertas');
    if (storedAlertas) {
      setConfiguracaoAlertas(JSON.parse(storedAlertas));
    }
  };

  const handleSave = () => {
    localStorage.setItem('configuracoes', JSON.stringify(config));
    localStorage.setItem('dadosEmpresa', JSON.stringify(dadosEmpresa));
    localStorage.setItem('dadosBancarios', JSON.stringify(dadosBancarios));
    localStorage.setItem('configuracaoAlertas', JSON.stringify(configuracaoAlertas));
    toast.success('Configurações salvas com sucesso!');
  };

  const handleAddCategoriaEmpresa = () => {
    if (newCategoria.trim() && !config.categoriasEmpresas.includes(newCategoria.trim())) {
      setConfig({
        ...config,
        categoriasEmpresas: [...config.categoriasEmpresas, newCategoria.trim()],
      });
      setNewCategoria('');
    }
  };

  const handleRemoveCategoriaEmpresa = (categoria: string) => {
    setConfig({
      ...config,
      categoriasEmpresas: config.categoriasEmpresas.filter(c => c !== categoria),
    });
  };

  const handleAddCategoriaColaborador = () => {
    if (newCategoriaColaborador.trim() && !config.categoriasColaboradores.includes(newCategoriaColaborador.trim())) {
      setConfig({
        ...config,
        categoriasColaboradores: [...config.categoriasColaboradores, newCategoriaColaborador.trim()],
      });
      setNewCategoriaColaborador('');
    }
  };

  const handleRemoveCategoriaColaborador = (categoria: string) => {
    setConfig({
      ...config,
      categoriasColaboradores: config.categoriasColaboradores.filter(c => c !== categoria),
    });
  };

  const handleAddTipoTrabalho = () => {
    if (newTipoTrabalho.trim() && !config.tiposTrabalho.includes(newTipoTrabalho.trim())) {
      setConfig({
        ...config,
        tiposTrabalho: [...config.tiposTrabalho, newTipoTrabalho.trim()],
      });
      setNewTipoTrabalho('');
    }
  };

  const handleRemoveTipoTrabalho = (tipo: string) => {
    setConfig({
      ...config,
      tiposTrabalho: config.tiposTrabalho.filter(t => t !== tipo),
    });
  };

  const handleAddConfiguracaoHibrido = () => {
    if (newConfiguracaoHibrido.trim() && !config.configuracoesHibrido.includes(newConfiguracaoHibrido.trim())) {
      setConfig({
        ...config,
        configuracoesHibrido: [...config.configuracoesHibrido, newConfiguracaoHibrido.trim()],
      });
      setNewConfiguracaoHibrido('');
    }
  };

  const handleRemoveConfiguracaoHibrido = (conf: string) => {
    setConfig({
      ...config,
      configuracoesHibrido: config.configuracoesHibrido.filter(c => c !== conf),
    });
  };

  const handleAddRegimeTributario = () => {
    if (newRegimeTributario.trim() && !config.regimesTributarios.includes(newRegimeTributario.trim())) {
      setConfig({
        ...config,
        regimesTributarios: [...config.regimesTributarios, newRegimeTributario.trim()],
      });
      setNewRegimeTributario('');
    }
  };

  const handleRemoveRegimeTributario = (regime: string) => {
    setConfig({
      ...config,
      regimesTributarios: config.regimesTributarios.filter(r => r !== regime),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-foreground">Configurações</h2>
          <p className="text-muted-foreground">Configure todas as opções do sistema</p>
        </div>
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="empresa" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-card border border-border shadow-sm rounded-lg p-1.5 mb-6 h-auto">
          <TabsTrigger 
            value="empresa" 
            className="flex items-center justify-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-md transition-all px-4 py-2.5 h-auto"
          >
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Empresa</span>
          </TabsTrigger>
          <TabsTrigger 
            value="bancarios" 
            className="flex items-center justify-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-md transition-all px-4 py-2.5 h-auto"
          >
            <CreditCard className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Bancários</span>
          </TabsTrigger>
          <TabsTrigger 
            value="categorias" 
            className="flex items-center justify-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-md transition-all px-4 py-2.5 h-auto"
          >
            <Tag className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Categorias</span>
          </TabsTrigger>
          <TabsTrigger 
            value="alertas" 
            className="flex items-center justify-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-md transition-all px-4 py-2.5 h-auto"
          >
            <Bell className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Alertas</span>
          </TabsTrigger>
        </TabsList>

        {/* ABA DADOS DA EMPRESA */}
        <TabsContent value="empresa" className="space-y-4 mt-6">
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-foreground">Dados da Empresa (Prestador)</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Estes dados serão usados automaticamente nas notas fiscais
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razaoSocial" className="text-foreground">Razão Social</Label>
                  <Input
                    id="razaoSocial"
                    value={dadosEmpresa.razaoSocial}
                    onChange={(e) => setDadosEmpresa({...dadosEmpresa, razaoSocial: e.target.value})}
                    className="border-border bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-foreground">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={dadosEmpresa.cnpj}
                    onChange={(e) => setDadosEmpresa({...dadosEmpresa, cnpj: e.target.value})}
                    className="border-border bg-input-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inscricaoMunicipal" className="text-foreground">Inscrição Municipal</Label>
                  <Input
                    id="inscricaoMunicipal"
                    value={dadosEmpresa.inscricaoMunicipal}
                    onChange={(e) => setDadosEmpresa({...dadosEmpresa, inscricaoMunicipal: e.target.value})}
                    className="border-border bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inscricaoEstadual" className="text-foreground">Inscrição Estadual</Label>
                  <Input
                    id="inscricaoEstadual"
                    value={dadosEmpresa.inscricaoEstadual}
                    onChange={(e) => setDadosEmpresa({...dadosEmpresa, inscricaoEstadual: e.target.value})}
                    className="border-border bg-input-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-foreground">Endereço Completo</Label>
                <Input
                  id="endereco"
                  value={dadosEmpresa.endereco}
                  onChange={(e) => setDadosEmpresa({...dadosEmpresa, endereco: e.target.value})}
                  className="border-border bg-input-background"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep" className="text-foreground">CEP</Label>
                  <Input
                    id="cep"
                    value={dadosEmpresa.cep}
                    onChange={(e) => setDadosEmpresa({...dadosEmpresa, cep: e.target.value})}
                    className="border-border bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="municipio" className="text-foreground">Município</Label>
                  <Input
                    id="municipio"
                    value={dadosEmpresa.municipio}
                    onChange={(e) => setDadosEmpresa({...dadosEmpresa, municipio: e.target.value})}
                    className="border-border bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uf" className="text-foreground">UF</Label>
                  <Input
                    id="uf"
                    value={dadosEmpresa.uf}
                    onChange={(e) => setDadosEmpresa({...dadosEmpresa, uf: e.target.value})}
                    maxLength={2}
                    className="border-border bg-input-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={dadosEmpresa.email}
                    onChange={(e) => setDadosEmpresa({...dadosEmpresa, email: e.target.value})}
                    className="border-border bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-foreground">Telefone</Label>
                  <Input
                    id="telefone"
                    value={dadosEmpresa.telefone}
                    onChange={(e) => setDadosEmpresa({...dadosEmpresa, telefone: e.target.value})}
                    className="border-border bg-input-background"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA DADOS BANCÁRIOS */}
        <TabsContent value="bancarios" className="space-y-4 mt-6">
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-foreground">Dados Bancários Padrão</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Estes dados serão usados automaticamente para depósito nas notas fiscais
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banco" className="text-foreground">Banco</Label>
                  <Input
                    id="banco"
                    value={dadosBancarios.banco}
                    onChange={(e) => setDadosBancarios({...dadosBancarios, banco: e.target.value})}
                    placeholder="Ex: Banco BTG Pactual 208"
                    className="border-border bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agencia" className="text-foreground">Agência</Label>
                  <Input
                    id="agencia"
                    value={dadosBancarios.agencia}
                    onChange={(e) => setDadosBancarios({...dadosBancarios, agencia: e.target.value})}
                    placeholder="Ex: 0050"
                    className="border-border bg-input-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contaCorrente" className="text-foreground">Conta Corrente</Label>
                  <Input
                    id="contaCorrente"
                    value={dadosBancarios.contaCorrente}
                    onChange={(e) => setDadosBancarios({...dadosBancarios, contaCorrente: e.target.value})}
                    placeholder="Ex: 383628-6"
                    className="border-border bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pix" className="text-foreground">Chave PIX</Label>
                  <Input
                    id="pix"
                    value={dadosBancarios.pix}
                    onChange={(e) => setDadosBancarios({...dadosBancarios, pix: e.target.value})}
                    placeholder="CPF, CNPJ, Email ou Telefone"
                    className="border-border bg-input-background"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 <strong>Dica:</strong> Ao criar uma nova nota fiscal, estes dados serão preenchidos automaticamente nos campos de "Dados para Depósito".
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA CATEGORIAS */}
        <TabsContent value="categorias" className="space-y-4 mt-6">
          {/* Categorias de Empresas */}
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-foreground">Categorias de Empresas</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Defina as categorias disponíveis para classificação de empresas
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nova categoria (ex: Banco, Indústria)"
                  value={newCategoria}
                  onChange={(e) => setNewCategoria(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategoriaEmpresa()}
                  className="border-border bg-input-background text-foreground"
                />
                <Button
                  onClick={handleAddCategoriaEmpresa}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.categoriasEmpresas.map((categoria) => (
                  <Badge
                    key={categoria}
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 flex items-center gap-2"
                  >
                    {categoria}
                    <button
                      onClick={() => handleRemoveCategoriaEmpresa(categoria)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categorias de Colaboradores */}
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-foreground">Categorias de Colaboradores</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Tipos de vínculo dos colaboradores (CLT, PJ, RPA, Flex)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nova categoria (ex: CLT, PJ)"
                  value={newCategoriaColaborador}
                  onChange={(e) => setNewCategoriaColaborador(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategoriaColaborador()}
                  className="border-border bg-input-background text-foreground"
                />
                <Button
                  onClick={handleAddCategoriaColaborador}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.categoriasColaboradores.map((categoria) => (
                  <Badge
                    key={categoria}
                    className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 flex items-center gap-2"
                  >
                    {categoria}
                    <button
                      onClick={() => handleRemoveCategoriaColaborador(categoria)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Trabalho */}
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-foreground">Tipos de Trabalho</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Modalidades de trabalho disponíveis
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Novo tipo de trabalho (ex: Home Office, Presencial)"
                  value={newTipoTrabalho}
                  onChange={(e) => setNewTipoTrabalho(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTipoTrabalho()}
                  className="border-border bg-input-background text-foreground"
                />
                <Button
                  onClick={handleAddTipoTrabalho}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.tiposTrabalho.map((tipo) => (
                  <Badge
                    key={tipo}
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 flex items-center gap-2"
                  >
                    {tipo}
                    <button
                      onClick={() => handleRemoveTipoTrabalho(tipo)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Híbrido */}
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-foreground">Configurações de Trabalho Híbrido</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Opções de divisão para trabalho híbrido
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nova configuração (ex: 3x2)"
                  value={newConfiguracaoHibrido}
                  onChange={(e) => setNewConfiguracaoHibrido(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddConfiguracaoHibrido()}
                  className="border-border bg-input-background text-foreground"
                />
                <Button
                  onClick={handleAddConfiguracaoHibrido}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.configuracoesHibrido.map((conf) => (
                  <Badge
                    key={conf}
                    className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 flex items-center gap-2"
                  >
                    {conf}
                    <button
                      onClick={() => handleRemoveConfiguracaoHibrido(conf)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                * Formato: [dias no escritório]x[dias em casa] por semana
              </p>
            </CardContent>
          </Card>

          {/* Regimes Tributários */}
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-foreground">Regimes Tributários</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Regimes tributários disponíveis para notas fiscais
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Novo regime (ex: Simples Nacional)"
                  value={newRegimeTributario}
                  onChange={(e) => setNewRegimeTributario(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRegimeTributario()}
                  className="border-border bg-input-background text-foreground"
                />
                <Button
                  onClick={handleAddRegimeTributario}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.regimesTributarios.map((regime) => (
                  <Badge
                    key={regime}
                    className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 flex items-center gap-2"
                  >
                    {regime}
                    <button
                      onClick={() => handleRemoveRegimeTributario(regime)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Impostos */}
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-foreground">Tipos de Impostos</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Impostos disponíveis para cálculo em notas fiscais
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {config.tiposImpostos.map((imposto) => (
                  <div
                    key={imposto.codigo}
                    className="border border-border bg-muted/30 dark:bg-muted/10 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {imposto.codigo}
                      </Badge>
                      <span className="text-foreground">{imposto.nome}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {imposto.descricao}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA ALERTAS */}
        <TabsContent value="alertas" className="space-y-4 mt-6">
          {/* Alertas de Vencimento */}
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <CardTitle className="text-foreground">Alertas de Vencimento</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Receba avisos sobre datas de vencimento de notas fiscais
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="alertarVencimento" className="text-foreground cursor-pointer">
                    Alertar sobre vencimento de notas
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba avisos alguns dias antes do vencimento
                  </p>
                </div>
                <Switch
                  id="alertarVencimento"
                  checked={configuracaoAlertas.alertarVencimento}
                  onCheckedChange={(checked) => setConfiguracaoAlertas({...configuracaoAlertas, alertarVencimento: checked})}
                />
              </div>

              {configuracaoAlertas.alertarVencimento && (
                <div className="space-y-2 ml-4 p-4 border-l-2 border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 rounded-r-lg">
                  <Label htmlFor="diasAntesVencimento" className="text-foreground">
                    Quantos dias antes do vencimento?
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="diasAntesVencimento"
                      type="number"
                      min="1"
                      max="90"
                      value={configuracaoAlertas.diasAntesVencimento}
                      onChange={(e) => setConfiguracaoAlertas({...configuracaoAlertas, diasAntesVencimento: parseInt(e.target.value) || 1})}
                      className="border-border bg-input-background w-24"
                    />
                    <span className="text-sm text-muted-foreground">dias antes</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="alertarNotasProximasVencimento" className="text-foreground cursor-pointer">
                    Alertar sobre notas próximas ao vencimento
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações para notas que vencem em breve
                  </p>
                </div>
                <Switch
                  id="alertarNotasProximasVencimento"
                  checked={configuracaoAlertas.alertarNotasProximasVencimento}
                  onCheckedChange={(checked) => setConfiguracaoAlertas({...configuracaoAlertas, alertarNotasProximasVencimento: checked})}
                />
              </div>

              {configuracaoAlertas.alertarNotasProximasVencimento && (
                <div className="space-y-2 ml-4 p-4 border-l-2 border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 rounded-r-lg">
                  <Label htmlFor="diasProximoVencimento" className="text-foreground">
                    Considerar "próximo ao vencimento" quando faltar:
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="diasProximoVencimento"
                      type="number"
                      min="1"
                      max="30"
                      value={configuracaoAlertas.diasProximoVencimento}
                      onChange={(e) => setConfiguracaoAlertas({...configuracaoAlertas, diasProximoVencimento: parseInt(e.target.value) || 1})}
                      className="border-border bg-input-background w-24"
                    />
                    <span className="text-sm text-muted-foreground">dias ou menos</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alertas de Status */}
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <CardTitle className="text-foreground">Alertas de Status</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitore mudanças de status e situações críticas
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="alertarNotasVencidas" className="text-foreground cursor-pointer">
                    Alertar sobre notas vencidas
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notificação para notas que já venceram e não foram pagas
                  </p>
                </div>
                <Switch
                  id="alertarNotasVencidas"
                  checked={configuracaoAlertas.alertarNotasVencidas}
                  onCheckedChange={(checked) => setConfiguracaoAlertas({...configuracaoAlertas, alertarNotasVencidas: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="alertarNotasPendentes" className="text-foreground cursor-pointer">
                    Alertar sobre notas pendentes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba avisos sobre notas com pagamento pendente
                  </p>
                </div>
                <Switch
                  id="alertarNotasPendentes"
                  checked={configuracaoAlertas.alertarNotasPendentes}
                  onCheckedChange={(checked) => setConfiguracaoAlertas({...configuracaoAlertas, alertarNotasPendentes: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="alertarNotasEmitidas" className="text-foreground cursor-pointer">
                    Alertar sobre notas emitidas
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações quando uma nota fiscal for emitida
                  </p>
                </div>
                <Switch
                  id="alertarNotasEmitidas"
                  checked={configuracaoAlertas.alertarNotasEmitidas}
                  onCheckedChange={(checked) => setConfiguracaoAlertas({...configuracaoAlertas, alertarNotasEmitidas: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notificações por Email */}
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <CardTitle className="text-foreground">Notificações por Email</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure o envio de alertas por email (funcionalidade futura)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="notificacoesPorEmail" className="text-foreground cursor-pointer">
                    Enviar notificações por email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba os alertas também no seu email
                  </p>
                </div>
                <Switch
                  id="notificacoesPorEmail"
                  checked={configuracaoAlertas.notificacoesPorEmail}
                  onCheckedChange={(checked) => setConfiguracaoAlertas({...configuracaoAlertas, notificacoesPorEmail: checked})}
                />
              </div>

              {configuracaoAlertas.notificacoesPorEmail && (
                <div className="space-y-2 ml-4 p-4 border-l-2 border-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r-lg">
                  <Label htmlFor="emailNotificacao" className="text-foreground">
                    Email para notificações
                  </Label>
                  <Input
                    id="emailNotificacao"
                    type="email"
                    value={configuracaoAlertas.emailNotificacao}
                    onChange={(e) => setConfiguracaoAlertas({...configuracaoAlertas, emailNotificacao: e.target.value})}
                    placeholder="seu@email.com"
                    className="border-border bg-input-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Funcionalidade disponível após integração com Supabase
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo Visual */}
          <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-foreground">Resumo de Alertas Ativos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  {configuracaoAlertas.alertarVencimento ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-foreground">Alertas de vencimento</span>
                </div>

                <div className="flex items-center gap-2">
                  {configuracaoAlertas.alertarNotasVencidas ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-foreground">Notas vencidas</span>
                </div>

                <div className="flex items-center gap-2">
                  {configuracaoAlertas.alertarNotasPendentes ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-foreground">Notas pendentes</span>
                </div>

                <div className="flex items-center gap-2">
                  {configuracaoAlertas.alertarNotasEmitidas ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-foreground">Notas emitidas</span>
                </div>

                <div className="flex items-center gap-2">
                  {configuracaoAlertas.alertarNotasProximasVencimento ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-foreground">Próximas ao vencimento</span>
                </div>

                <div className="flex items-center gap-2">
                  {configuracaoAlertas.notificacoesPorEmail ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-foreground">Email habilitado</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 space-y-2">
                <p className="text-sm text-foreground">
                  <strong>⏰ Alertar com antecedência de:</strong> {configuracaoAlertas.diasAntesVencimento} dias
                </p>
                <p className="text-sm text-foreground">
                  <strong>🔔 Próximo ao vencimento:</strong> {configuracaoAlertas.diasProximoVencimento} dias ou menos
                </p>
                {configuracaoAlertas.notificacoesPorEmail && configuracaoAlertas.emailNotificacao && (
                  <p className="text-sm text-foreground">
                    <strong>📧 Email:</strong> {configuracaoAlertas.emailNotificacao}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}