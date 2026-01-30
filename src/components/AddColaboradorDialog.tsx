import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Colaborador } from './Colaboradores';

interface AddColaboradorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (colaborador: Colaborador) => void;
  colaborador?: Colaborador | null;
  currentUser?: any;
}

export default function AddColaboradorDialog({
  open,
  onOpenChange,
  onSave,
  colaborador,
  currentUser
}: AddColaboradorDialogProps) {
  const [vendedores, setVendedores] = useState<Colaborador[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [gerentes, setGerentes] = useState<Colaborador[]>([]);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Colaborador>({
    defaultValues: colaborador || {
      id: '',
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      departamento: '',
      status: 'ativo',
      dataAdmissao: new Date().toISOString().split('T')[0],
      tipo: 'vendedor',
      empresa: '',
      empresaId: '',
      nomeChefe: '',
      telefoneGerente: '',
      emailGerente: '',
      responsavel: '',
      gerenteResponsavel: ''
    }
  });

  const status = watch('status');
  const tipo = watch('tipo');
  const responsavel = watch('responsavel');
  const empresaId = watch('empresaId');
  const gerenteResponsavel = watch('gerenteResponsavel');

  // Carregar lista de vendedores, gerentes e empresas
  useEffect(() => {
    const colaboradoresStr = localStorage.getItem('colaboradores');
    if (colaboradoresStr) {
      const todosColaboradores = JSON.parse(colaboradoresStr) as Colaborador[];
      const listaVendedores = todosColaboradores.filter(c => c.tipo === 'vendedor' && c.status === 'ativo');
      setVendedores(listaVendedores);
      
      // Lista de gerentes: todos os colaboradores ativos (pode ser vendedor ou colaborador)
      const listaGerentes = todosColaboradores.filter(c => c.status === 'ativo');
      setGerentes(listaGerentes);
    }
    
    const empresasStr = localStorage.getItem('empresas');
    if (empresasStr) {
      const todasEmpresas = JSON.parse(empresasStr);
      setEmpresas(todasEmpresas);
    }
  }, [open]);

  useEffect(() => {
    if (colaborador) {
      reset(colaborador);
    } else {
      reset({
        id: '',
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        departamento: '',
        status: 'ativo',
        dataAdmissao: new Date().toISOString().split('T')[0],
        tipo: currentUser?.tipo === 'user' ? 'colaborador' : 'vendedor'
      });
    }
  }, [colaborador, reset, open, currentUser]);

  const onSubmit = (data: Colaborador) => {
    const colaboradorData = {
      ...data,
      id: colaborador?.id || Date.now().toString()
    };
    onSave(colaboradorData);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            {colaborador ? 'Editar Colaborador' : 'Adicionar Colaborador'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha os dados do colaborador abaixo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Mostrar campo Tipo apenas para admin */}
            {currentUser?.tipo !== 'user' && (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="tipo" className="text-foreground">Tipo *</Label>
                <Select
                  value={tipo}
                  onValueChange={(value) => setValue('tipo', value as 'vendedor' | 'colaborador')}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2 col-span-2">
              <Label htmlFor="nome" className="text-foreground">Nome completo *</Label>
              <Input
                id="nome"
                {...register('nome', { required: 'Nome é obrigatório' })}
                placeholder="Digite o nome completo"
                className="border-border bg-input-background"
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                placeholder="email@empresa.com"
                className="border-border bg-input-background"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-foreground">Telefone *</Label>
              <Input
                id="telefone"
                {...register('telefone', { required: 'Telefone é obrigatório' })}
                placeholder="(11) 98765-4321"
                className="border-border bg-input-background"
              />
              {errors.telefone && (
                <p className="text-sm text-destructive">{errors.telefone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo" className="text-foreground">Cargo *</Label>
              <Input
                id="cargo"
                {...register('cargo', { required: 'Cargo é obrigatório' })}
                placeholder="Ex: Gerente de Vendas"
                className="border-border bg-input-background"
              />
              {errors.cargo && (
                <p className="text-sm text-destructive">{errors.cargo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departamento" className="text-foreground">Departamento *</Label>
              <Input
                id="departamento"
                {...register('departamento', { required: 'Departamento é obrigatório' })}
                placeholder="Ex: Comercial"
                className="border-border bg-input-background"
              />
              {errors.departamento && (
                <p className="text-sm text-destructive">{errors.departamento.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataAdmissao" className="text-foreground">Data de Admissão *</Label>
              <Input
                id="dataAdmissao"
                type="date"
                {...register('dataAdmissao', { required: 'Data é obrigatória' })}
                className="border-border bg-input-background"
              />
              {errors.dataAdmissao && (
                <p className="text-sm text-destructive">{errors.dataAdmissao.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-foreground">Status *</Label>
              <Select
                value={status}
                onValueChange={(value) => setValue('status', value as 'ativo' | 'inativo')}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo responsável para colaboradores */}
            {tipo === 'colaborador' && (
              <>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="empresaId" className="text-foreground">Empresa *</Label>
                  <Select
                    value={empresaId}
                    onValueChange={(value) => setValue('empresaId', value)}
                  >
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas.map(empresa => (
                        <SelectItem key={empresa.id} value={empresa.id}>{empresa.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsavel" className="text-foreground">Vendedor Responsável</Label>
                  <Select
                    value={responsavel}
                    onValueChange={(value) => setValue('responsavel', value)}
                  >
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendedores.map(vendedor => (
                        <SelectItem key={vendedor.id} value={vendedor.nome}>{vendedor.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gerenteResponsavel" className="text-foreground">Gestor Responsável</Label>
                  <Select
                    value={gerenteResponsavel}
                    onValueChange={(value) => setValue('gerenteResponsavel', value)}
                  >
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Selecione o gestor responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {gerentes.map(gerente => (
                        <SelectItem key={gerente.id} value={gerente.nome}>{gerente.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Separador visual */}
            {tipo === 'vendedor' && (
              <div className="col-span-2 border-t border-border pt-4 mt-2">
                <h3 className="text-foreground mb-4">Informações da Empresa</h3>
              </div>
            )}

            {/* Novos campos para vendedores */}
            {tipo === 'vendedor' && (
              <>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="empresaId" className="text-foreground">Nome da Empresa</Label>
                  <Select
                    value={empresaId}
                    onValueChange={(value) => setValue('empresaId', value)}
                  >
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas.map(empresa => (
                        <SelectItem key={empresa.id} value={empresa.id}>{empresa.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeChefe" className="text-foreground">Nome do Gerente</Label>
                  <Input
                    id="nomeChefe"
                    {...register('nomeChefe')}
                    placeholder="Digite o nome do gerente"
                    className="border-border bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefoneGerente" className="text-foreground">Telefone do Gerente</Label>
                  <Input
                    id="telefoneGerente"
                    {...register('telefoneGerente')}
                    placeholder="(11) 98765-4321"
                    className="border-border bg-input-background"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="emailGerente" className="text-foreground">Email do Gerente</Label>
                  <Input
                    id="emailGerente"
                    type="email"
                    {...register('emailGerente', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    placeholder="gerente@empresa.com"
                    className="border-border bg-input-background"
                  />
                  {errors.emailGerente && (
                    <p className="text-sm text-destructive">{errors.emailGerente.message}</p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="gerenteResponsavel" className="text-foreground">Gerente Responsável</Label>
                  <Select
                    value={gerenteResponsavel}
                    onValueChange={(value) => setValue('gerenteResponsavel', value)}
                  >
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Selecione o gerente responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {gerentes.map(gerente => (
                        <SelectItem key={gerente.id} value={gerente.nome}>{gerente.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {colaborador ? 'Salvar Alterações' : 'Adicionar Colaborador'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}