import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Share2, Mail, MessageSquare, Copy, Check } from 'lucide-react';
import { NotaFiscal } from './NotasFiscais';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface ShareNotaFiscalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nota: NotaFiscal | null;
}

export default function ShareNotaFiscalDialog({
  open,
  onOpenChange,
  nota
}: ShareNotaFiscalDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!nota) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusLabel = (status: NotaFiscal['status']) => {
    const labels = {
      'não emitida': 'Não Emitida',
      'emitida': 'Emitida',
      'conferida': 'Conferida',
      'enviada': 'Enviada',
      'paga': 'Paga'
    };
    return labels[status];
  };

  const generateShareText = () => {
    const text = `
*NOTA FISCAL - ${nota.numero}*

📋 *Detalhes da Nota Fiscal*
━━━━━━━━━━━━━━━━━━━━

🏢 *Cliente:* ${nota.cliente}
👤 *Colaborador:* ${nota.colaboradorNome}
💰 *Valor:* ${formatCurrency(nota.valor)}
📅 *Emissão:* ${formatDate(nota.dataEmissao)}
📆 *Vencimento:* ${formatDate(nota.dataVencimento)}
📊 *Status:* ${getStatusLabel(nota.status)}
🏷️ *Categoria:* ${nota.categoria}

📝 *Descrição:*
${nota.descricao}

${nota.prestadorRazaoSocial ? `
🏭 *Prestador de Serviço:*
${nota.prestadorRazaoSocial}
${nota.prestadorCpfCnpj ? `CPF/CNPJ: ${nota.prestadorCpfCnpj}` : ''}
${nota.prestadorEmail ? `Email: ${nota.prestadorEmail}` : ''}
` : ''}

${nota.tomadorRazaoSocial ? `
🏢 *Tomador de Serviço:*
${nota.tomadorRazaoSocial}
${nota.tomadorCpfCnpj ? `CPF/CNPJ: ${nota.tomadorCpfCnpj}` : ''}
${nota.tomadorEmail ? `Email: ${nota.tomadorEmail}` : ''}
` : ''}

${nota.banco ? `
💳 *Dados para Depósito:*
Banco: ${nota.banco}
${nota.agencia ? `Agência: ${nota.agencia}` : ''}
${nota.contaCorrente ? `Conta: ${nota.contaCorrente}` : ''}
${nota.pix ? `PIX: ${nota.pix}` : ''}
` : ''}

${nota.observacoes ? `
📌 *Observações:*
${nota.observacoes}
` : ''}

━━━━━━━━━━━━━━━━━━━━
📱 Faturamento Novigo
Sistema de Gestão de Notas Fiscais
    `.trim();

    return text;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      toast.success('Informações copiadas para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar informações');
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Nota Fiscal ${nota.numero} - ${nota.cliente}`);
    const body = encodeURIComponent(generateShareText());
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleShareSMS = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`sms:?body=${text}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            Compartilhar Nota Fiscal
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Escolha como deseja compartilhar a nota fiscal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações da nota */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-foreground">{nota.numero}</h3>
                <p className="text-sm text-muted-foreground">{nota.cliente}</p>
              </div>
              <div className="text-right">
                <p className="text-foreground">{formatCurrency(nota.valor)}</p>
                <p className="text-xs text-muted-foreground">{getStatusLabel(nota.status)}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{nota.descricao}</p>
          </div>

          {/* Opções de compartilhamento */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">Escolha como deseja compartilhar:</p>
            
            <Button
              onClick={handleShareWhatsApp}
              className="w-full justify-start bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Compartilhar via WhatsApp
            </Button>

            <Button
              onClick={handleShareEmail}
              className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Compartilhar via Email
            </Button>

            <Button
              onClick={handleShareSMS}
              className="w-full justify-start bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Compartilhar via SMS
            </Button>

            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              className="w-full justify-start border-border hover:bg-muted"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar informações
                </>
              )}
            </Button>
          </div>

          {/* Preview do texto */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Preview da mensagem:</p>
            <div className="bg-muted/20 rounded-lg p-3 border border-border max-h-32 overflow-y-auto">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                {generateShareText()}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}