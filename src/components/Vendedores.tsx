import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Plus, Search, Mail, Phone, Trash2, Edit, Users, TrendingUp } from 'lucide-react';
import AddVendedorDialog from './AddVendedorDialog';
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
import { Vendedor } from '../types';

export default function Vendedores() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVendedor, setEditingVendedor] = useState<Vendedor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadVendedores();
  }, []);

  const loadVendedores = () => {
    const stored = localStorage.getItem('vendedores');
    if (stored) {
      setVendedores(JSON.parse(stored));
    }
  };

  const handleSave = (vendedor: Vendedor) => {
    let updatedVendedores;
    
    if (editingVendedor) {
      updatedVendedores = vendedores.map(v => 
        v.id === vendedor.id ? vendedor : v
      );
    } else {
      updatedVendedores = [...vendedores, vendedor];
    }
    
    localStorage.setItem('vendedores', JSON.stringify(updatedVendedores));
    setVendedores(updatedVendedores);
    setEditingVendedor(null);
  };

  const handleDelete = (id: string) => {
    const updatedVendedores = vendedores.filter(v => v.id !== id);
    localStorage.setItem('vendedores', JSON.stringify(updatedVendedores));
    setVendedores(updatedVendedores);
    setDeleteId(null);
  };

  const handleEdit = (vendedor: Vendedor) => {
    setEditingVendedor(vendedor);
    setIsAddDialogOpen(true);
  };

  const filteredVendedores = vendedores.filter(vendedor =>
    vendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendedor.telefone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalAtivos = vendedores.filter(v => v.status === 'ativo').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-foreground">Vendedores</h2>
          <p className="text-muted-foreground">Gerencie os vendedores da equipe comercial</p>
        </div>
        <Button 
          onClick={() => {
            setEditingVendedor(null);
            setIsAddDialogOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Vendedor
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-border bg-card shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm text-muted-foreground">Total de Vendedores</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl text-foreground">{vendedores.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cadastrados no sistema
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm text-muted-foreground">Vendedores Ativos</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl text-foreground">{totalAtivos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Trabalhando atualmente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border bg-input-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vendedores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVendedores.map((vendedor) => (
          <Card key={vendedor.id} className="border border-border bg-card hover:border-blue-500 hover:shadow-lg transition-all shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="border-2 border-blue-200 dark:border-blue-700">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                      {getInitials(vendedor.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base text-foreground">{vendedor.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">Vendedor</p>
                  </div>
                </div>
                <Badge className={vendedor.status === 'ativo' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'bg-muted text-muted-foreground'}>
                  {vendedor.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Mail className="w-4 h-4" />
                {vendedor.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Phone className="w-4 h-4" />
                {vendedor.telefone}
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground">Cadastro:</span>{' '}
                  {new Date(vendedor.dataCadastro).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  onClick={() => handleEdit(vendedor)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => setDeleteId(vendedor.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVendedores.length === 0 && (
        <Card className="border border-border bg-card shadow-lg">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <p className="text-muted-foreground">Nenhum vendedor encontrado</p>
          </CardContent>
        </Card>
      )}

      <AddVendedorDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSave}
        vendedor={editingVendedor}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir este vendedor? Esta ação não pode ser desfeita.
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
