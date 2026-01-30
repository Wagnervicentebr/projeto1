import { Plus, Search, FileText, Trash2, Edit, Download, ArrowLeft, Building2, TrendingUp, DollarSign, Printer, Save, Share2 } from 'lucide-react';
import AddNotaFiscalDialog from './AddNotaFiscalDialog';
import SelectNotaFiscalDialog from './SelectNotaFiscalDialog';
import ShareNotaFiscalDialog from './ShareNotaFiscalDialog';
import { generatePrintHTML } from './NotaFiscalPrintTemplate';
import { mockNotasFiscais } from '../data/notasFiscaisMock';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export interface NotaFiscal {
  id: string;
  numero: string;
  codigoVerificacao?: string;
  cliente: string;
  colaboradorId: string;
  colaboradorNome: string;
  valor: number;
  dataEmissao: string;
  dataVencimento: string;
  dataEnvio?: string;
  status: 'não emitida' | 'emitida' | 'conferida' | 'enviada' | 'paga';
  descricao: string;
  categoria: string;
  
  // Prestador de Serviço
  prestadorRazaoSocial?: string;
  prestadorCpfCnpj?: string;
  prestadorInscricaoEstadual?: string;
  prestadorInscricaoMunicipal?: string;
  prestadorEndereco?: string;
  prestadorMunicipio?: string;
  prestadorUf?: string;
  prestadorEmail?: string;
  
  // Tomador de Serviço
  tomadorRazaoSocial?: string;
  tomadorCpfCnpj?: string;
  tomadorInscricaoEstadual?: string;
  tomadorInscricaoMunicipal?: string;
  tomadorEndereco?: string;
  tomadorMunicipio?: string;
  tomadorUf?: string;
  tomadorEmail?: string;
  
  // Dados Bancários
  banco?: string;
  agencia?: string;
  contaCorrente?: string;
  pix?: string;
  
  // Impostos e Valores
  valorInss?: number;
  valorIrrf?: number;
  valorCsll?: number;
  valorCofins?: number;
  valorPis?: number;
  codigoServico?: string;
  valorDeducoes?: number;
  baseCalculo?: number;
  aliquota?: number;
  valorIss?: number;
  valorCredito?: number;
  
  // Outras Informações
  municipioPrestacao?: string;
  numeroInscricaoObra?: string;
  valorAproximadoTributos?: number;
  observacoes?: string;
}

export default function NotasFiscais({ currentUser }: { currentUser?: any }) {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareNota, setShareNota] = useState<NotaFiscal | null>(null);
  const [editingNota, setEditingNota] = useState<NotaFiscal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null);

  useEffect(() => {
    loadNotas();
  }, []);

  const loadNotas = () => {
    const stored = localStorage.getItem('notasFiscais');
    if (stored) {
      const data = JSON.parse(stored);
      // Migrar dados antigos se necessário
      const migrated = data.map((n: any) => {
        // Converter status antigos para novos
        let newStatus = n.status;
        if (n.status === 'vencida' || n.status === 'pendente') {
          newStatus = 'não emitida';
        }
        
        // Atualizar notas específicas para "conferida"
        if (n.numero === 'NF-2024-003' || n.numero === 'NF-2024-007' || 
            n.numero === 'NF-2024-008' || n.numero === 'NF-2024-012') {
          newStatus = 'conferida';
        }
        
        return {
          ...n,
          status: newStatus,
          dataEnvio: n.dataEnvio || undefined
        };
      });
      setNotas(migrated);
      localStorage.setItem('notasFiscais', JSON.stringify(migrated));
    } else {
      // Dados iniciais mock - carregados do arquivo separado
      localStorage.setItem('notasFiscais', JSON.stringify(mockNotasFiscais));
      setNotas(mockNotasFiscais);
    }
  };

  const handleSave = (nota: NotaFiscal) => {
    let updatedNotas;
    
    if (editingNota) {
      updatedNotas = notas.map(n => 
        n.id === nota.id ? nota : n
      );
    } else {
      updatedNotas = [...notas, nota];
    }
    
    localStorage.setItem('notasFiscais', JSON.stringify(updatedNotas));
    setNotas(updatedNotas);
    setEditingNota(null);
  };

  const handleDelete = (id: string) => {
    const updatedNotas = notas.filter(n => n.id !== id);
    localStorage.setItem('notasFiscais', JSON.stringify(updatedNotas));
    setNotas(updatedNotas);
    setDeleteId(null);
  };

  const handleEdit = (nota: NotaFiscal) => {
    setEditingNota(nota);
    setIsAddDialogOpen(true);
  };

  const handleStatusChange = (notaId: string, newStatus: NotaFiscal['status']) => {
    const updatedNotas = notas.map(n =>
      n.id === notaId ? { ...n, status: newStatus } : n
    );
    localStorage.setItem('notasFiscais', JSON.stringify(updatedNotas));
    setNotas(updatedNotas);
  };

  const handleDownloadNota = (nota: NotaFiscal) => {
    // Criar objeto com todas as informações da nota
    const notaCompleta = {
      ...nota,
      dataExportacao: new Date().toISOString()
    };

    // Converter para JSON formatado
    const dataStr = JSON.stringify(notaCompleta, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Criar link de download
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${nota.numero.replace(/\//g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintNota = (nota: NotaFiscal) => {
    // Criar janela de impressão com layout formatado
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = generatePrintHTML(nota);
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Aguardar o carregamento e imprimir
    printWindow.onload = function() {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  const handlePrintNotaOLD_BACKUP = (nota: NotaFiscal) => {
    // CÓDIGO ANTIGO - REMOVIDO
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formatCurrencyForPrint = (value?: number) => {
      if (!value) return 'R$ 0,00';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    const formatDateForPrint = (date?: string) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('pt-BR');
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nota Fiscal ${nota.numero}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            background: white;
            color: #000;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            color: #2563eb;
            font-size: 28px;
            margin-bottom: 10px;
          }
          
          .header p {
            color: #666;
            font-size: 14px;
          }
          
          .section {
            margin-bottom: 25px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            background: #f9fafb;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2563eb;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          
          .info-item {
            margin-bottom: 10px;
          }
          
          .info-label {
            font-weight: bold;
            color: #374151;
            font-size: 12px;
            text-transform: uppercase;
            display: block;
            margin-bottom: 5px;
          }
          
          .info-value {
            color: #000;
            font-size: 14px;
          }
          
          .full-width {
            grid-column: 1 / -1;
          }
          
          .status-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .status-paga {
            background: linear-gradient(to right, #2563eb, #1d4ed8);
            color: white;
          }
          
          .status-enviada {
            background: #e9d5ff;
            color: #7c3aed;
          }
          
          .status-conferida {
            background: #d1fae5;
            color: #059669;
          }
          
          .status-emitida {
            background: #dbeafe;
            color: #2563eb;
          }
          

          
          .status-nao-emitida {
            background: #f3f4f6;
            color: #6b7280;
          }
          
          .valores-resumo {
            background: #eff6ff;
            border: 2px solid #2563eb;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
          }
          
          .valores-resumo .info-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
          
          .valor-destaque {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          
          @media print {
            body {
              padding: 20px;
            }
            
            .section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFS-e</h1>
          <p>Faturamento Novigo - Sistema de Gestão de Notas Fiscais</p>
        </div>

        <!-- Informações Básicas -->
        <div class="section">
          <div class="section-title">Informações da Nota Fiscal</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Número da Nota</span>
              <span class="info-value">${nota.numero}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Código de Verificação</span>
              <span class="info-value">${nota.codigoVerificacao || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data de Emissão</span>
              <span class="info-value">${formatDateForPrint(nota.dataEmissao)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data de Vencimento</span>
              <span class="info-value">${formatDateForPrint(nota.dataVencimento)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status</span>
              <span class="status-badge status-${nota.status.replace(/\s/g, '-').replace('ã', 'a')}">${nota.status.toUpperCase()}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Categoria</span>
              <span class="info-value">${nota.categoria || '-'}</span>
            </div>
          </div>
        </div>

        <!-- Prestador de Serviço -->
        ${nota.prestadorRazaoSocial ? `
        <div class="section">
          <div class="section-title">Prestador de Serviço</div>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="info-label">Razão Social</span>
              <span class="info-value">${nota.prestadorRazaoSocial}</span>
            </div>
            <div class="info-item">
              <span class="info-label">CPF/CNPJ</span>
              <span class="info-value">${nota.prestadorCpfCnpj || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Inscrição Municipal</span>
              <span class="info-value">${nota.prestadorInscricaoMunicipal || '-'}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Endereço</span>
              <span class="info-value">${nota.prestadorEndereco || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Município/UF</span>
              <span class="info-value">${nota.prestadorMunicipio || '-'} - ${nota.prestadorUf || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">${nota.prestadorEmail || '-'}</span>
            </div>
          </div>
        </div>
        ` : ''}

        <!-- Tomador de Serviço -->
        <div class="section">
          <div class="section-title">Tomador de Serviço</div>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="info-label">Razão Social</span>
              <span class="info-value">${nota.tomadorRazaoSocial || nota.cliente}</span>
            </div>
            <div class="info-item">
              <span class="info-label">CPF/CNPJ</span>
              <span class="info-value">${nota.tomadorCpfCnpj || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Inscrição Municipal</span>
              <span class="info-value">${nota.tomadorInscricaoMunicipal || '-'}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Endereço</span>
              <span class="info-value">${nota.tomadorEndereco || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Município/UF</span>
              <span class="info-value">${nota.tomadorMunicipio || '-'} - ${nota.tomadorUf || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">${nota.tomadorEmail || '-'}</span>
            </div>
          </div>
        </div>

        <!-- Discriminação dos Serviços -->
        <div class="section">
          <div class="section-title">Discriminação dos Serviços</div>
          <div class="info-item full-width">
            <span class="info-value">${nota.descricao}</span>
          </div>
        </div>

        <!-- Dados Bancários -->
        ${nota.banco ? `
        <div class="section">
          <div class="section-title">Dados para Depósito</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Banco</span>
              <span class="info-value">${nota.banco}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Agência</span>
              <span class="info-value">${nota.agencia || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Conta Corrente</span>
              <span class="info-value">${nota.contaCorrente || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">PIX</span>
              <span class="info-value">${nota.pix || '-'}</span>
            </div>
          </div>
        </div>
        ` : ''}

        <!-- Valores e Impostos -->
        <div class="section">
          <div class="section-title">Valor Total dos Serviços</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">INSS</span>
              <span class="info-value">${formatCurrencyForPrint(nota.valorInss)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">IRRF</span>
              <span class="info-value">${formatCurrencyForPrint(nota.valorIrrf)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">CSLL</span>
              <span class="info-value">${formatCurrencyForPrint(nota.valorCsll)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">COFINS</span>
              <span class="info-value">${formatCurrencyForPrint(nota.valorCofins)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">PIS</span>
              <span class="info-value">${formatCurrencyForPrint(nota.valorPis)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Código do Serviço</span>
              <span class="info-value">${nota.codigoServico || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Valor Total das Deduções</span>
              <span class="info-value">${formatCurrencyForPrint(nota.valorDeducoes)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Base de Cálculo</span>
              <span class="info-value">${formatCurrencyForPrint(nota.baseCalculo)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Alíquota</span>
              <span class="info-value">${nota.aliquota || 0}%</span>
            </div>
            <div class="info-item">
              <span class="info-label">Valor ISS</span>
              <span class="info-value">${formatCurrencyForPrint(nota.valorIss)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Valor Crédito</span>
              <span class="info-value">${formatCurrencyForPrint(nota.valorCredito)}</span>
            </div>
          </div>

          <div class="valores-resumo">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Valor Total</span>
                <span class="valor-destaque">${formatCurrencyForPrint(nota.valor)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Impostos</span>
                <span class="valor-destaque" style="color: #ea580c;">
                  ${formatCurrencyForPrint(
                    (nota.valorInss || 0) + 
                    (nota.valorIrrf || 0) + 
                    (nota.valorCsll || 0) + 
                    (nota.valorCofins || 0) + 
                    (nota.valorPis || 0) + 
                    (nota.valorIss || 0)
                  )}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Valor Líquido</span>
                <span class="valor-destaque" style="color: #059669;">
                  ${formatCurrencyForPrint(
                    nota.valor - (
                      (nota.valorInss || 0) + 
                      (nota.valorIrrf || 0) + 
                      (nota.valorCsll || 0) + 
                      (nota.valorCofins || 0) + 
                      (nota.valorPis || 0) + 
                      (nota.valorIss || 0)
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Outras Informações -->
        ${nota.observacoes || nota.municipioPrestacao ? `
        <div class="section">
          <div class="section-title">Outras Informações</div>
          <div class="info-grid">
            ${nota.municipioPrestacao ? `
            <div class="info-item">
              <span class="info-label">Município da Prestação</span>
              <span class="info-value">${nota.municipioPrestacao}</span>
            </div>
            ` : ''}
            ${nota.numeroInscricaoObra ? `
            <div class="info-item">
              <span class="info-label">Número de Inscrição da Obra</span>
              <span class="info-value">${nota.numeroInscricaoObra}</span>
            </div>
            ` : ''}
            ${nota.valorAproximadoTributos ? `
            <div class="info-item full-width">
              <span class="info-label">Valor Aproximado dos Tributos</span>
              <span class="info-value">${formatCurrencyForPrint(nota.valorAproximadoTributos)}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Percentual de Tributos</span>
              <span class="info-value">${((nota.valorAproximadoTributos / nota.valor) * 100).toFixed(2)}%</span>
            </div>
            ` : ''}
            ${nota.observacoes ? `
            <div class="info-item full-width">
              <span class="info-label">Observações</span>
              <span class="info-value">${nota.observacoes}</span>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
          <p>Faturamento Novigo - Sistema de Gestão de Notas Fiscais</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Aguardar o carregamento e imprimir
    printWindow.onload = function() {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  const filteredNotas = notas.filter(nota => {
    const matchesSearch = 
      nota.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.colaboradorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || nota.status === statusFilter;
    
    // Se for comercial, filtrar apenas suas notas
    const matchesUser = !currentUser || currentUser.tipo === 'admin' || nota.colaboradorId === currentUser.id;
    
    return matchesSearch && matchesStatus && matchesUser;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: NotaFiscal['status'], onStatusChange?: (newStatus: NotaFiscal['status']) => void) => {
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

    if (onStatusChange) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Badge className={`${variants[status]} cursor-pointer hover:opacity-80 transition-opacity`}>
                {labels[status]}
              </Badge>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border border-border bg-card">
            <DropdownMenuItem 
              onClick={() => onStatusChange('não emitida')}
              className="cursor-pointer hover:bg-muted"
            >
              <Badge className={variants['não emitida']}>
                {labels['não emitida']}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange('emitida')}
              className="cursor-pointer hover:bg-muted"
            >
              <Badge className={variants['emitida']}>
                {labels['emitida']}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange('conferida')}
              className="cursor-pointer hover:bg-muted"
            >
              <Badge className={variants['conferida']}>
                {labels['conferida']}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange('enviada')}
              className="cursor-pointer hover:bg-muted"
            >
              <Badge className={variants['enviada']}>
                {labels['enviada']}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange('paga')}
              className="cursor-pointer hover:bg-muted"
            >
              <Badge className={variants['paga']}>
                {labels['paga']}
              </Badge>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const totalNotas = filteredNotas.reduce((sum, nota) => sum + nota.valor, 0);
  const notasNaoEmitidas = filteredNotas.filter(n => n.status === 'não emitida').length;
  const notasEmitidas = filteredNotas.filter(n => n.status === 'emitida').length;
  const notasConferidas = filteredNotas.filter(n => n.status === 'conferida').length;
  const notasEnviadas = filteredNotas.filter(n => n.status === 'enviada').length;
  const notasPagas = filteredNotas.filter(n => n.status === 'paga').length;

  const handleClienteClick = (cliente: string) => {
    setSelectedCliente(cliente);
  };

  const handleBackToList = () => {
    setSelectedCliente(null);
  };

  // Vista detalhada do cliente
  if (selectedCliente) {
    const notasDoCliente = notas.filter(n => n.cliente === selectedCliente);
    const totalCliente = notasDoCliente.reduce((sum, nota) => sum + nota.valor, 0);
    const notasPagasCliente = notasDoCliente.filter(n => n.status === 'paga').length;
    const ticketMedio = notasDoCliente.length > 0 ? totalCliente / notasDoCliente.length : 0;

    // Agrupar por categoria
    const categorias = new Map<string, { total: number; quantidade: number }>();
    notasDoCliente.forEach(nota => {
      const cat = categorias.get(nota.categoria) || { total: 0, quantidade: 0 };
      categorias.set(nota.categoria, {
        total: cat.total + nota.valor,
        quantidade: cat.quantidade + 1
      });
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="border-border hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Lista
          </Button>
          <div>
            <h2 className="text-foreground">{selectedCliente}</h2>
            <p className="text-muted-foreground">Todas as notas fiscais do cliente</p>
          </div>
        </div>

        {/* Cards de resumo do cliente */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-border shadow-lg hover:shadow-xl transition-all bg-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm text-muted-foreground">Total Faturado</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl text-foreground">{formatCurrency(totalCliente)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Em {notasDoCliente.length} nota{notasDoCliente.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-lg hover:shadow-xl transition-all bg-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm text-muted-foreground">Valor Total</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl text-foreground">{formatCurrency(totalCliente)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Soma de todas as notas
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-lg hover:shadow-xl transition-all bg-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm text-muted-foreground">Notas Pagas</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl text-foreground">{notasPagasCliente}</div>
              <p className="text-xs text-muted-foreground mt-1">
                De {notasDoCliente.length} total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Categorias */}
        {categorias.size > 0 && (
          <Card className="border border-border shadow-lg bg-card">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border">
              <CardTitle className="text-card-foreground">Faturamento por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from(categorias.entries()).map(([categoria, data]) => (
                  <Card key={categoria} className="border border-border bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">{categoria}</div>
                      <div className="text-xl text-foreground mt-1">{formatCurrency(data.total)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {data.quantidade} nota{data.quantidade !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de notas do cliente */}
        <Card className="border border-border shadow-lg bg-card">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border">
            <CardTitle className="text-card-foreground">Histórico de Notas Fiscais</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {notasDoCliente.sort((a, b) => new Date(b.dataEmissao).getTime() - new Date(a.dataEmissao).getTime()).map((nota) => (
                <Card key={nota.id} className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <h3 className="text-foreground">{nota.numero}</h3>
                            <p className="text-sm text-muted-foreground">{nota.descricao}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Colaborador:</span>
                            <p className="text-foreground">{nota.colaboradorNome}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Emisso:</span>
                            <p className="text-foreground">{new Date(nota.dataEmissao).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vencimento:</span>
                            <p className="text-foreground">{new Date(nota.dataVencimento).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Categoria:</span>
                            <p className="text-foreground">{nota.categoria}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="text-xl text-foreground">{formatCurrency(nota.valor)}</div>
                        {getStatusBadge(nota.status, (newStatus) => handleStatusChange(nota.id, newStatus))}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            onClick={() => handleEdit(nota)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                            onClick={() => handleDownloadNota(nota)}
                            title="Baixar JSON"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                            onClick={() => handlePrintNota(nota)}
                            title="Imprimir"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
                            onClick={() => setShareNota(nota)}
                            title="Compartilhar"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            onClick={() => setDeleteId(nota.id)}
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <AddNotaFiscalDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={handleSave}
          nota={editingNota}
        />

        <SelectNotaFiscalDialog
          open={isSelectDialogOpen}
          onOpenChange={setIsSelectDialogOpen}
          notas={notas}
          onDownload={handleDownloadNota}
          onPrint={handlePrintNota}
          onShare={(nota) => {
            setShareNota(nota);
            setIsSelectDialogOpen(false);
          }}
        />

        <ShareNotaFiscalDialog
          open={shareNota !== null}
          onOpenChange={(open) => !open && setShareNota(null)}
          nota={shareNota}
        />

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="border border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Tem certeza que deseja excluir esta nota fiscal? Esta ação não pode ser desfeita.
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

  // Vista geral (visão padrão)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-foreground">Notas Fiscais</h2>
          <p className="text-muted-foreground">Gerencie as notas fiscais da empresa</p>
        </div>
        <Button 
          onClick={() => setIsSelectDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <Printer className="w-4 h-4 mr-2" />
          Emitir Nota Fiscal
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-xl mt-1 text-foreground">{formatCurrency(totalNotas)}</div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Não Emitidas</div>
            <div className="text-2xl text-foreground mt-1">{notasNaoEmitidas}</div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Emitidas</div>
            <div className="text-2xl text-foreground mt-1">{notasEmitidas}</div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Conferidas</div>
            <div className="text-2xl text-foreground mt-1">{notasConferidas}</div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Enviadas</div>
            <div className="text-2xl text-foreground mt-1">{notasEnviadas}</div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Pagas</div>
            <div className="text-2xl text-foreground mt-1">{notasPagas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
              <Input
                placeholder="Buscar por número, cliente, colaborador ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border bg-input-background"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="não emitida">Não Emitidas</SelectItem>
                <SelectItem value="emitida">Emitidas</SelectItem>
                <SelectItem value="conferida">Conferidas</SelectItem>
                <SelectItem value="enviada">Enviadas</SelectItem>
                <SelectItem value="paga">Pagas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Notas Fiscais */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Lista de Notas Fiscais</CardTitle>
            <Button
              onClick={() => {
                setEditingNota(null);
                setIsAddDialogOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Nota Fiscal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotas.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-foreground">Número</TableHead>
                    <TableHead className="text-foreground">Cliente</TableHead>
                    {currentUser?.tipo !== 'user' && (
                      <TableHead className="text-foreground">Colaborador</TableHead>
                    )}
                    <TableHead className="text-foreground">Valor</TableHead>
                    <TableHead className="text-foreground">Emissão</TableHead>
                    <TableHead className="text-foreground">Envio</TableHead>
                    <TableHead className="text-foreground">Vencimento</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-right text-foreground">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotas.map((nota) => (
                    <TableRow key={nota.id} className="border-border">
                      <TableCell className="text-foreground">
                        {nota.status === 'não emitida' ? '-' : nota.numero}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleClienteClick(nota.cliente)}
                          className="text-foreground hover:text-blue-600 dark:hover:text-blue-500 underline-offset-4 hover:underline transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Building2 className="w-4 h-4" />
                          {nota.cliente}
                        </button>
                      </TableCell>
                      {currentUser?.tipo !== 'user' && (
                        <TableCell className="text-foreground">{nota.colaboradorNome}</TableCell>
                      )}
                      <TableCell className="text-foreground">{formatCurrency(nota.valor)}</TableCell>
                      <TableCell className="text-foreground">
                        {nota.status === 'não emitida' 
                          ? '-' 
                          : new Date(nota.dataEmissao).toLocaleDateString('pt-BR')
                        }
                      </TableCell>
                      <TableCell className="text-foreground">{nota.dataEnvio 
                          ? new Date(nota.dataEnvio).toLocaleDateString('pt-BR')
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-foreground">
                        {new Date(nota.dataVencimento).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{getStatusBadge(nota.status, (newStatus) => handleStatusChange(nota.id, newStatus))}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            onClick={() => handleEdit(nota)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                            onClick={() => handleDownloadNota(nota)}
                            title="Baixar JSON"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                            onClick={() => handlePrintNota(nota)}
                            title="Imprimir"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
                            onClick={() => setShareNota(nota)}
                            title="Compartilhar"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            onClick={() => setDeleteId(nota.id)}
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
              <FileText className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <p className="text-muted-foreground">Nenhuma nota fiscal encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddNotaFiscalDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSave}
        nota={editingNota}
      />

      <SelectNotaFiscalDialog
        open={isSelectDialogOpen}
        onOpenChange={setIsSelectDialogOpen}
        notas={notas}
        onDownload={handleDownloadNota}
        onPrint={handlePrintNota}
        onShare={(nota) => {
          setShareNota(nota);
          setIsSelectDialogOpen(false);
        }}
      />

      <ShareNotaFiscalDialog
        open={shareNota !== null}
        onOpenChange={(open) => !open && setShareNota(null)}
        nota={shareNota}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir esta nota fiscal? Esta ação não pode ser desfeita.
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