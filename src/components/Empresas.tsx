import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Plus, Search, Mail, Phone, Trash2, Edit, Building2, TrendingUp, User } from 'lucide-react';
import AddEmpresaDialog from './AddEmpresaDialog';
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
import { Empresa } from '../types';

export default function Empresas({ currentUser }: { currentUser?: any }) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = () => {
    const stored = localStorage.getItem('empresas');
    if (stored) {
      setEmpresas(JSON.parse(stored));
    }
  };

  const handleSave = (empresa: Empresa) => {
    let updatedEmpresas;
    
    if (editingEmpresa) {
      updatedEmpresas = empresas.map(e => 
        e.id === empresa.id ? empresa : e
      );
    } else {
      updatedEmpresas = [...empresas, empresa];
    }
    
    localStorage.setItem('empresas', JSON.stringify(updatedEmpresas));
    setEmpresas(updatedEmpresas);
    setEditingEmpresa(null);
  };

  const handleDelete = (id: string) => {
    const updatedEmpresas = empresas.filter(e => e.id !== id);
    localStorage.setItem('empresas', JSON.stringify(updatedEmpresas));
    setEmpresas(updatedEmpresas);
    setDeleteId(null);
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setIsAddDialogOpen(true);
  };

  const filteredEmpresas = empresas.filter(empresa => {
    const matchesSearch = 
      empresa.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.cnae.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.gestorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.gestorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.vendedorNome.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Se for comercial, filtrar apenas suas empresas
    const matchesUser = !currentUser || currentUser.tipo === 'admin' || empresa.vendedorId === currentUser.id;
    
    return matchesSearch && matchesUser;
  });

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalAtivas = empresas.filter(e => e.status === 'ativa').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-foreground">Empresas</h2>
          <p className="text-muted-foreground">Gerencie as empresas parceiras e clientes</p>
        </div>
        <Button 
          onClick={() => {
            setEditingEmpresa(null);
            setIsAddDialogOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Empresa
        </Button>
      </div>

      {/* Cards de Resumo - Apenas para admin */}
      {currentUser?.tipo !== 'user' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border border-border bg-card shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm text-muted-foreground">Total de Empresas</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl text-foreground">{empresas.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cadastradas no sistema
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm text-muted-foreground">Empresas Ativas</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl text-foreground">{totalAtivas}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Com contrato vigente
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Busca */}
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, CNAE, categoria, gestor ou vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border bg-input-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Empresas */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredEmpresas.map((empresa) => (
          <Card key={empresa.id} className="border border-border bg-card hover:border-blue-500 hover:shadow-lg transition-all shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="border-2 border-blue-200 dark:border-blue-700 w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                      {getInitials(empresa.nomeCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base text-foreground">{empresa.nomeCompleto}</CardTitle>
                    <p className="text-sm text-muted-foreground">CNAE: {empresa.cnae}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <Badge className={empresa.status === 'ativa' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'bg-muted text-muted-foreground'}>
                    {empresa.status}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    {empresa.categoria}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted/50 dark:bg-muted/20 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-foreground">Gestor: {empresa.gestorNome}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Mail className="w-4 h-4 text-blue-500" />
                  {empresa.gestorEmail}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Phone className="w-4 h-4 text-blue-500" />
                  {empresa.gestorTelefone}
                </div>
              </div>
              
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground">Vendedor Responsável:</span> {empresa.vendedorNome}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-foreground">Cadastro:</span>{' '}
                  {new Date(empresa.dataCadastro).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  onClick={() => handleEdit(empresa)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => setDeleteId(empresa.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmpresas.length === 0 && (
        <Card className="border border-border bg-card shadow-lg">
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <p className="text-muted-foreground">Nenhuma empresa encontrada</p>
          </CardContent>
        </Card>
      )}

      <AddEmpresaDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSave}
        empresa={editingEmpresa}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
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