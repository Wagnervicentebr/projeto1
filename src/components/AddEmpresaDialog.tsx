import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Empresa, Vendedor, configuracoesPadrao } from '../types';

interface GestorAdicional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface AddEmpresaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (empresa: Empresa) => void;
  empresa: Empresa | null;
}

export default function AddEmpresaDialog({
  open,
  onOpenChange,
  onSave,
  empresa,
}: AddEmpresaDialogProps) {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [gestoresAdicionais, setGestoresAdicionais] = useState<GestorAdicional[]>([]);
  const [formData, setFormData] = useState<Empresa>({
    id: '',
    nomeCompleto: '',
    cnae: '',
    gestorNome: '',
    gestorEmail: '',
    gestorTelefone: '',
    vendedorId: '',
    vendedorNome: '',
    categoria: '',
    status: 'ativa',
    dataCadastro: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const stored = localStorage.getItem('vendedores');
    if (stored) {
      setVendedores(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (empresa) {
      setFormData(empresa);
      setGestoresAdicionais([]);
    } else {
      setFormData({
        id: `e${Date.now()}`,
        nomeCompleto: '',
        cnae: '',
        gestorNome: '',
        gestorEmail: '',
        gestorTelefone: '',
        vendedorId: '',
        vendedorNome: '',
        categoria: '',
        status: 'ativa',
        dataCadastro: new Date().toISOString().split('T')[0],
      });
      setGestoresAdicionais([]);
    }
  }, [empresa, open]);

  const handleVendedorChange = (vendedorId: string) => {
    const vendedor = vendedores.find(v => v.id === vendedorId);
    if (vendedor) {
      setFormData({
        ...formData,
        vendedorId: vendedor.id,
        vendedorNome: vendedor.nome,
      });
    }
  };

  const adicionarGestor = () => {
    const novoGestor: GestorAdicional = {
      id: `g${Date.now()}`,
      nome: '',
      email: '',
      telefone: '',
    };
    setGestoresAdicionais([...gestoresAdicionais, novoGestor]);
  };

  const removerGestor = (id: string) => {
    setGestoresAdicionais(gestoresAdicionais.filter(g => g.id !== id));
  };

  const atualizarGestor = (id: string, field: keyof GestorAdicional, value: string) => {
    setGestoresAdicionais(gestoresAdicionais.map(g => 
      g.id === id ? { ...g, [field]: value } : g
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border bg-card max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {empresa ? 'Editar Empresa' : 'Adicionar Empresa'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {empresa ? 'Atualize os detalhes da empresa' : 'Insira os detalhes da nova empresa'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Dados da Empresa */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Dados da Empresa</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="nomeCompleto" className="text-foreground">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    required
                    value={formData.nomeCompleto}
                    onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="Nome completo da empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnae" className="text-foreground">Código CNAE *</Label>
                  <Input
                    id="cnae"
                    required
                    value={formData.cnae}
                    onChange={(e) => setFormData({ ...formData, cnae: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="0000-0/00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-foreground">Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger className="border-border bg-input-background text-foreground">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {configuracoesPadrao.categoriasEmpresas.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Dados do Gestor */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Dados do Gestor Cliente</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={adicionarGestor}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Gestor
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gestorNome" className="text-foreground">Nome do Gestor *</Label>
                  <Input
                    id="gestorNome"
                    required
                    value={formData.gestorNome}
                    onChange={(e) => setFormData({ ...formData, gestorNome: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="Nome do gestor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gestorEmail" className="text-foreground">E-mail do Gestor *</Label>
                  <Input
                    id="gestorEmail"
                    type="email"
                    required
                    value={formData.gestorEmail}
                    onChange={(e) => setFormData({ ...formData, gestorEmail: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gestorTelefone" className="text-foreground">Telefone do Gestor *</Label>
                  <Input
                    id="gestorTelefone"
                    required
                    value={formData.gestorTelefone}
                    onChange={(e) => setFormData({ ...formData, gestorTelefone: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>
              {gestoresAdicionais.map(gestor => (
                <div key={gestor.id} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`gestorNome-${gestor.id}`} className="text-foreground">Nome do Gestor</Label>
                    <Input
                      id={`gestorNome-${gestor.id}`}
                      value={gestor.nome}
                      onChange={(e) => atualizarGestor(gestor.id, 'nome', e.target.value)}
                      className="border-border bg-input-background text-foreground"
                      placeholder="Nome do gestor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gestorEmail-${gestor.id}`} className="text-foreground">E-mail do Gestor</Label>
                    <Input
                      id={`gestorEmail-${gestor.id}`}
                      type="email"
                      value={gestor.email}
                      onChange={(e) => atualizarGestor(gestor.id, 'email', e.target.value)}
                      className="border-border bg-input-background text-foreground"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gestorTelefone-${gestor.id}`} className="text-foreground">Telefone do Gestor</Label>
                    <Input
                      id={`gestorTelefone-${gestor.id}`}
                      value={gestor.telefone}
                      onChange={(e) => atualizarGestor(gestor.id, 'telefone', e.target.value)}
                      className="border-border bg-input-background text-foreground"
                      placeholder="(11) 98765-4321"
                    />
                  </div>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => removerGestor(gestor.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remover Gestor
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dados Cadastrais (Prestador) */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground">Dados Cadastrais (Prestador)</h3>
              <p className="text-xs text-muted-foreground">Estes dados serão usados automaticamente nas notas fiscais</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razaoSocial" className="text-foreground">Razão Social</Label>
                  <Input
                    id="razaoSocial"
                    value={formData.razaoSocial || ''}
                    onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="NOVIGO TECNOLOGIA DA INFORMAÇÃO S.A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-foreground">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj || ''}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="41.512.775/0001-23"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inscricaoMunicipal" className="text-foreground">Inscrição Municipal</Label>
                  <Input
                    id="inscricaoMunicipal"
                    value={formData.inscricaoMunicipal || ''}
                    onChange={(e) => setFormData({ ...formData, inscricaoMunicipal: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="8.313.969-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inscricaoEstadual" className="text-foreground">Inscrição Estadual</Label>
                  <Input
                    id="inscricaoEstadual"
                    value={formData.inscricaoEstadual || ''}
                    onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="149.239.477.119"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="endereco" className="text-foreground">Endereço Completo</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco || ''}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="AV. BRIG. FARIA LIMA, 1234 - 11º ANDAR - JARDIM PAULISTANO"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep" className="text-foreground">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep || ''}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="01451-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="municipio" className="text-foreground">Município</Label>
                  <Input
                    id="municipio"
                    value={formData.municipio || ''}
                    onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="São Paulo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uf" className="text-foreground">UF</Label>
                  <Input
                    id="uf"
                    value={formData.uf || ''}
                    onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email da Empresa</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="contato@novigo.com.br"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-foreground">Telefone da Empresa</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone || ''}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                    placeholder="(11) 3456-7890"
                  />
                </div>
              </div>
            </div>

            {/* Dados Adicionais */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground">Dados Adicionais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendedor" className="text-foreground">Vendedor Responsável *</Label>
                  <Select
                    value={formData.vendedorId}
                    onValueChange={handleVendedorChange}
                  >
                    <SelectTrigger className="border-border bg-input-background text-foreground">
                      <SelectValue placeholder="Selecione o vendedor" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {vendedores.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataCadastro" className="text-foreground">Data de Cadastro *</Label>
                  <Input
                    id="dataCadastro"
                    type="date"
                    required
                    value={formData.dataCadastro}
                    onChange={(e) => setFormData({ ...formData, dataCadastro: e.target.value })}
                    className="border-border bg-input-background text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-foreground">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'ativa' | 'inativa') =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="border-border bg-input-background text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="inativa">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              {empresa ? 'Salvar Alterações' : 'Adicionar Empresa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}