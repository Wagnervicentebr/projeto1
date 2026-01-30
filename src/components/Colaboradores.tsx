import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Plus, Search, Mail, Phone, Trash2, Edit, Users, Building2 } from 'lucide-react';
import AddColaboradorDialog from './AddColaboradorDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export interface Colaborador {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  status: 'ativo' | 'inativo';
  dataAdmissao: string;
  tipo: 'vendedor' | 'colaborador';
  empresa?: string;
  empresaId?: string; // ID da empresa à qual o colaborador pertence
  nomeChefe?: string;
  telefoneGerente?: string;
  emailGerente?: string;
  responsavel?: string; // Nome do vendedor responsável pelo colaborador
  gerenteResponsavel?: string; // Nome do gerente/gestor responsável pelo colaborador
}

export default function Colaboradores({ currentUser }: { currentUser?: any }) {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadColaboradores();
  }, []);

  const loadColaboradores = () => {
    // Forçar carregamento dos dados mock novos
    const mockData: Colaborador[] = [
      // Vendedores
      {
        id: 'v1',
        nome: 'Luís Santos',
        email: 'luis@novigoIT.com',
        telefone: '(11) 98765-1001',
        cargo: 'Vendedor Sênior',
        departamento: 'Comercial',
        status: 'ativo',
        dataAdmissao: '2022-01-10',
        tipo: 'vendedor'
      },
      {
        id: 'v2',
        nome: 'Fábio Oliveira',
        email: 'fabio@novigoIT.com',
        telefone: '(11) 98765-1002',
        cargo: 'Vendedor Pleno',
        departamento: 'Comercial',
        status: 'ativo',
        dataAdmissao: '2022-03-15',
        tipo: 'vendedor'
      },
      {
        id: 'v3',
        nome: 'Mariana Costa',
        email: 'mariana@novigoIT.com',
        telefone: '(11) 98765-1003',
        cargo: 'Vendedora Sênior',
        departamento: 'Comercial',
        status: 'ativo',
        dataAdmissao: '2022-05-20',
        tipo: 'vendedor'
      },
      {
        id: 'v4',
        nome: 'Ricardo Mendes',
        email: 'ricardo@novigoIT.com',
        telefone: '(11) 98765-1004',
        cargo: 'Vendedor Júnior',
        departamento: 'Comercial',
        status: 'ativo',
        dataAdmissao: '2023-02-10',
        tipo: 'vendedor'
      },
      {
        id: 'v5',
        nome: 'Juliana Silva',
        email: 'juliana@novigoIT.com',
        telefone: '(11) 98765-1005',
        cargo: 'Vendedora Pleno',
        departamento: 'Comercial',
        status: 'ativo',
        dataAdmissao: '2023-06-05',
        tipo: 'vendedor'
      },
      
      // Colaboradores vinculados às empresas
      // Tech Solutions (empresaId: emp1, vendedorId: v1 - Luís)
      {
        id: '1',
        nome: 'Maria Silva',
        email: 'maria@techsolutions.com',
        telefone: '(11) 98765-4321',
        cargo: 'Consultora de Vendas',
        departamento: 'Consultoria',
        status: 'ativo',
        dataAdmissao: '2023-01-15',
        tipo: 'colaborador',
        empresaId: 'emp1'
      },
      {
        id: '2',
        nome: 'João Santos',
        email: 'joao@techsolutions.com',
        telefone: '(11) 98765-4322',
        cargo: 'Desenvolvedor Full Stack',
        departamento: 'TI',
        status: 'ativo',
        dataAdmissao: '2023-02-20',
        tipo: 'colaborador',
        empresaId: 'emp1'
      },
      // Consultoria ABC (empresaId: emp2, vendedorId: v1 - Luís)
      {
        id: '3',
        nome: 'Ana Oliveira',
        email: 'ana@consultoriaabc.com',
        telefone: '(11) 98765-4323',
        cargo: 'Analista Financeira',
        departamento: 'Financeiro',
        status: 'ativo',
        dataAdmissao: '2023-03-10',
        tipo: 'colaborador',
        empresaId: 'emp2'
      },
      // Inovação Digital (empresaId: emp3, vendedorId: v1 - Luís)
      {
        id: '4',
        nome: 'Carlos Mendes',
        email: 'carlos@inovacaodigital.com',
        telefone: '(11) 98765-4324',
        cargo: 'Gerente Comercial',
        departamento: 'Comercial',
        status: 'ativo',
        dataAdmissao: '2023-04-05',
        tipo: 'colaborador',
        empresaId: 'emp3'
      },
      // Empresa Matriz (empresaId: emp4, vendedorId: v2 - Fábio)
      {
        id: '5',
        nome: 'Patricia Costa',
        email: 'patricia@matriz.com',
        telefone: '(11) 98765-4325',
        cargo: 'Designer UX/UI',
        departamento: 'Design',
        status: 'ativo',
        dataAdmissao: '2023-05-12',
        tipo: 'colaborador',
        empresaId: 'emp4'
      },
      {
        id: '9',
        nome: 'Roberto Almeida',
        email: 'roberto@matriz.com',
        telefone: '(11) 98765-4326',
        cargo: 'Analista de Suporte',
        departamento: 'Suporte',
        status: 'ativo',
        dataAdmissao: '2023-07-18',
        tipo: 'colaborador',
        empresaId: 'emp4'
      },
      // Startup Tech (empresaId: emp5, vendedorId: v3 - Mariana)
      {
        id: '10',
        nome: 'Fernanda Lima',
        email: 'fernanda@startup.com',
        telefone: '(11) 98765-4327',
        cargo: 'Coordenadora de RH',
        departamento: 'Recursos Humanos',
        status: 'ativo',
        dataAdmissao: '2023-08-25',
        tipo: 'colaborador',
        empresaId: 'emp5'
      },
      // Novo colaborador
      {
        id: '11',
        nome: 'Lucas Ferreira',
        email: 'lucas@techsolutions.com',
        telefone: '(11) 98765-4328',
        cargo: 'Analista de Marketing',
        departamento: 'Marketing',
        status: 'ativo',
        dataAdmissao: '2023-09-10',
        tipo: 'colaborador',
        empresaId: 'emp1'
      }
    ];
    localStorage.setItem('colaboradores', JSON.stringify(mockData));
    setColaboradores(mockData);
  };

  const handleSave = (colaborador: Colaborador) => {
    let updatedColaboradores;
    
    if (editingColaborador) {
      updatedColaboradores = colaboradores.map(c => 
        c.id === colaborador.id ? colaborador : c
      );
    } else {
      updatedColaboradores = [...colaboradores, colaborador];
    }
    
    localStorage.setItem('colaboradores', JSON.stringify(updatedColaboradores));
    setColaboradores(updatedColaboradores);
    setEditingColaborador(null);
  };

  const handleDelete = (id: string) => {
    const updatedColaboradores = colaboradores.filter(c => c.id !== id);
    localStorage.setItem('colaboradores', JSON.stringify(updatedColaboradores));
    setColaboradores(updatedColaboradores);
    setDeleteId(null);
  };

  const handleEdit = (colaborador: Colaborador) => {
    setEditingColaborador(colaborador);
    setIsAddDialogOpen(true);
  };

  const filteredColaboradores = colaboradores.filter(colaborador => {
    // SEMPRE EXCLUIR VENDEDORES - mostrar apenas colaboradores
    if (colaborador.tipo === 'vendedor') {
      return false;
    }

    const matchesSearch =
      colaborador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colaborador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colaborador.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colaborador.departamento.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Se for comercial, mostrar APENAS colaboradores das suas empresas
    if (currentUser && currentUser.tipo === 'user') {
      const stored = localStorage.getItem('empresas');
      const empresas = stored ? JSON.parse(stored) : [];
      
      const empresasDoVendedor = empresas
        .filter((emp: any) => emp.vendedorId === currentUser.id)
        .map((emp: any) => emp.id);
      
      const pertenceASuasEmpresas = colaborador.empresaId ? empresasDoVendedor.includes(colaborador.empresaId) : false;
      
      return matchesSearch && pertenceASuasEmpresas;
    }
    
    return matchesSearch;
  });

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getEmpresaNome = (empresaId?: string) => {
    if (!empresaId) return 'Não vinculado';
    const stored = localStorage.getItem('empresas');
    if (!stored) return 'Empresa não encontrada';
    const empresas = JSON.parse(stored);
    const empresa = empresas.find((emp: any) => emp.id === empresaId);
    return empresa ? empresa.nome : 'Empresa não encontrada';
  };

  const totalColaboradores = colaboradores.filter(c => c.tipo === 'colaborador').length;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-foreground">Colaboradores</h2>
          <p className="text-muted-foreground">Gerencie os colaboradores cadastrados</p>
        </div>
        <Button 
          onClick={() => {
            setEditingColaborador(null);
            setIsAddDialogOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Colaborador
        </Button>
      </div>

      {/* Card de Resumo */}
      <Card className="border border-border bg-card shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-2 relative">
          <CardTitle className="text-sm text-muted-foreground">Total de Colaboradores</CardTitle>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Users className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative pb-2">
          <div className="text-xl text-foreground">{totalColaboradores}</div>
          <p className="text-xs text-muted-foreground">
            Colaboradores cadastrados no sistema
          </p>
        </CardContent>
      </Card>

      {/* Busca */}
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="pt-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email, cargo ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border bg-input-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Colaboradores */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-foreground">Lista de Colaboradores</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          {filteredColaboradores.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-foreground py-0.5">Nome</TableHead>
                    <TableHead className="text-foreground py-0.5">Email</TableHead>
                    <TableHead className="text-foreground py-0.5">Telefone</TableHead>
                    <TableHead className="text-foreground py-0.5">Cargo</TableHead>
                    <TableHead className="text-foreground py-0.5">Departamento</TableHead>
                    <TableHead className="text-foreground py-0.5">Empresa</TableHead>
                    <TableHead className="text-foreground py-0.5">Status</TableHead>
                    <TableHead className="text-right text-foreground py-0.5">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredColaboradores.map((colaborador) => (
                    <TableRow key={colaborador.id} className="border-border">
                      <TableCell className="py-0.5">
                        <div className="flex items-center gap-2">
                          <Avatar className="border-2 border-blue-200 dark:border-blue-700 w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs">
                              {getInitials(colaborador.nome)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-foreground">{colaborador.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground py-0.5">{colaborador.email}</TableCell>
                      <TableCell className="text-foreground py-0.5">{colaborador.telefone}</TableCell>
                      <TableCell className="text-foreground py-0.5">{colaborador.cargo}</TableCell>
                      <TableCell className="text-foreground py-0.5">{colaborador.departamento}</TableCell>
                      <TableCell className="text-foreground py-0.5">
                        <span className="truncate max-w-[150px]">{getEmpresaNome(colaborador.empresaId)}</span>
                      </TableCell>
                      <TableCell className="py-0.5">
                        <Badge className={colaborador.status === 'ativo' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'bg-muted text-muted-foreground'}>
                          {colaborador.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-0.5">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            onClick={() => handleEdit(colaborador)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            onClick={() => setDeleteId(colaborador.id)}
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <p className="text-muted-foreground">Nenhum colaborador encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddColaboradorDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSave}
        colaborador={editingColaborador}
        currentUser={currentUser}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-muted">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}