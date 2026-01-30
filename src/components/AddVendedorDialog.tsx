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
import { Vendedor } from '../types';

interface AddVendedorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (vendedor: Vendedor) => void;
  vendedor: Vendedor | null;
}

export default function AddVendedorDialog({
  open,
  onOpenChange,
  onSave,
  vendedor,
}: AddVendedorDialogProps) {
  const [formData, setFormData] = useState<Vendedor>({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamento: '',
    dataCadastro: new Date().toISOString().split('T')[0],
    status: 'ativo',
  });
  
  useEffect(() => {
    if (vendedor) {
      setFormData(vendedor);
    } else {
      setFormData({
        id: `v${Date.now()}`,
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        departamento: '',
        dataCadastro: new Date().toISOString().split('T')[0],
        status: 'ativo',
      });
    }
  }, [vendedor, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border bg-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {vendedor ? 'Editar Vendedor' : 'Adicionar Vendedor'}
          </DialogTitle>
          <DialogDescription className="text-sm text-black dark:text-white">
            {vendedor ? 'Faça as alterações necessárias no vendedor.' : 'Adicione um novo vendedor ao sistema.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-foreground">Nome Completo *</Label>
                <Input
                  id="nome"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="border-border bg-input-background text-foreground"
                  placeholder="Nome do vendedor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-border bg-input-background text-foreground"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-foreground">Telefone *</Label>
                <Input
                  id="telefone"
                  required
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="border-border bg-input-background text-foreground"
                  placeholder="(11) 98765-4321"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo" className="text-foreground">Cargo *</Label>
                <Input
                  id="cargo"
                  required
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="border-border bg-input-background text-foreground"
                  placeholder="Ex: Vendedor Pleno"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departamento" className="text-foreground">Departamento *</Label>
                <Input
                  id="departamento"
                  required
                  value={formData.departamento}
                  onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  className="border-border bg-input-background text-foreground"
                  placeholder="Ex: Vendas"
                />
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
              {vendedor ? 'Salvar Alterações' : 'Adicionar Vendedor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}