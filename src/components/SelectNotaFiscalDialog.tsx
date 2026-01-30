import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Download, Printer, FileText, Share2 } from 'lucide-react';
import { NotaFiscal } from './NotasFiscais';

interface SelectNotaFiscalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notas: NotaFiscal[];
  onDownload: (nota: NotaFiscal) => void;
  onPrint: (nota: NotaFiscal) => void;
  onShare: (nota: NotaFiscal) => void;
}

export default function SelectNotaFiscalDialog({
  open,
  onOpenChange,
  notas,
  onDownload,
  onPrint,
  onShare
}: SelectNotaFiscalDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotas = notas.filter(nota => 
    nota.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nota.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nota.colaboradorNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: NotaFiscal['status']) => {
    const variants = {
      'não emitida': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      'emitida': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'conferida': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'enviada': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'paga': 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
    };

    const labels = {
      'não emitida': 'Não Emitida',
      'emitida': 'Emitida',
      'conferida': 'Conferida',
      'enviada': 'Enviada',
      'paga': 'Paga'
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const handleAction = (nota: NotaFiscal, action: 'download' | 'print' | 'share') => {
    if (action === 'download') {
      onDownload(nota);
    } else if (action === 'print') {
      onPrint(nota);
    } else {
      onShare(nota);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col border border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">Selecionar Nota Fiscal para Emitir</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Selecione uma nota fiscal para baixar, imprimir ou compartilhar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
          {/* Campo de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
            <Input
              placeholder="Buscar por número, cliente ou colaborador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border bg-input-background"
            />
          </div>

          {/* Lista de notas */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {filteredNotas.length > 0 ? (
              filteredNotas.map((nota) => (
                <div
                  key={nota.id}
                  className="border border-border rounded-lg p-6 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {/* Cabeçalho da nota */}
                  <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-border">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-foreground mb-1">
                          {nota.status === 'não emitida' ? '(Não Emitida)' : nota.numero}
                        </h3>
                        <p className="text-sm text-muted-foreground">{nota.descricao}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(nota.status)}
                    </div>
                  </div>
                  
                  {/* Informações detalhadas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                    <div className="bg-background/50 rounded-md p-3 border border-border/50">
                      <span className="text-xs text-muted-foreground block mb-1.5">Cliente</span>
                      <p className="text-foreground text-sm truncate">{nota.cliente}</p>
                    </div>
                    <div className="bg-background/50 rounded-md p-3 border border-border/50">
                      <span className="text-xs text-muted-foreground block mb-1.5">Colaborador</span>
                      <p className="text-foreground text-sm truncate">{nota.colaboradorNome}</p>
                    </div>
                    <div className="bg-background/50 rounded-md p-3 border border-border/50">
                      <span className="text-xs text-muted-foreground block mb-1.5">Valor</span>
                      <p className="text-foreground text-sm">{formatCurrency(nota.valor)}</p>
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800 flex-1 min-w-[120px]"
                      onClick={() => handleAction(nota, 'download')}
                      title="Baixar JSON"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800 flex-1 min-w-[120px]"
                      onClick={() => handleAction(nota, 'print')}
                      title="Imprimir"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20 border-orange-200 dark:border-orange-800 flex-1 min-w-[120px]"
                      onClick={() => handleAction(nota, 'share')}
                      title="Compartilhar"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-blue-500 mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'Nenhuma nota fiscal encontrada' : 'Nenhuma nota fiscal disponível'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}