import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DollarSign, Users, FileText, TrendingUp, ArrowLeft, Building2, UserCheck, Briefcase, Search, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import AddEmpresaDialog from './AddEmpresaDialog';
import AddVendedorDialog from './AddVendedorDialog';
import type { NotaFiscal } from './NotasFiscais';
import type { Colaborador } from './Colaboradores';
import type { Empresa } from '../types';

interface DashboardStats {
  faturamentoTotal: number;
  totalColaboradores: number;
  totalNotasFiscais: number;
  crescimento: number;
}

interface MonthData {
  mes: string;
  mesNome: string;
  quantidade: number;
  valor: number;
}

interface NotasPorCliente {
  cliente: string;
  quantidade: number;
  valor: number;
  notas: NotaFiscal[];
}

interface VendedorStats {
  vendedor: Colaborador;
  totalNotas: number;
  totalValor: number;
  empresas: string[];
  clientes: NotasPorCliente[];
}

export default function Dashboard({ onNavigate, vendedorLogado }: { onNavigate?: (tab: string) => void; vendedorLogado?: Colaborador | null }) {
  const [stats, setStats] = useState<DashboardStats>({
    faturamentoTotal: 0,
    totalColaboradores: 0,
    totalNotasFiscais: 0,
    crescimento: 0
  });
  
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
  const [notasPorCliente, setNotasPorCliente] = useState<NotasPorCliente[]>([]);
  const [selectedView, setSelectedView] = useState<'overview' | 'vendedores' | 'empresas'>('overview');
  const [vendedoresStats, setVendedoresStats] = useState<VendedorStats[]>([]);
  const [selectedVendedor, setSelectedVendedor] = useState<string | null>(null);
  const [monthSearch, setMonthSearch] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);
  const [isAddEmpresaDialogOpen, setIsAddEmpresaDialogOpen] = useState(false);
  const [isAddVendedorDialogOpen, setIsAddVendedorDialogOpen] = useState(false);
  const [editingVendedor, setEditingVendedor] = useState<any>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    initializeMockData();
    loadDashboardData();
    loadVendedoresStats();
    loadEmpresas();
  }, [vendedorLogado]);

  const loadEmpresas = () => {
    const stored = localStorage.getItem('empresas');
    if (stored) {
      setEmpresas(JSON.parse(stored));
    }
  };

  const handleSaveEmpresa = (empresa: Empresa) => {
    const stored = localStorage.getItem('empresas');
    const empresasAtuais = stored ? JSON.parse(stored) : [];
    const updatedEmpresas = [...empresasAtuais, empresa];
    
    localStorage.setItem('empresas', JSON.stringify(updatedEmpresas));
    setEmpresas(updatedEmpresas);
    loadDashboardData();
    loadVendedoresStats();
  };

  const handleSaveVendedor = (vendedor: any) => {
    const stored = localStorage.getItem('colaboradores');
    const colaboradoresAtuais = stored ? JSON.parse(stored) : [];
    
    // Converter de Vendedor para Colaborador (vendedor)
    const vendedorColaborador = {
      id: vendedor.id,
      nome: vendedor.nome,
      email: vendedor.email,
      telefone: vendedor.telefone,
      cargo: 'Vendedor', // Valor padrão
      tipo: 'vendedor',
      status: vendedor.status,
      dataAdmissao: vendedor.dataCadastro,
    };
    
    let updatedColaboradores;
    if (editingVendedor) {
      updatedColaboradores = colaboradoresAtuais.map((c: any) => 
        c.id === vendedor.id ? vendedorColaborador : c
      );
    } else {
      updatedColaboradores = [...colaboradoresAtuais, vendedorColaborador];
    }
    
    localStorage.setItem('colaboradores', JSON.stringify(updatedColaboradores));
    setEditingVendedor(null);
    loadDashboardData();
    loadVendedoresStats();
  };

  useEffect(() => {
    if (selectedMonth) {
      loadMonthDetails(selectedMonth);
    }
  }, [selectedMonth]);

  const initializeMockData = () => {
    // Verificar se já existem dados
    const existingColaboradores = localStorage.getItem('colaboradores');
    const existingNotas = localStorage.getItem('notasFiscais');
    const existingEmpresas = localStorage.getItem('empresas');

    // Sempre reinicializar para garantir que os vendedores estejam presentes
    // Comentar esta linha após primeira execução se quiser manter dados customizados
    const forceReinit = true;
    
    // Inicializar empresas mock se não existirem ou se forçar reinicialização
    if (!existingEmpresas || JSON.parse(existingEmpresas).length === 0 || forceReinit) {
      const mockEmpresas = [
        {
          id: 'emp1',
          nomeCompleto: 'Empresa ABC Ltda',
          cnae: '6201-5/00',
          gestorNome: 'Carlos Alberto Silva',
          gestorEmail: 'carlos@empresaabc.com.br',
          gestorTelefone: '(11) 98765-1111',
          vendedorId: 'v1',
          vendedorNome: 'Luís Santos',
          categoria: 'Serviços',
          status: 'ativa' as const,
          dataCadastro: '2023-01-15',
          razaoSocial: 'EMPRESA ABC CONSULTORIA E SERVIÇOS LTDA',
          cnpj: '12.345.678/0001-90',
          inscricaoMunicipal: '123.456.789-0',
          inscricaoEstadual: 'ISENTO',
          endereco: 'RUA DAS FLORES, 1234 - 5º ANDAR - CENTRO',
          cep: '01234-567',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@empresaabc.com.br',
          telefone: '(11) 3456-7890'
        },
        {
          id: 'emp2',
          nomeCompleto: 'Tech Solutions Inc',
          cnae: '6201-5/00',
          gestorNome: 'Ana Paula Mendes',
          gestorEmail: 'ana@techsolutions.com.br',
          gestorTelefone: '(11) 98765-2222',
          vendedorId: 'v2',
          vendedorNome: 'Fábio Oliveira',
          categoria: 'Tecnologia',
          status: 'ativa' as const,
          dataCadastro: '2023-02-20',
          razaoSocial: 'TECH SOLUTIONS TECNOLOGIA LTDA',
          cnpj: '23.456.789/0001-01',
          inscricaoMunicipal: '234.567.890-1',
          inscricaoEstadual: '123.456.789.012',
          endereco: 'AV. PAULISTA, 2000 - 15º ANDAR - BELA VISTA',
          cep: '01310-200',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@techsolutions.com.br',
          telefone: '(11) 3567-8901'
        },
        {
          id: 'emp3',
          nomeCompleto: 'Indústria XYZ',
          cnae: '2511-0/00',
          gestorNome: 'Roberto Ferreira',
          gestorEmail: 'roberto@industriaxyz.com.br',
          gestorTelefone: '(11) 98765-3333',
          vendedorId: 'v3',
          vendedorNome: 'Mariana Costa',
          categoria: 'Indústria',
          status: 'ativa' as const,
          dataCadastro: '2023-03-10',
          razaoSocial: 'INDÚSTRIA XYZ METALÚRGICA S.A.',
          cnpj: '34.567.890/0001-12',
          inscricaoMunicipal: '345.678.901-2',
          inscricaoEstadual: '234.567.890.123',
          endereco: 'RUA DA INDÚSTRIA, 500 - DISTRITO INDUSTRIAL',
          cep: '09876-543',
          municipio: 'São Bernardo do Campo',
          uf: 'SP',
          email: 'contato@industriaxyz.com.br',
          telefone: '(11) 4567-8901'
        },
        {
          id: 'emp4',
          nomeCompleto: 'Comércio Digital',
          cnae: '4751-2/01',
          gestorNome: 'Juliana Rodrigues',
          gestorEmail: 'juliana@comerciodigital.com.br',
          gestorTelefone: '(11) 98765-4444',
          vendedorId: 'v1',
          vendedorNome: 'Luís Santos',
          categoria: 'Comércio',
          status: 'ativa' as const,
          dataCadastro: '2023-04-05',
          razaoSocial: 'COMÉRCIO DIGITAL VAREJO ONLINE LTDA',
          cnpj: '45.678.901/0001-23',
          inscricaoMunicipal: '456.789.012-3',
          inscricaoEstadual: '345.678.901.234',
          endereco: 'AV. BRIG. FARIA LIMA, 3000 - 8º ANDAR - ITAIM BIBI',
          cep: '01451-000',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@comerciodigital.com.br',
          telefone: '(11) 3678-9012'
        },
        {
          id: 'emp5',
          nomeCompleto: 'Startup Inovadora',
          cnae: '6311-9/00',
          gestorNome: 'Felipe Costa',
          gestorEmail: 'felipe@startupinova.com.br',
          gestorTelefone: '(11) 98765-5555',
          vendedorId: 'v2',
          vendedorNome: 'Fábio Oliveira',
          categoria: 'Tecnologia',
          status: 'ativa' as const,
          dataCadastro: '2023-05-12',
          razaoSocial: 'STARTUP INOVADORA TECNOLOGIA LTDA',
          cnpj: '56.789.012/0001-34',
          inscricaoMunicipal: '567.890.123-4',
          inscricaoEstadual: 'ISENTO',
          endereco: 'RUA DOS PINHEIROS, 800 - 3º ANDAR - PINHEIROS',
          cep: '05422-001',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@startupinova.com.br',
          telefone: '(11) 3789-0123'
        },
        {
          id: 'emp6',
          nomeCompleto: 'Varejo Nacional S.A.',
          cnae: '4711-3/02',
          gestorNome: 'Sandra Oliveira',
          gestorEmail: 'sandra@varejonacional.com.br',
          gestorTelefone: '(11) 98765-6666',
          vendedorId: 'v4',
          vendedorNome: 'Ricardo Mendes',
          categoria: 'Comércio',
          status: 'ativa' as const,
          dataCadastro: '2023-06-01',
          razaoSocial: 'VAREJO NACIONAL SUPERMERCADOS S.A.',
          cnpj: '67.890.123/0001-45',
          inscricaoMunicipal: '678.901.234-5',
          inscricaoEstadual: '456.789.012.345',
          endereco: 'AV. REBOUÇAS, 2500 - PINHEIROS',
          cep: '05401-200',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@varejonacional.com.br',
          telefone: '(11) 3890-1234'
        },
        {
          id: 'emp7',
          nomeCompleto: 'Hotel Executivo Premium',
          cnae: '5510-8/01',
          gestorNome: 'Marcelo Santos',
          gestorEmail: 'marcelo@hotelexecutivo.com.br',
          gestorTelefone: '(11) 98765-7777',
          vendedorId: 'v5',
          vendedorNome: 'Juliana Silva',
          categoria: 'Serviços',
          status: 'ativa' as const,
          dataCadastro: '2023-07-15',
          razaoSocial: 'HOTEL EXECUTIVO PREMIUM HOSPEDAGEM LTDA',
          cnpj: '78.901.234/0001-56',
          inscricaoMunicipal: '789.012.345-6',
          inscricaoEstadual: '567.890.123.456',
          endereco: 'RUA AUGUSTA, 1500 - CONSOLAÇÃO',
          cep: '01304-001',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@hotelexecutivo.com.br',
          telefone: '(11) 3901-2345'
        },
        {
          id: 'emp8',
          nomeCompleto: 'Construtora Moderna',
          cnae: '4120-4/00',
          gestorNome: 'Paulo Henrique',
          gestorEmail: 'paulo@construtoramoderna.com.br',
          gestorTelefone: '(11) 98765-8888',
          vendedorId: 'v3',
          vendedorNome: 'Mariana Costa',
          categoria: 'Indústria',
          status: 'ativa' as const,
          dataCadastro: '2023-08-20',
          razaoSocial: 'CONSTRUTORA MODERNA ENGENHARIA LTDA',
          cnpj: '89.012.345/0001-67',
          inscricaoMunicipal: '890.123.456-7',
          inscricaoEstadual: '678.901.234.567',
          endereco: 'AV. NOVE DE JULHO, 3500 - JARDIM PAULISTA',
          cep: '01406-000',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@construtoramoderna.com.br',
          telefone: '(11) 4012-3456'
        },
        {
          id: 'emp9',
          nomeCompleto: 'Farmácia Central',
          cnae: '4771-7/01',
          gestorNome: 'Beatriz Lima',
          gestorEmail: 'beatriz@farmaciacentral.com.br',
          gestorTelefone: '(11) 98765-9999',
          vendedorId: 'v1',
          vendedorNome: 'Luís Santos',
          categoria: 'Saúde',
          status: 'ativa' as const,
          dataCadastro: '2023-09-10',
          razaoSocial: 'FARMÁCIA CENTRAL DROGARIA LTDA',
          cnpj: '90.123.456/0001-78',
          inscricaoMunicipal: '901.234.567-8',
          inscricaoEstadual: '789.012.345.678',
          endereco: 'RUA VERGUEIRO, 2000 - VILA MARIANA',
          cep: '04101-000',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@farmaciacentral.com.br',
          telefone: '(11) 4123-4567'
        },
        {
          id: 'emp10',
          nomeCompleto: 'Supermercado Bom Preço',
          cnae: '4711-3/01',
          gestorNome: 'Ricardo Almeida',
          gestorEmail: 'ricardo@bompreco.com.br',
          gestorTelefone: '(11) 98765-0000',
          vendedorId: 'v2',
          vendedorNome: 'Fábio Oliveira',
          categoria: 'Comércio',
          status: 'ativa' as const,
          dataCadastro: '2023-10-05',
          razaoSocial: 'SUPERMERCADO BOM PREÇO COMERCIAL LTDA',
          cnpj: '01.234.567/0001-89',
          inscricaoMunicipal: '012.345.678-9',
          inscricaoEstadual: '890.123.456.789',
          endereco: 'AV. JABAQUARA, 1800 - JABAQUARA',
          cep: '04046-000',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@bompreco.com.br',
          telefone: '(11) 4234-5678'
        },
        {
          id: 'emp11',
          nomeCompleto: 'Escritório Jurídico Santos',
          cnae: '6911-7/01',
          gestorNome: 'Dr. José Santos',
          gestorEmail: 'jose@escritoriosantos.com.br',
          gestorTelefone: '(11) 98765-1234',
          vendedorId: 'v4',
          vendedorNome: 'Ricardo Mendes',
          categoria: 'Serviços',
          status: 'ativa' as const,
          dataCadastro: '2023-11-12',
          razaoSocial: 'ESCRITÓRIO JURÍDICO SANTOS ADVOGADOS ASSOCIADOS',
          cnpj: '11.234.567/0001-90',
          inscricaoMunicipal: 'ISENTO',
          inscricaoEstadual: 'ISENTO',
          endereco: 'RUA DA CONSOLAÇÃO, 2000 - 12º ANDAR - CONSOLAÇÃO',
          cep: '01302-001',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@escritoriosantos.com.br',
          telefone: '(11) 4345-6789'
        },
        {
          id: 'emp12',
          nomeCompleto: 'Clínica Médica Saúde Total',
          cnae: '8630-5/03',
          gestorNome: 'Dra. Maria Helena',
          gestorEmail: 'maria@saudetotal.com.br',
          gestorTelefone: '(11) 98765-5678',
          vendedorId: 'v5',
          vendedorNome: 'Juliana Silva',
          categoria: 'Saúde',
          status: 'ativa' as const,
          dataCadastro: '2023-12-01',
          razaoSocial: 'CLÍNICA MÉDICA SAÚDE TOTAL LTDA',
          cnpj: '22.345.678/0001-01',
          inscricaoMunicipal: '223.456.789-0',
          inscricaoEstadual: 'ISENTO',
          endereco: 'AV. ANGÉLICA, 2500 - 6º ANDAR - HIGIENÓPOLIS',
          cep: '01228-200',
          municipio: 'São Paulo',
          uf: 'SP',
          email: 'contato@saudetotal.com.br',
          telefone: '(11) 4456-7890'
        }
      ];
      localStorage.setItem('empresas', JSON.stringify(mockEmpresas));
    }
    
    // Inicializar colaboradores mock se não existirem ou se forçar reinicialização
    if (!existingColaboradores || JSON.parse(existingColaboradores).length === 0 || forceReinit) {
      const mockColaboradores = [
        // Vendedores
        { id: 'v1', nome: 'Luís Santos', email: 'luis@novigoIT.com', cargo: 'Vendedor Sênior', telefone: '(11) 98765-1001', tipo: 'vendedor', status: 'ativo', dataAdmissao: '2022-01-10' },
        { id: 'v2', nome: 'Fábio Oliveira', email: 'fabio@novigoIT.com', cargo: 'Vendedor Pleno', telefone: '(11) 98765-1002', tipo: 'vendedor', status: 'ativo', dataAdmissao: '2022-03-15' },
        { id: 'v3', nome: 'Mariana Costa', email: 'mariana@novigoIT.com', cargo: 'Vendedora Sênior', telefone: '(11) 98765-1003', tipo: 'vendedor', status: 'ativo', dataAdmissao: '2022-05-20' },
        { id: 'v4', nome: 'Ricardo Mendes', email: 'ricardo@novigoIT.com', cargo: 'Vendedor Júnior', telefone: '(11) 98765-1004', tipo: 'vendedor', status: 'ativo', dataAdmissao: '2023-02-10' },
        { id: 'v5', nome: 'Juliana Silva', email: 'juliana@novigoIT.com', cargo: 'Vendedora Pleno', telefone: '(11) 98765-1005', tipo: 'vendedor', status: 'ativo', dataAdmissao: '2023-06-05' },
        
        // Colaboradores (mantidos para compatibilidade)
        { id: '1', nome: 'Maria Silva', email: 'maria@example.com', cargo: 'Consultora de Vendas', telefone: '(11) 98765-4321', tipo: 'CLT', status: 'ativo', dataAdmissao: '2023-01-15' },
        { id: '2', nome: 'João Santos', email: 'joao@example.com', cargo: 'Desenvolvedor Full Stack', telefone: '(11) 98765-4322', tipo: 'PJ', status: 'ativo', dataAdmissao: '2023-02-20' },
        { id: '3', nome: 'Ana Oliveira', email: 'ana@example.com', cargo: 'Analista Financeira', telefone: '(11) 98765-4323', tipo: 'CLT', status: 'ativo', dataAdmissao: '2023-03-10' },
        { id: '4', nome: 'Carlos Mendes', email: 'carlos@example.com', cargo: 'Gerente Comercial', telefone: '(11) 98765-4324', tipo: 'CLT', status: 'ativo', dataAdmissao: '2023-04-05' },
        { id: '5', nome: 'Patricia Costa', email: 'patricia@example.com', cargo: 'Designer UX/UI', telefone: '(11) 98765-4325', tipo: 'PJ', status: 'ativo', dataAdmissao: '2023-05-12' },
        { id: '6', nome: 'Tech Solutions Ltda', email: 'contato@techsolutions.com', cargo: 'Empresa Parceira', telefone: '(11) 3456-7890', tipo: 'PJ', status: 'ativo', dataAdmissao: '2023-06-01' },
        { id: '7', nome: 'Consultoria ABC', email: 'abc@consultoria.com', cargo: 'Consultoria Empresarial', telefone: '(11) 3456-7891', tipo: 'PJ', status: 'ativo', dataAdmissao: '2023-07-15' },
        { id: '8', nome: 'Inovação Digital Ltda', email: 'contato@inovacaodigital.com', cargo: 'Agência Digital', telefone: '(11) 3456-7892', tipo: 'PJ', status: 'ativo', dataAdmissao: '2023-08-20' },
      ];
      localStorage.setItem('colaboradores', JSON.stringify(mockColaboradores));
    }

    // Inicializar notas fiscais mock se não existirem ou se forçar reinicialização
    if (!existingNotas || JSON.parse(existingNotas).length === 0 || forceReinit) {
      const mockNotas: NotaFiscal[] = [
        // Janeiro 2024
        { id: '1', numero: 'NF-2024-001', cliente: 'Empresa ABC Ltda', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 15000, dataEmissao: '2024-01-10', dataVencimento: '2024-02-10', dataEnvio: '2024-01-11', status: 'paga', descricao: 'Consultoria em vendas - Projeto trimestral', categoria: 'Serviços' },
        { id: '2', numero: 'NF-2024-002', cliente: 'Tech Solutions Inc', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 22000, dataEmissao: '2024-01-15', dataVencimento: '2024-02-15', dataEnvio: '2024-01-16', status: 'paga', descricao: 'Desenvolvimento de aplicativo mobile', categoria: 'Tecnologia' },
        { id: '3', numero: 'NF-2024-003', cliente: 'Indústria XYZ', colaboradorId: 'v3', colaboradorNome: 'Mariana Costa', valor: 18500, dataEmissao: '2024-01-20', dataVencimento: '2024-02-20', dataEnvio: '2024-01-21', status: 'paga', descricao: 'Análise financeira e planejamento estratégico', categoria: 'Consultoria' },
        
        // Fevereiro 2024
        { id: '4', numero: 'NF-2024-004', cliente: 'Comércio Digital', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 12000, dataEmissao: '2024-02-05', dataVencimento: '2024-03-05', dataEnvio: '2024-02-06', status: 'paga', descricao: 'Consultoria de marketing digital', categoria: 'Marketing' },
        { id: '5', numero: 'NF-2024-005', cliente: 'Startup Inovadora', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 28000, dataEmissao: '2024-02-12', dataVencimento: '2024-03-12', dataEnvio: '2024-02-13', status: 'paga', descricao: 'Desenvolvimento web completo com e-commerce', categoria: 'Tecnologia' },
        { id: '6', numero: 'NF-2024-006', cliente: 'Varejo Nacional S.A.', colaboradorId: 'v4', colaboradorNome: 'Ricardo Mendes', valor: 35000, dataEmissao: '2024-02-18', dataVencimento: '2024-03-18', dataEnvio: '2024-02-19', status: 'paga', descricao: 'Implementação de sistema ERP customizado', categoria: 'Tecnologia' },
        { id: '7', numero: 'NF-2024-007', cliente: 'Hotel Executivo Premium', colaboradorId: 'v5', colaboradorNome: 'Juliana Silva', valor: 14800, dataEmissao: '2024-02-25', dataVencimento: '2024-03-25', dataEnvio: '2024-02-26', status: 'paga', descricao: 'Consultoria em gestão hoteleira', categoria: 'Consultoria' },
        
        // Março 2024
        { id: '8', numero: 'NF-2024-008', cliente: 'Construtora Moderna', colaboradorId: 'v3', colaboradorNome: 'Mariana Costa', valor: 16500, dataEmissao: '2024-03-08', dataVencimento: '2024-04-08', dataEnvio: '2024-03-09', status: 'paga', descricao: 'Treinamento de equipe comercial', categoria: 'Treinamento' },
        { id: '9', numero: 'NF-2024-009', cliente: 'Farmácia Central', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 9200, dataEmissao: '2024-03-15', dataVencimento: '2024-04-15', dataEnvio: '2024-03-16', status: 'paga', descricao: 'Campanha de marketing integrada', categoria: 'Marketing' },
        { id: '10', numero: 'NF-2024-010', cliente: 'Supermercado Bom Preço', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 24500, dataEmissao: '2024-03-22', dataVencimento: '2024-04-22', dataEnvio: '2024-03-23', status: 'paga', descricao: 'Sistema de gestão de estoque e vendas', categoria: 'Tecnologia' },
        
        // Abril 2024
        { id: '11', numero: 'NF-2024-011', cliente: 'Escritório Jurídico Santos', colaboradorId: 'v4', colaboradorNome: 'Ricardo Mendes', valor: 11800, dataEmissao: '2024-04-05', dataVencimento: '2024-05-05', dataEnvio: '2024-04-06', status: 'paga', descricao: 'Consultoria comercial e vendas', categoria: 'Consultoria' },
        { id: '12', numero: 'NF-2024-012', cliente: 'Clínica Médica Saúde Total', colaboradorId: 'v5', colaboradorNome: 'Juliana Silva', valor: 19200, dataEmissao: '2024-04-12', dataVencimento: '2024-05-12', dataEnvio: '2024-04-13', status: 'paga', descricao: 'Análise financeira para expansão', categoria: 'Consultoria' },
        { id: '13', numero: 'NF-2024-013', cliente: 'Tech Solutions Inc', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 31000, dataEmissao: '2024-04-20', dataVencimento: '2024-05-20', dataEnvio: '2024-04-21', status: 'paga', descricao: 'Manutenção e upgrade de sistema', categoria: 'Tecnologia' },
        { id: '14', numero: 'NF-2024-014', cliente: 'Empresa ABC Ltda', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 13500, dataEmissao: '2024-04-28', dataVencimento: '2024-05-28', dataEnvio: '2024-04-29', status: 'paga', descricao: 'Workshop de vendas avançado', categoria: 'Treinamento' },
        
        // Maio 2024
        { id: '15', numero: 'NF-2024-015', cliente: 'Indústria XYZ', colaboradorId: 'v3', colaboradorNome: 'Mariana Costa', valor: 17800, dataEmissao: '2024-05-10', dataVencimento: '2024-06-10', dataEnvio: '2024-05-11', status: 'paga', descricao: 'Redesign de identidade visual', categoria: 'Design' },
        { id: '16', numero: 'NF-2024-016', cliente: 'Varejo Nacional S.A.', colaboradorId: 'v4', colaboradorNome: 'Ricardo Mendes', valor: 28500, dataEmissao: '2024-05-18', dataVencimento: '2024-06-18', dataEnvio: '2024-05-19', status: 'paga', descricao: 'Suporte técnico mensal ERP', categoria: 'Tecnologia' },
        { id: '17', numero: 'NF-2024-017', cliente: 'Hotel Executivo Premium', colaboradorId: 'v5', colaboradorNome: 'Juliana Silva', valor: 12300, dataEmissao: '2024-05-25', dataVencimento: '2024-06-25', dataEnvio: '2024-05-26', status: 'paga', descricao: 'Auditoria de processos operacionais', categoria: 'Consultoria' },
        
        // Junho 2024
        { id: '18', numero: 'NF-2024-018', cliente: 'Startup Inovadora', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 26000, dataEmissao: '2024-06-08', dataVencimento: '2024-07-08', dataEnvio: '2024-06-09', status: 'paga', descricao: 'Desenvolvimento de API REST', categoria: 'Tecnologia' },
        { id: '19', numero: 'NF-2024-019', cliente: 'Comércio Digital', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 15400, dataEmissao: '2024-06-15', dataVencimento: '2024-07-15', dataEnvio: '2024-06-16', status: 'paga', descricao: 'Gestão de redes sociais', categoria: 'Marketing' },
        { id: '20', numero: 'NF-2024-020', cliente: 'Construtora Moderna', colaboradorId: 'v3', colaboradorNome: 'Mariana Costa', valor: 14200, dataEmissao: '2024-06-22', dataVencimento: '2024-07-22', dataEnvio: '2024-06-23', status: 'paga', descricao: 'Consultoria em estratégia de vendas', categoria: 'Consultoria' },
        { id: '21', numero: 'NF-2024-021', cliente: 'Farmácia Central', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 10500, dataEmissao: '2024-06-28', dataVencimento: '2024-07-28', dataEnvio: '2024-06-29', status: 'paga', descricao: 'Planejamento financeiro anual', categoria: 'Consultoria' },
        
        // Julho 2024
        { id: '22', numero: 'NF-2024-022', cliente: 'Tech Solutions Inc', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 33000, dataEmissao: '2024-07-05', dataVencimento: '2024-08-05', dataEnvio: '2024-07-06', status: 'paga', descricao: 'Desenvolvimento de dashboard analytics', categoria: 'Tecnologia' },
        { id: '23', numero: 'NF-2024-023', cliente: 'Empresa ABC Ltda', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 16800, dataEmissao: '2024-07-12', dataVencimento: '2024-08-12', dataEnvio: '2024-07-13', status: 'paga', descricao: 'Programa de capacitação comercial', categoria: 'Treinamento' },
        { id: '24', numero: 'NF-2024-024', cliente: 'Clínica Médica Saúde Total', colaboradorId: 'v5', colaboradorNome: 'Juliana Silva', valor: 13700, dataEmissao: '2024-07-20', dataVencimento: '2024-08-20', dataEnvio: '2024-07-21', status: 'paga', descricao: 'Criação de material gráfico institucional', categoria: 'Design' },
        
        // Agosto 2024
        { id: '25', numero: 'NF-2024-025', cliente: 'Varejo Nacional S.A.', colaboradorId: 'v4', colaboradorNome: 'Ricardo Mendes', valor: 29500, dataEmissao: '2024-08-08', dataVencimento: '2024-09-08', dataEnvio: '2024-08-09', status: 'paga', descricao: 'Implementação de módulo de CRM', categoria: 'Tecnologia' },
        { id: '26', numero: 'NF-2024-026', cliente: 'Supermercado Bom Preço', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 18200, dataEmissao: '2024-08-15', dataVencimento: '2024-09-15', dataEnvio: '2024-08-16', status: 'paga', descricao: 'Campanha publicitária digital', categoria: 'Marketing' },
        { id: '27', numero: 'NF-2024-027', cliente: 'Hotel Executivo Premium', colaboradorId: 'v5', colaboradorNome: 'Juliana Silva', valor: 15900, dataEmissao: '2024-08-22', dataVencimento: '2024-09-22', dataEnvio: '2024-08-23', status: 'paga', descricao: 'Otimização de processos de atendimento', categoria: 'Consultoria' },
        
        // Setembro 2024
        { id: '28', numero: 'NF-2024-028', cliente: 'Indústria XYZ', colaboradorId: 'v3', colaboradorNome: 'Mariana Costa', valor: 21500, dataEmissao: '2024-09-10', dataVencimento: '2024-10-10', dataEnvio: '2024-09-11', status: 'enviada', descricao: 'Auditoria financeira completa', categoria: 'Consultoria' },
        { id: '29', numero: 'NF-2024-029', cliente: 'Startup Inovadora', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 27500, dataEmissao: '2024-09-18', dataVencimento: '2024-10-18', dataEnvio: '2024-09-19', status: 'enviada', descricao: 'Integração com APIs de pagamento', categoria: 'Tecnologia' },
        { id: '30', numero: 'NF-2024-030', cliente: 'Escritório Jurídico Santos', colaboradorId: 'v4', colaboradorNome: 'Ricardo Mendes', valor: 12400, dataEmissao: '2024-09-25', dataVencimento: '2024-10-25', dataEnvio: '2024-09-26', status: 'enviada', descricao: 'Estratégia de captação de clientes', categoria: 'Consultoria' },
        
        // Outubro 2024
        { id: '31', numero: 'NF-2024-031', cliente: 'Comércio Digital', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 16700, dataEmissao: '2024-10-08', dataVencimento: '2024-11-08', dataEnvio: '2024-10-09', status: 'enviada', descricao: 'SEO e otimização de website', categoria: 'Marketing' },
        { id: '32', numero: 'NF-2024-032', cliente: 'Tech Solutions Inc', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 30000, dataEmissao: '2024-10-15', dataVencimento: '2024-11-15', dataEnvio: '2024-10-16', status: 'enviada', descricao: 'Desenvolvimento de microserviços', categoria: 'Tecnologia' },
        { id: '33', numero: 'NF-2024-033', cliente: 'Construtora Moderna', colaboradorId: 'v3', colaboradorNome: 'Mariana Costa', valor: 14800, dataEmissao: '2024-10-22', dataVencimento: '2024-11-22', status: 'emitida', descricao: 'Consultoria em gestão de vendas', categoria: 'Consultoria' },
        { id: '34', numero: 'NF-2024-034', cliente: 'Farmácia Central', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 11200, dataEmissao: '2024-10-28', dataVencimento: '2024-11-28', status: 'emitida', descricao: 'Design de embalagens promocionais', categoria: 'Design' },
        
        // Novembro 2024
        { id: '35', numero: 'NF-2024-035', cliente: 'Varejo Nacional S.A.', colaboradorId: 'v4', colaboradorNome: 'Ricardo Mendes', valor: 32000, dataEmissao: '2024-11-05', dataVencimento: '2024-12-05', status: 'emitida', descricao: 'Atualização e manutenção sistema ERP', categoria: 'Tecnologia' },
        { id: '36', numero: 'NF-2024-036', cliente: 'Empresa ABC Ltda', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 17500, dataEmissao: '2024-11-12', dataVencimento: '2024-12-12', status: 'emitida', descricao: 'Consultoria estratégica trimestral', categoria: 'Consultoria' },
        { id: '37', numero: 'NF-2024-037', cliente: 'Clínica Médica Saúde Total', colaboradorId: 'v5', colaboradorNome: 'Juliana Silva', valor: 19800, dataEmissao: '2024-11-18', dataVencimento: '2024-12-18', status: 'não emitida', descricao: 'Planejamento orçamentário 2025', categoria: 'Consultoria' },
        { id: '38', numero: 'NF-2024-038', cliente: 'Hotel Executivo Premium', colaboradorId: 'v5', colaboradorNome: 'Juliana Silva', valor: 13500, dataEmissao: '2024-11-25', dataVencimento: '2024-12-25', status: 'não emitida', descricao: 'Consultoria em excelência operacional', categoria: 'Consultoria' },
        
        // Dezembro 2024
        { id: '39', numero: 'NF-2024-039', cliente: 'Startup Inovadora', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 28500, dataEmissao: '2024-12-05', dataVencimento: '2025-01-05', status: 'não emitida', descricao: 'Desenvolvimento de features mobile', categoria: 'Tecnologia' },
        { id: '40', numero: 'NF-2024-040', cliente: 'Supermercado Bom Preço', colaboradorId: 'v2', colaboradorNome: 'Fábio Oliveira', valor: 20500, dataEmissao: '2024-12-10', dataVencimento: '2025-01-10', status: 'não emitida', descricao: 'Campanha de fim de ano', categoria: 'Marketing' },
        { id: '41', numero: 'NF-2024-041', cliente: 'Indústria XYZ', colaboradorId: 'v3', colaboradorNome: 'Mariana Costa', valor: 16300, dataEmissao: '2024-12-15', dataVencimento: '2025-01-15', status: 'não emitida', descricao: 'Catálogo de produtos 2025', categoria: 'Design' },
        { id: '42', numero: 'NF-2024-042', cliente: 'Comércio Digital', colaboradorId: 'v1', colaboradorNome: 'Luís Santos', valor: 15200, dataEmissao: '2024-12-20', dataVencimento: '2025-01-20', status: 'não emitida', descricao: 'Treinamento de equipe de vendas', categoria: 'Treinamento' },
      ];
      localStorage.setItem('notasFiscais', JSON.stringify(mockNotas));
    }
  };

  const loadDashboardData = () => {
    const colaboradores = JSON.parse(localStorage.getItem('colaboradores') || '[]');
    let notas: NotaFiscal[] = JSON.parse(localStorage.getItem('notasFiscais') || '[]');
    
    // Filtrar por vendedor se estiver logado como funcionário
    if (vendedorLogado) {
      notas = notas.filter(nota => nota.colaboradorNome === vendedorLogado.nome);
    }
    
    const faturamentoTotal = notas.reduce((sum, nota) => sum + nota.valor, 0);
    
    setStats({
      faturamentoTotal,
      totalColaboradores: colaboradores.length,
      totalNotasFiscais: notas.length,
      crescimento: 12.5
    });

    // Processar dados mensais
    const monthsMap = new Map<string, { quantidade: number; valor: number }>();
    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    // Inicializar todos os meses com zero
    mesesNomes.forEach((nome, index) => {
      const mesKey = String(index + 1).padStart(2, '0');
      monthsMap.set(mesKey, { quantidade: 0, valor: 0 });
    });

    // Processar notas fiscais
    notas.forEach(nota => {
      const date = new Date(nota.dataEmissao);
      const mesKey = String(date.getMonth() + 1).padStart(2, '0');
      const current = monthsMap.get(mesKey) || { quantidade: 0, valor: 0 };
      monthsMap.set(mesKey, {
        quantidade: current.quantidade + 1,
        valor: current.valor + nota.valor
      });
    });

    // Converter para array
    const monthlyDataArray: MonthData[] = Array.from(monthsMap.entries()).map(([mes, data]) => ({
      mes,
      mesNome: mesesNomes[parseInt(mes) - 1],
      quantidade: data.quantidade,
      valor: data.valor
    }));

    setMonthlyData(monthlyDataArray);
  };

  const loadMonthDetails = (month: string) => {
    let notas: NotaFiscal[] = JSON.parse(localStorage.getItem('notasFiscais') || '[]');
    
    // Filtrar por vendedor se estiver logado como funcionário
    if (vendedorLogado) {
      notas = notas.filter(nota => nota.colaboradorNome === vendedorLogado.nome);
    }
    
    // Filtrar notas do mês selecionado, ou todas se month === 'all'
    let notasDoMes: NotaFiscal[];
    if (month === 'all') {
      notasDoMes = notas;
    } else {
      notasDoMes = notas.filter(nota => {
        const date = new Date(nota.dataEmissao);
        const mesKey = String(date.getMonth() + 1).padStart(2, '0');
        return mesKey === month;
      });
    }

    // Agrupar por cliente
    const clientesMap = new Map<string, NotasPorCliente>();
    
    notasDoMes.forEach(nota => {
      const current = clientesMap.get(nota.cliente);
      if (current) {
        current.quantidade += 1;
        current.valor += nota.valor;
        current.notas.push(nota);
      } else {
        clientesMap.set(nota.cliente, {
          cliente: nota.cliente,
          quantidade: 1,
          valor: nota.valor,
          notas: [nota]
        });
      }
    });

    // Converter para array e ordenar por valor
    const clientesArray = Array.from(clientesMap.values()).sort((a, b) => b.valor - a.valor);
    setNotasPorCliente(clientesArray);
  };

  const loadVendedoresStats = () => {
    const colaboradoresStr = localStorage.getItem('colaboradores');
    const notasStr = localStorage.getItem('notasFiscais');
    
    if (!colaboradoresStr || !notasStr) return;
    
    const colaboradores: Colaborador[] = JSON.parse(colaboradoresStr);
    let notas: NotaFiscal[] = JSON.parse(notasStr);
    
    // Filtrar notas por vendedor se estiver logado como funcionário
    if (vendedorLogado) {
      notas = notas.filter(nota => nota.colaboradorNome === vendedorLogado.nome);
    }
    
    // Filtrar apenas vendedores (tipo vendedor)
    const vendedores = vendedorLogado 
      ? colaboradores.filter(c => c.tipo === 'vendedor' && c.nome === vendedorLogado.nome)
      : colaboradores.filter(c => c.tipo === 'vendedor');
    
    const vendedoresData: VendedorStats[] = vendedores.map(vendedor => {
      const notasDoVendedor = notas.filter(n => n.colaboradorId === vendedor.id);
      
      // Agrupar clientes únicos
      const clientesSet = new Set(notasDoVendedor.map(n => n.cliente));
      const empresas = Array.from(clientesSet);
      
      // Agrupar por cliente
      const clientesMap = new Map<string, NotasPorCliente>();
      notasDoVendedor.forEach(nota => {
        const current = clientesMap.get(nota.cliente);
        if (current) {
          current.quantidade += 1;
          current.valor += nota.valor;
          current.notas.push(nota);
        } else {
          clientesMap.set(nota.cliente, {
            cliente: nota.cliente,
            quantidade: 1,
            valor: nota.valor,
            notas: [nota]
          });
        }
      });
      
      const clientes = Array.from(clientesMap.values()).sort((a, b) => b.valor - a.valor);
      
      return {
        vendedor,
        totalNotas: notasDoVendedor.length,
        totalValor: notasDoVendedor.reduce((sum, n) => sum + n.valor, 0),
        empresas,
        clientes
      };
    }).sort((a, b) => b.totalValor - a.totalValor);
    
    setVendedoresStats(vendedoresData);
  };

  const handleBarClick = (data: any) => {
    if (data && data.mes) {
      setSelectedMonth(data.mes);
    }
  };

  const handleBackToOverview = () => {
    setSelectedMonth(null);
    setNotasPorCliente([]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: NotaFiscal['status']) => {
    const variants = {
      'não emitida': 'bg-muted text-muted-foreground',
      'emitida': 'bg-secondary text-secondary-foreground',
      'conferida': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'enviada': 'bg-accent text-accent-foreground',
      'paga': 'bg-primary text-primary-foreground'
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

  const getMonthName = (mesKey: string) => {
    const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return mesesNomes[parseInt(mesKey) - 1];
  };

  // Vista detalhada do mês
  if (selectedMonth) {
    const monthData = monthlyData.find(m => m.mes === selectedMonth);
    const totalMes = notasPorCliente.reduce((sum, c) => sum + c.valor, 0);
    const totalNotasMes = notasPorCliente.reduce((sum, c) => sum + c.quantidade, 0);

    // Se for "all", calcular dashboards individuais por empresa
    let empresaDashboards: Array<{
      empresa: string;
      totalValor: number;
      totalNotas: number;
      meses: Array<{ mes: string; mesNome: string; valor: number; quantidade: number }>;
    }> = [];

    if (selectedMonth === 'all') {
      let notas: NotaFiscal[] = JSON.parse(localStorage.getItem('notasFiscais') || '[]');
      
      // Filtrar por vendedor se estiver logado como funcionário
      if (vendedorLogado) {
        notas = notas.filter(nota => nota.colaboradorNome === vendedorLogado.nome);
      }
      
      const empresasMap = new Map<string, any>();

      notas.forEach(nota => {
        const date = new Date(nota.dataEmissao);
        const mesKey = String(date.getMonth() + 1).padStart(2, '0');
        const mesNome = getMonthName(mesKey);

        if (!empresasMap.has(nota.cliente)) {
          empresasMap.set(nota.cliente, {
            empresa: nota.cliente,
            totalValor: 0,
            totalNotas: 0,
            mesesMap: new Map<string, { mes: string; mesNome: string; valor: number; quantidade: number }>()
          });
        }

        const empresaData = empresasMap.get(nota.cliente);
        empresaData.totalValor += nota.valor;
        empresaData.totalNotas += 1;

        if (!empresaData.mesesMap.has(mesKey)) {
          empresaData.mesesMap.set(mesKey, {
            mes: mesKey,
            mesNome: mesNome,
            valor: 0,
            quantidade: 0
          });
        }

        const mesData = empresaData.mesesMap.get(mesKey);
        mesData.valor += nota.valor;
        mesData.quantidade += 1;
      });

      empresaDashboards = Array.from(empresasMap.values()).map(empresa => ({
        empresa: empresa.empresa,
        totalValor: empresa.totalValor,
        totalNotas: empresa.totalNotas,
        meses: Array.from(empresa.mesesMap.values()).sort((a, b) => parseInt(a.mes) - parseInt(b.mes))
      })).sort((a, b) => b.totalValor - a.totalValor);
    }

    // Filtrar dashboards de empresa por pesquisa
    const filteredEmpresaDashboards = selectedMonth === 'all' 
      ? empresaDashboards.filter(dashboard => 
          dashboard.empresa.toLowerCase().includes(monthSearch.toLowerCase())
        )
      : empresaDashboards;

    return (
      <div className="space-y-6">
        {/* Card de boas-vindas para vendedor */}
        {vendedorLogado && (
          <Card className="border border-blue-200 dark:border-blue-800 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserCheck className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-foreground">Olá, {vendedorLogado.nome}!</h3>
                  <p className="text-sm text-muted-foreground">
                    Vendedor • {vendedorLogado.email}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-sm text-muted-foreground">Suas Empresas</div>
                  <div className="text-xl text-foreground">{filteredEmpresaDashboards.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToOverview}
            className="border-border hover:bg-muted w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Visão Geral
          </Button>
          <div className="flex-1">
            <h2 className="text-foreground">{selectedMonth === 'all' ? (vendedorLogado ? `Minhas Empresas - 2024` : 'Todos os Meses - 2024') : `${getMonthName(selectedMonth)} 2024`}</h2>
            <p className="text-muted-foreground">{vendedorLogado ? 'Empresas onde você é o vendedor responsável' : 'Notas fiscais detalhadas por empresa/cliente'}</p>
          </div>
          {selectedMonth === 'all' && (
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar empresa/cliente..."
                value={monthSearch}
                onChange={(e) => setMonthSearch(e.target.value)}
                className="pl-10 border-border bg-input-background"
              />
            </div>
          )}
        </div>

        {/* Cards de resumo do mês */}
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="border border-border shadow-lg hover:shadow-xl transition-all bg-card group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm text-muted-foreground">Faturamento do Mês</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl text-foreground">{formatCurrency(totalMes)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalNotasMes} nota{totalNotasMes !== 1 ? 's' : ''} fiscal{totalNotasMes !== 1 ? 'is' : ''}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-lg hover:shadow-xl transition-all bg-card group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm text-muted-foreground">Empresas/Clientes</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl text-foreground">{notasPorCliente.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Clientes atendidos
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
                <div className="text-2xl text-foreground">
                  {formatCurrency(totalMes)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Soma de todas as notas
                </p>
              </CardContent>
            </Card>
        </div>

        {/* Dashboards e notas por empresa/cliente */}
        {selectedMonth === 'all' && filteredEmpresaDashboards.length > 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-foreground">Empresas/Clientes</h3>
              <p className="text-muted-foreground">
                {monthSearch ? `${filteredEmpresaDashboards.length} resultado(s) encontrado(s)` : 'Dashboard e notas fiscais de cada empresa/cliente'}
              </p>
            </div>

            {filteredEmpresaDashboards.map((empresa, index) => {
              // Encontrar as notas dessa empresa
              const clienteNotas = notasPorCliente.find(c => c.cliente === empresa.empresa);
              
              return (
                <div key={index} className="space-y-4">
                  {/* Dashboard da empresa */}
                  <Card className="border border-border shadow-lg bg-card rounded-2xl">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border rounded-t-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-card-foreground">{empresa.empresa}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {empresa.totalNotas} nota{empresa.totalNotas !== 1 ? 's' : ''} • {formatCurrency(empresa.totalValor)} total
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-muted-foreground text-sm">Valor Total</div>
                          <div className="text-foreground">{formatCurrency(empresa.totalValor)}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Gráfico de Faturamento */}
                        <div>
                          <h4 className="text-sm text-muted-foreground mb-4">Faturamento Mensal</h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={empresa.meses}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-blue-700" />
                              <XAxis dataKey="mesNome" stroke="#6b7280" className="dark:stroke-blue-400" fontSize={12} />
                              <YAxis stroke="#6b7280" className="dark:stroke-blue-400" fontSize={12} />
                              <Tooltip 
                                formatter={(value) => formatCurrency(Number(value))}
                                contentStyle={{ 
                                  backgroundColor: '#ffffff', 
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                  color: '#000000'
                                }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="valor" 
                                stroke="#3b82f6" 
                                strokeWidth={2} 
                                dot={{ fill: '#3b82f6', r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Gráfico de Quantidade */}
                        <div>
                          <h4 className="text-sm text-muted-foreground mb-4">Notas Fiscais por Mês</h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={empresa.meses}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-blue-700" />
                              <XAxis dataKey="mesNome" stroke="#6b7280" className="dark:stroke-blue-400" fontSize={12} />
                              <YAxis stroke="#6b7280" className="dark:stroke-blue-400" fontSize={12} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#ffffff', 
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                  color: '#000000'
                                }}
                              />
                              <Bar 
                                dataKey="quantidade" 
                                fill="#3b82f6" 
                                radius={[8, 8, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notas fiscais da empresa */}
                  {clienteNotas && (
                    <Card className="border border-border shadow-lg bg-card rounded-2xl">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border rounded-t-2xl">
                        <CardTitle className="text-card-foreground">Notas Fiscais de {empresa.empresa}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          {clienteNotas.notas.map((nota, notaIndex) => (
                            <div 
                              key={notaIndex}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:shadow-sm transition-shadow"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-primary" />
                                  <span className="text-sm text-foreground">{nota.numero}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{nota.descricao}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Emissão: {new Date(nota.dataEmissao).toLocaleDateString('pt-BR')}
                                  </span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">
                                    Vencimento: {new Date(nota.dataVencimento).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right mr-3">
                                  <div className="text-foreground">{formatCurrency(nota.valor)}</div>
                                  <div className="text-xs text-muted-foreground">{nota.categoria}</div>
                                </div>
                                {getStatusBadge(nota.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
            
            {selectedMonth === 'all' && monthSearch && filteredEmpresaDashboards.length === 0 && (
              <Card className="border border-border shadow-lg bg-card">
                <CardContent className="py-12 text-center">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma empresa encontrada com "{monthSearch}"</p>
                  <Button
                    variant="outline"
                    onClick={() => setMonthSearch('')}
                    className="mt-4"
                  >
                    Limpar pesquisa
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Lista de notas para mês específico (não "all") */}
        {selectedMonth !== 'all' && (
          <Card className="border border-border shadow-lg bg-card">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border">
              <CardTitle className="text-card-foreground">Notas Fiscais por Empresa/Cliente</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {notasPorCliente.length > 0 ? (
                <div className="space-y-4">
                  {notasPorCliente.map((cliente, index) => (
                    <Card key={index} className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                <Building2 className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-foreground">{cliente.cliente}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {cliente.quantidade} nota{cliente.quantidade !== 1 ? 's' : ''} fiscal{cliente.quantidade !== 1 ? 'is' : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl text-foreground">{formatCurrency(cliente.valor)}</div>
                            <p className="text-sm text-muted-foreground">
                              Média: {formatCurrency(cliente.valor / cliente.quantidade)}
                            </p>
                          </div>
                        </div>

                        {/* Detalhes das notas */}
                        <div className="space-y-2 mt-4 pt-4 border-t border-border">
                          {cliente.notas.map((nota, notaIndex) => (
                            <div 
                              key={notaIndex}
                              className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-primary" />
                                  <span className="text-sm text-foreground">{nota.numero}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{nota.descricao}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Emissão: {new Date(nota.dataEmissao).toLocaleDateString('pt-BR')}
                                  </span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">
                                    Vencimento: {new Date(nota.dataVencimento).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right mr-3">
                                  <div className="text-foreground">{formatCurrency(nota.valor)}</div>
                                  <div className="text-xs text-muted-foreground">{nota.categoria}</div>
                                </div>
                                {getStatusBadge(nota.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Building2 className="w-12 h-12 mx-auto text-primary mb-4" />
                  <p className="text-muted-foreground">Nenhuma nota fiscal encontrada para este mês</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Vista detalhada do vendedor
  if (selectedVendedor) {
    const vendedorData = vendedoresStats.find(v => v.vendedor.id === selectedVendedor);
    
    if (!vendedorData) {
      setSelectedVendedor(null);
      return null;
    }

    const vendedor = vendedorData.vendedor;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedVendedor(null)}
            className="border-border hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Vendedores
          </Button>
          <div>
            <h2 className="text-foreground">{vendedor.nome}</h2>
            <p className="text-muted-foreground">Informações detalhadas do vendedor</p>
          </div>
        </div>

        {/* Informações Pessoais */}
        <Card className="border border-border shadow-lg bg-card">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-card-foreground">Informações Pessoais</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Nome Completo</label>
                <p className="text-foreground">{vendedor.nome}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  {vendedor.email}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Telefone</label>
                <p className="text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  {vendedor.telefone}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Status</label>
                <div>
                  <Badge className={vendedor.status === 'ativo' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'bg-muted text-muted-foreground'}>
                    {vendedor.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Data de Cadastro</label>
                <p className="text-foreground">
                  {new Date(vendedor.dataCadastro).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas de Performance */}
        <Card className="border border-border shadow-lg bg-card">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-card-foreground">Estatísticas de Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border border-border bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Faturamento Total</p>
                      <p className="text-2xl text-foreground mt-1">{formatCurrency(vendedorData.totalValor)}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Notas Fiscais Emitidas</p>
                      <p className="text-2xl text-foreground mt-1">{vendedorData.totalNotas}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Empresas/Clientes</p>
                      <p className="text-2xl text-foreground mt-1">{vendedorData.empresas.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista de vendedores
  if (selectedView === 'vendedores') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-foreground">Vendedores</h2>
            <p className="text-muted-foreground">Performance de cada vendedor e suas empresas/clientes</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => {
                setEditingVendedor(null);
                setIsAddVendedorDialogOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Vendedor
            </Button>
            <Button 
              variant="outline"
              onClick={() => setSelectedView('overview')}
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </div>

        {/* Cards de Vendedores */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vendedoresStats.map((vendedorStat, index) => (
            <Card 
              key={index}
              className="border border-border bg-card hover:border-blue-500 hover:shadow-lg transition-all shadow-sm cursor-pointer"
              onClick={() => setSelectedVendedor(vendedorStat.vendedor.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white shadow-lg">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-foreground">{vendedorStat.vendedor.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">{vendedorStat.vendedor.cargo}</p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    Ativo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Faturamento</p>
                    <p className="text-foreground">{formatCurrency(vendedorStat.totalValor)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Notas</p>
                    <p className="text-foreground">{vendedorStat.totalNotas}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    <Building2 className="w-3 h-3 inline mr-1" />
                    {vendedorStat.empresas.length} empresa{vendedorStat.empresas.length !== 1 ? 's' : ''}/cliente{vendedorStat.empresas.length !== 1 ? 's' : ''}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {vendedorStat.empresas.slice(0, 3).map((empresa, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-400">
                        {empresa}
                      </Badge>
                    ))}
                    {vendedorStat.empresas.length > 3 && (
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-400">
                        +{vendedorStat.empresas.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVendedor(vendedorStat.vendedor.id);
                  }}
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {vendedoresStats.length === 0 && (
          <Card className="border border-border shadow-lg bg-card">
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <p className="text-muted-foreground">Nenhum vendedor encontrado</p>
            </CardContent>
          </Card>
        )}

        {/* Dialog de Adicionar Vendedor */}
        <AddVendedorDialog
          open={isAddVendedorDialogOpen}
          onOpenChange={setIsAddVendedorDialogOpen}
          onSave={handleSaveVendedor}
          vendedor={editingVendedor}
        />
      </div>
    );
  }

  // Vista por empresas
  if (selectedView === 'empresas') {
    // Agregar todas as empresas/clientes de todos os vendedores
    const todasEmpresas = new Map<string, { cliente: string; valor: number; quantidade: number; vendedores: Set<string> }>();
    
    const notasStr = localStorage.getItem('notasFiscais');
    const todasNotas: NotaFiscal[] = notasStr ? JSON.parse(notasStr) : [];
    
    todasNotas.forEach(nota => {
      const current = todasEmpresas.get(nota.cliente);
      if (current) {
        current.quantidade += 1;
        current.valor += nota.valor;
        current.vendedores.add(nota.colaboradorNome);
      } else {
        todasEmpresas.set(nota.cliente, {
          cliente: nota.cliente,
          quantidade: 1,
          valor: nota.valor,
          vendedores: new Set([nota.colaboradorNome])
        });
      }
    });

    const empresasArray = Array.from(todasEmpresas.values())
      .map(e => ({ ...e, vendedores: Array.from(e.vendedores) }))
      .sort((a, b) => b.valor - a.valor);

    // Se uma empresa foi selecionada, mostrar detalhes
    if (selectedEmpresa) {
      const notasEmpresa = todasNotas.filter(n => n.cliente === selectedEmpresa);
      const empresaData = empresasArray.find(e => e.cliente === selectedEmpresa);
      
      if (!empresaData) {
        setSelectedEmpresa(null);
        return null;
      }

      // Buscar dados cadastrais da empresa
      const empresasStr = localStorage.getItem('empresas');
      const empresasCadastradas = empresasStr ? JSON.parse(empresasStr) : [];
      const empresaCadastro = empresasCadastradas.find((e: any) => 
        e.nomeCompleto === selectedEmpresa || 
        e.razaoSocial === selectedEmpresa || 
        selectedEmpresa.includes(e.nomeCompleto.split(' ')[0]) ||
        (e.razaoSocial && selectedEmpresa.includes(e.razaoSocial.split(' ')[0]))
      );

      // Calcular evolução mensal
      const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const monthsMap = new Map<string, { quantidade: number; valor: number }>();
      
      mesesNomes.forEach((nome, index) => {
        const mesKey = String(index + 1).padStart(2, '0');
        monthsMap.set(mesKey, { quantidade: 0, valor: 0 });
      });

      notasEmpresa.forEach(nota => {
        const mes = nota.dataEmissao.substring(5, 7);
        const current = monthsMap.get(mes);
        if (current) {
          current.quantidade += 1;
          current.valor += nota.valor;
        }
      });

      const evolucaoMensal = Array.from(monthsMap.entries()).map(([mes, data]) => ({
        mes,
        mesNome: mesesNomes[parseInt(mes) - 1],
        quantidade: data.quantidade,
        valor: data.valor
      }));

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedEmpresa(null)}
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Empresas
            </Button>
            <div>
              <h2 className="text-foreground">{selectedEmpresa}</h2>
              <p className="text-muted-foreground">Dados cadastrais e informações da empresa</p>
            </div>
          </div>

          {/* Dados Cadastrais da Empresa */}
          {empresaCadastro && (
            <Card className="border border-border shadow-lg bg-card">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-card-foreground">Dados da Empresa (Prestador)</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Estes dados serão usados automaticamente nas notas fiscais</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-muted-foreground">Razão Social</label>
                      <p className="text-foreground mt-1">{empresaCadastro.razaoSocial || empresaCadastro.nomeCompleto || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">CNPJ</label>
                      <p className="text-foreground mt-1">{empresaCadastro.cnpj || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">CNAE</label>
                      <p className="text-foreground mt-1">{empresaCadastro.cnae || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Categoria</label>
                      <p className="text-foreground mt-1">{empresaCadastro.categoria || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Inscrição Municipal</label>
                      <p className="text-foreground mt-1">{empresaCadastro.inscricaoMunicipal || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Inscrição Estadual</label>
                      <p className="text-foreground mt-1">{empresaCadastro.inscricaoEstadual || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-muted-foreground">Endereço Completo</label>
                      <p className="text-foreground mt-1">{empresaCadastro.endereco || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">CEP</label>
                      <p className="text-foreground mt-1">{empresaCadastro.cep || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Município / UF</label>
                      <p className="text-foreground mt-1">{empresaCadastro.municipio && empresaCadastro.uf ? `${empresaCadastro.municipio} - ${empresaCadastro.uf}` : empresaCadastro.municipio || empresaCadastro.uf || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="text-foreground mt-1">{empresaCadastro.email || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Telefone</label>
                      <p className="text-foreground mt-1">{empresaCadastro.telefone || '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-foreground">Visão por Empresa</h2>
            <p className="text-muted-foreground">Todas as empresas/clientes e seus vendedores - Clique para ver detalhes</p>
          </div>
          <Button 
            onClick={() => setSelectedView('overview')}
            variant="outline"
            className="border-border hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>

        {/* Lista de Empresas */}
        <div className="grid gap-4 md:grid-cols-2">
          {empresasArray.map((empresa, index) => (
            <Card 
              key={index} 
              className="border border-border bg-card hover:shadow-lg transition-all shadow-sm cursor-pointer hover:border-blue-500"
              onClick={() => setSelectedEmpresa(empresa.cliente)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-foreground">{empresa.cliente}</h3>
                        <p className="text-sm text-muted-foreground">
                          {empresa.quantidade} nota{empresa.quantidade !== 1 ? 's' : ''} fiscal{empresa.quantidade !== 1 ? 'is' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl text-foreground">{formatCurrency(empresa.valor)}</div>
                    <p className="text-sm text-muted-foreground">
                      Média: {formatCurrency(empresa.valor / empresa.quantidade)}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    <UserCheck className="w-3 h-3 inline mr-1" />
                    Vendedor{empresa.vendedores.length !== 1 ? 'es' : ''}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {empresa.vendedores.map((vendedor, i) => (
                      <Badge key={i} className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {vendedor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {empresasArray.length === 0 && (
          <Card className="border border-border shadow-lg bg-card">
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <p className="text-muted-foreground">Nenhuma empresa/cliente encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Vista geral (visão padrão)
  return (
    <div className="space-y-6">
      {/* Card de boas-vindas para vendedor */}
      {vendedorLogado && (
        <Card className="border border-blue-200 dark:border-blue-800 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserCheck className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg text-foreground">Olá, {vendedorLogado.nome}!</h3>
                <p className="text-sm text-muted-foreground">
                  Vendedor • {vendedorLogado.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div>
        <h2 className="text-foreground">Dashboard Geral</h2>
        <p className="text-muted-foreground">{vendedorLogado ? 'Visão geral do seu desempenho - Clique em um mês para ver detalhes' : 'Visão geral do faturamento da empresa - Clique em um mês para ver detalhes'}</p>
      </div>

      {/* Cards de Estatísticas - apenas para admin */}
      {!vendedorLogado && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border shadow-lg hover:shadow-xl transition-all bg-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm text-muted-foreground">Faturamento Total</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl text-foreground">{formatCurrency(stats.faturamentoTotal)}</div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg hover:shadow-xl transition-all bg-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm text-muted-foreground">Colaboradores</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl text-foreground">{stats.totalColaboradores}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ativos no sistema
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg hover:shadow-xl transition-all bg-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm text-muted-foreground">Notas Fiscais</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl text-foreground">{stats.totalNotasFiscais}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Emitidas este ano
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg hover:shadow-xl transition-all bg-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm text-muted-foreground">Crescimento</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl text-foreground">+{stats.crescimento}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Crescimento mensal
            </p>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Botões de acesso rápido */}
      {!vendedorLogado ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card 
            className="border border-border bg-card shadow-lg hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer group"
            onClick={() => setSelectedView('vendedores')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground">Ver Vendedores</h3>
                </div>
                <ArrowLeft className="w-5 h-5 text-blue-500 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border border-border bg-card shadow-lg hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer group"
            onClick={() => setSelectedView('empresas')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground">Visão por Empresa</h3>
                </div>
                <ArrowLeft className="w-5 h-5 text-blue-500 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border border-border bg-card shadow-lg hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer group"
            onClick={() => setSelectedMonth('all')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground">Todos Dashboards</h3>
                </div>
                <ArrowLeft className="w-5 h-5 text-blue-500 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1 max-w-md">
          <Card 
            className="border border-border bg-card shadow-lg hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer group"
            onClick={() => setSelectedMonth('all')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground">Todos Dashboards</h3>
                </div>
                <ArrowLeft className="w-5 h-5 text-blue-500 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border shadow-lg bg-card overflow-hidden rounded-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border">
            <CardTitle className="text-card-foreground">Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-blue-700" />
                <XAxis dataKey="mesNome" stroke="#6b7280" className="dark:stroke-blue-400" />
                <YAxis stroke="#6b7280" className="dark:stroke-blue-400" />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: '#000000'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', r: 4 }}
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg bg-card overflow-hidden rounded-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border">
            <CardTitle className="text-card-foreground">Notas Fiscais por Mês</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Clique em uma barra para ver detalhes</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-blue-700" />
                <XAxis dataKey="mesNome" stroke="#6b7280" className="dark:stroke-blue-400" />
                <YAxis stroke="#6b7280" className="dark:stroke-blue-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: '#000000'
                  }}
                />
                <Bar 
                  dataKey="quantidade" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  onClick={handleBarClick}
                  cursor="pointer"
                >
                  {monthlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill="#3b82f6"
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Adicionar Empresa */}
      <AddEmpresaDialog
        open={isAddEmpresaDialogOpen}
        onOpenChange={setIsAddEmpresaDialogOpen}
        onSave={handleSaveEmpresa}
        empresa={null}
      />

      {/* Dialog de Adicionar Vendedor */}
      <AddVendedorDialog
        open={isAddVendedorDialogOpen}
        onOpenChange={setIsAddVendedorDialogOpen}
        onSave={handleSaveVendedor}
        vendedor={editingVendedor}
      />
    </div>
  );
}
