import { NotaFiscal } from '../components/NotasFiscais';

export const mockNotasFiscais: NotaFiscal[] = [
  // NF-2024-001 - PAGA - COMPLETA - MARIA SILVA
  {
    id: '1',
    numero: 'NF-2024-001',
    codigoVerificacao: 'A1B2-C3D4-E5F6',
    cliente: 'Empresa ABC Ltda',
    colaboradorId: '1',
    colaboradorNome: 'Maria Silva',
    valor: 15000,
    dataEmissao: '2024-10-01',
    dataVencimento: '2024-11-01',
    dataEnvio: '2024-10-02',
    status: 'paga',
    descricao: 'Consultoria em vendas - Projeto trimestral de reestruturação comercial, incluindo análise de processos, treinamento de equipe e implementação de novas estratégias de mercado.',
    categoria: 'Serviços',
    
    // Prestador de Serviço
    prestadorRazaoSocial: 'NOVIGO TECNOLOGIA DA INFORMAÇÃO S.A',
    prestadorCpfCnpj: '12.345.678/0001-90',
    prestadorInscricaoEstadual: 'ISENTO',
    prestadorInscricaoMunicipal: '8.234.567-8',
    prestadorEndereco: 'AV. BRIG. FARIA LIMA, 1234 - 11º ANDAR - JARDIM PAULISTANO - CEP 01451-001',
    prestadorMunicipio: 'SÃO PAULO',
    prestadorUf: 'SP',
    prestadorEmail: 'financeiro@novigo.com.br',
    
    // Tomador de Serviço
    tomadorRazaoSocial: 'EMPRESA ABC COMERCIAL LTDA',
    tomadorCpfCnpj: '98.765.432/0001-10',
    tomadorInscricaoEstadual: '123.456.789.110',
    tomadorInscricaoMunicipal: '5.678.901-2',
    tomadorEndereco: 'RUA AUGUSTA, 2500 - CONSOLAÇÃO - CEP 01412-100',
    tomadorMunicipio: 'SÃO PAULO',
    tomadorUf: 'SP',
    tomadorEmail: 'contato@empresaabc.com.br',
    
    // Dados Bancários
    banco: 'Banco do Brasil - 001',
    agencia: '1234-5',
    contaCorrente: '67890-1',
    pix: 'financeiro@novigo.com.br',
    
    // Impostos e Valores
    valorInss: 0,
    valorIrrf: 2250,
    valorCsll: 450,
    valorCofins: 450,
    valorPis: 97.50,
    codigoServico: '17.02 - Programação',
    valorDeducoes: 0,
    baseCalculo: 15000,
    aliquota: 5,
    valorIss: 750,
    valorCredito: 0,
    
    // Outras Informações
    municipioPrestacao: 'SÃO PAULO - SP',
    numeroInscricaoObra: '',
    valorAproximadoTributos: 3997.50,
    observacoes: 'Esta NFS-e foi emitida com respaldo na Lei Complementar n° 116/2003. Nota Fiscal paga em 28/10/2024 via transferência bancária.'
  },
  
  // NF-2024-002 - ENVIADA - MARIA SILVA
  {
    id: '2',
    numero: 'NF-2024-002',
    cliente: 'Tech Solutions',
    colaboradorId: '1',
    colaboradorNome: 'Maria Silva',
    valor: 8500,
    dataEmissao: '2024-10-15',
    dataVencimento: '2024-11-15',
    dataEnvio: '2024-10-16',
    status: 'enviada',
    descricao: 'Desenvolvimento de sistema web responsivo',
    categoria: 'Tecnologia'
  },
  
  // NF-2024-003 - CONFERIDA - ANA OLIVEIRA
  {
    id: '3',
    numero: 'NF-2024-003',
    cliente: 'Indústria XYZ',
    colaboradorId: '3',
    colaboradorNome: 'Ana Oliveira',
    valor: 12000,
    dataEmissao: '2024-09-20',
    dataVencimento: '2024-10-20',
    dataEnvio: '2024-09-21',
    status: 'conferida',
    descricao: 'Análise financeira e planejamento estratégico',
    categoria: 'Consultoria'
  },
  
  // NF-2024-004 - NÃO EMITIDA - ROBERTO ALMEIDA
  {
    id: '4',
    numero: 'NF-2024-004',
    cliente: 'Comércio Digital',
    colaboradorId: '9',
    colaboradorNome: 'Roberto Almeida',
    valor: 5000,
    dataEmissao: '2024-10-25',
    dataVencimento: '2024-11-25',
    status: 'não emitida',
    descricao: 'Consultoria de marketing digital',
    categoria: 'Marketing'
  },
  
  // NF-2024-005 - EMITIDA - JOÃO SANTOS
  {
    id: '5',
    numero: 'NF-2024-005',
    cliente: 'Startup Inovadora',
    colaboradorId: '2',
    colaboradorNome: 'João Santos',
    valor: 18000,
    dataEmissao: '2024-09-10',
    dataVencimento: '2024-10-10',
    status: 'emitida',
    descricao: 'Desenvolvimento web completo com e-commerce',
    categoria: 'Tecnologia'
  },
  
  // NF-2024-006 - CONFERIDA - CARLOS MENDES
  {
    id: '6',
    numero: 'NF-2024-006',
    cliente: 'Construtora Moderna',
    colaboradorId: '4',
    colaboradorNome: 'Carlos Mendes',
    valor: 7500,
    dataEmissao: '2024-10-22',
    dataVencimento: '2024-11-22',
    dataEnvio: '2024-10-23',
    status: 'conferida',
    descricao: 'Treinamento de equipe comercial',
    categoria: 'Treinamento'
  },
  
  // NF-2024-007 - NÃO EMITIDA - FERNANDA LIMA
  {
    id: '7',
    numero: 'NF-2024-007',
    cliente: 'Farmácia Central',
    colaboradorId: '10',
    colaboradorNome: 'Fernanda Lima',
    valor: 4200,
    dataEmissao: '2024-10-28',
    dataVencimento: '2024-11-28',
    status: 'não emitida',
    descricao: 'Campanha de marketing integrada',
    categoria: 'Marketing'
  },
  
  // NF-2024-008 - CONFERIDA - PATRICIA COSTA (já estava como conferida antes)
  {
    id: '8',
    numero: 'NF-2024-008',
    cliente: 'Supermercado Bom Preço',
    colaboradorId: '5',
    colaboradorNome: 'Patricia Costa',
    valor: 16500,
    dataEmissao: '2024-09-15',
    dataVencimento: '2024-10-15',
    status: 'conferida',
    descricao: 'Sistema de gestão de estoque e vendas',
    categoria: 'Tecnologia'
  }
];