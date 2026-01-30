// ==================== VENDEDORES ====================
export interface Vendedor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  dataCadastro: string;
  status: 'ativo' | 'inativo';
}

// ==================== EMPRESAS ====================
export interface Empresa {
  id: string;
  nomeCompleto: string;
  cnae: string;
  gestorNome: string;
  gestorEmail: string;
  gestorTelefone: string;
  vendedorId: string;
  vendedorNome: string;
  categoria: string; // Banco, Indústria, Comércio, Serviços, etc.
  status: 'ativa' | 'inativa';
  dataCadastro: string;
  // Dados cadastrais completos (Prestador)
  razaoSocial?: string;
  cnpj?: string;
  inscricaoMunicipal?: string;
  inscricaoEstadual?: string;
  endereco?: string;
  cep?: string;
  municipio?: string;
  uf?: string;
  email?: string;
  telefone?: string;
}

// ==================== COLABORADORES ====================
export interface Colaborador {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  categoria: 'CLT' | 'PJ' | 'RPA' | 'Flex';
  tipoTrabalho: 'Presencial' | 'Home Office' | 'Híbrido';
  configuracaoHibrido?: '3x2' | '2x3' | '4x1' | '1x4'; // Apenas se for híbrido
  empresaId: string;
  empresaNome: string;
  vendedorId: string;
  vendedorNome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  dataDemissao?: string;
  status: 'ativo' | 'inativo';
}

// ==================== NOTAS FISCAIS ====================
export interface NotaFiscal {
  id: string;
  numero: string;
  empresaId: string;
  empresaNome: string;
  vendedorId: string;
  vendedorNome: string;
  descricao: string;
  valorBruto: number;
  impostos: {
    iss?: number;
    pis?: number;
    cofins?: number;
    irpj?: number;
    csll?: number;
    inss?: number;
    irrf?: number;
  };
  valorLiquido: number;
  regimeTributario: 'Lucro Presumido' | 'Simples Nacional' | 'Lucro Real' | 'MEI';
  dataEmissao: string;
  dataVencimento: string;
  dataEnvio?: string;
  status: 'não emitida' | 'emitida' | 'conferida' | 'enviada' | 'paga';
}

// ==================== CONFIGURAÇÕES ====================
export interface Configuracoes {
  categoriasEmpresas: string[];
  categoriasColaboradores: string[];
  tiposTrabalho: string[];
  configuracoesHibrido: string[];
  regimesTributarios: string[];
  tiposImpostos: {
    codigo: string;
    nome: string;
    descricao: string;
  }[];
  templatesObservacoes?: string[];
}

// Configurações padrão
export const configuracoesPadrao: Configuracoes = {
  categoriasEmpresas: ['Banco', 'Indústria', 'Comércio', 'Serviços', 'Tecnologia', 'Saúde', 'Educação', 'Outros'],
  categoriasColaboradores: ['CLT', 'PJ', 'RPA', 'Flex'],
  tiposTrabalho: ['Presencial', 'Home Office', 'Híbrido'],
  configuracoesHibrido: ['3x2', '2x3', '4x1', '1x4'],
  regimesTributarios: ['Lucro Presumido', 'Simples Nacional', 'Lucro Real', 'MEI'],
  tiposImpostos: [
    { codigo: 'ISS', nome: 'ISS', descricao: 'Imposto Sobre Serviços' },
    { codigo: 'PIS', nome: 'PIS', descricao: 'Programa de Integração Social' },
    { codigo: 'COFINS', nome: 'COFINS', descricao: 'Contribuição para o Financiamento da Seguridade Social' },
    { codigo: 'IRPJ', nome: 'IRPJ', descricao: 'Imposto de Renda Pessoa Jurídica' },
    { codigo: 'CSLL', nome: 'CSLL', descricao: 'Contribuição Social sobre o Lucro Líquido' },
    { codigo: 'INSS', nome: 'INSS', descricao: 'Instituto Nacional do Seguro Social' },
    { codigo: 'IRRF', nome: 'IRRF', descricao: 'Imposto de Renda Retido na Fonte' },
  ],
  templatesObservacoes: [
    '(1) Esta NFS-e foi emitida com respaldo na Lei nº 14.097/2005',
    '(2) Esta NFS-e não gera crédito',
    '(3) Faturamento referente aos serviços do mês de [mês/ano]',
  ],
};