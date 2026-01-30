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
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { NotaFiscal } from './NotasFiscais';
import { Colaborador } from './Colaboradores';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calculator, Building2, User, CreditCard, FileText, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Interface para Empresa
interface Empresa {
  id: string;
  razaoSocial: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco?: string;
  cep?: string;
  municipio?: string;
  uf?: string;
  email?: string;
  telefone?: string;
}

// Lista de Códigos de Serviço - LC 116/2003
const CODIGOS_SERVICO = [
  { codigo: '01.01', descricao: 'Análise e desenvolvimento de sistemas' },
  { codigo: '01.02', descricao: 'Programação' },
  { codigo: '01.03', descricao: 'Processamento de dados e congêneres' },
  { codigo: '01.04', descricao: 'Elaboração de programas de computadores' },
  { codigo: '01.05', descricao: 'Licenciamento ou cessão de direito de uso de programas' },
  { codigo: '01.06', descricao: 'Assessoria e consultoria em informática' },
  { codigo: '01.07', descricao: 'Suporte técnico em informática' },
  { codigo: '01.08', descricao: 'Planejamento, confecção, manutenção e atualização de páginas eletrônicas' },
  { codigo: '01.09', descricao: 'Disponibilização de conteúdo de áudio, vídeo, imagem e texto' },
  { codigo: '02.01', descricao: 'Serviços de pesquisas e desenvolvimento de qualquer natureza' },
  { codigo: '03.02', descricao: 'Cessão de direito de uso de marcas e de sinais de propaganda' },
  { codigo: '03.03', descricao: 'Exploração de salões de festas, centro de convenções' },
  { codigo: '03.04', descricao: 'Locação, sublocação, arrendamento, direito de passagem ou permissão de uso' },
  { codigo: '03.05', descricao: 'Cessão de andaimes, palcos, coberturas e outras estruturas' },
  { codigo: '04.01', descricao: 'Medicina e biomedicina' },
  { codigo: '04.02', descricao: 'Análises clínicas, patologia, eletricidade médica' },
  { codigo: '04.03', descricao: 'Hospitais, clínicas, laboratórios, sanatórios' },
  { codigo: '04.06', descricao: 'Enfermagem, inclusive serviços auxiliares' },
  { codigo: '04.10', descricao: 'Nutrição' },
  { codigo: '04.11', descricao: 'Obstetrícia' },
  { codigo: '04.12', descricao: 'Odontologia' },
  { codigo: '04.16', descricao: 'Psicologia' },
  { codigo: '05.01', descricao: 'Medicina veterinária e zootecnia' },
  { codigo: '06.01', descricao: 'Barbearia, cabeleireiros, manicuros, pedicuros e congêneres' },
  { codigo: '06.02', descricao: 'Esteticistas, tratamento de pele, depilação e congêneres' },
  { codigo: '06.03', descricao: 'Banhos, duchas, sauna, massagens e congêneres' },
  { codigo: '06.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas' },
  { codigo: '06.05', descricao: 'Centros de emagrecimento, spa e congêneres' },
  { codigo: '07.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo' },
  { codigo: '07.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras' },
  { codigo: '07.03', descricao: 'Elaboração de planos diretores, estudos de viabilidade' },
  { codigo: '07.04', descricao: 'Demolição' },
  { codigo: '07.05', descricao: 'Reparação, conservação e reforma de edifícios' },
  { codigo: '07.09', descricao: 'Varrição, coleta, remoção, incineração, tratamento de lixo' },
  { codigo: '07.10', descricao: 'Limpeza, manutenção e conservação de vias e logradouros públicos' },
  { codigo: '07.16', descricao: 'Florestamento, reflorestamento, semeadura, adubação e congêneres' },
  { codigo: '08.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior' },
  { codigo: '08.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional' },
  { codigo: '09.01', descricao: 'Hospedagem de qualquer natureza em hotéis, apart-service' },
  { codigo: '09.02', descricao: 'Agenciamento, organização, promoção, intermediação e execução de programas de turismo' },
  { codigo: '10.01', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros' },
  { codigo: '10.02', descricao: 'Agenciamento, corretagem ou intermediação de títulos quaisquer' },
  { codigo: '10.03', descricao: 'Agenciamento, corretagem ou intermediação de direitos de propriedade industrial' },
  { codigo: '10.04', descricao: 'Agenciamento, corretagem ou intermediação de contratos de arrendamento mercantil' },
  { codigo: '10.05', descricao: 'Agenciamento, corretagem ou intermediação de bens móveis ou imóveis' },
  { codigo: '10.09', descricao: 'Representação de qualquer natureza, inclusive comercial' },
  { codigo: '10.10', descricao: 'Distribuição de bens de terceiros' },
  { codigo: '11.01', descricao: 'Guarda e estacionamento de veículos terrestres automotores' },
  { codigo: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens e pessoas' },
  { codigo: '11.03', descricao: 'Escolta, inclusive de veículos e cargas' },
  { codigo: '11.04', descricao: 'Armazenamento, depósito, carga, descarga, arrumação e guarda de bens' },
  { codigo: '12.01', descricao: 'Espetáculos teatrais' },
  { codigo: '12.02', descricao: 'Exibições cinematográficas' },
  { codigo: '12.03', descricao: 'Espetáculos circenses' },
  { codigo: '12.06', descricao: 'Boates, taxi-dancing e congêneres' },
  { codigo: '12.07', descricao: 'Shows, ballet, danças, desfiles, bailes, óperas, concertos, recitais' },
  { codigo: '12.08', descricao: 'Feiras, exposições, congressos e congêneres' },
  { codigo: '12.09', descricao: 'Bilhares, boliches e diversões eletrônicas ou não' },
  { codigo: '12.13', descricao: 'Produção, mediante ou sem encomenda prévia, de eventos' },
  { codigo: '12.14', descricao: 'Fornecimento de música para ambientes fechados ou não' },
  { codigo: '12.15', descricao: 'Desfiles de blocos carnavalescos ou folclóricos, trios elétricos' },
  { codigo: '12.16', descricao: 'Exibição de filmes, entrevistas, musicais, espetáculos, shows' },
  { codigo: '12.17', descricao: 'Recreação e animação, inclusive em festas e eventos' },
  { codigo: '13.02', descricao: 'Fonografia ou gravação de sons, inclusive trucagem' },
  { codigo: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação' },
  { codigo: '13.04', descricao: 'Reprografia, microfilmagem e digitalização' },
  { codigo: '13.05', descricao: 'Composição gráfica, fotocomposição, clicheria, zincografia' },
  { codigo: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga' },
  { codigo: '14.02', descricao: 'Conserto, restauração, manutenção e conservação de máquinas' },
  { codigo: '14.03', descricao: 'Recondicionamento de motores' },
  { codigo: '14.04', descricao: 'Recauchutagem ou regeneração de pneus' },
  { codigo: '14.05', descricao: 'Restauração, recondicionamento, acondicionamento, pintura' },
  { codigo: '14.06', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos' },
  { codigo: '14.09', descricao: 'Alfaiataria e costura, quando o material for fornecido pelo usuário final' },
  { codigo: '14.10', descricao: 'Tinturaria e lavanderia' },
  { codigo: '14.11', descricao: 'Tapeçaria e reforma de estofamentos em geral' },
  { codigo: '14.12', descricao: 'Funilaria e lanternagem' },
  { codigo: '14.13', descricao: 'Carpintaria e serralheria' },
  { codigo: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito' },
  { codigo: '15.09', descricao: 'Arrendamento mercantil (leasing)' },
  { codigo: '15.10', descricao: 'Serviços relacionados a cobranças, recebimentos ou pagamentos' },
  { codigo: '15.18', descricao: 'Serviços de regulação de sinistros vinculados a contratos de seguros' },
  { codigo: '16.01', descricao: 'Serviços de transporte de natureza municipal' },
  { codigo: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza' },
  { codigo: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente, secretaria' },
  { codigo: '17.03', descricao: 'Planejamento, coordenação, programação ou organização técnica' },
  { codigo: '17.05', descricao: 'Fornecimento de mão-de-obra, mesmo em caráter temporário' },
  { codigo: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas' },
  { codigo: '17.08', descricao: 'Franquia (franchising)' },
  { codigo: '17.09', descricao: 'Perícias, laudos, exames técnicos e análises técnicas' },
  { codigo: '17.10', descricao: 'Planejamento, organização e administração de feiras, exposições' },
  { codigo: '17.11', descricao: 'Organização de festas e recepções; buffet' },
  { codigo: '17.12', descricao: 'Administração em geral, inclusive de bens e negócios de terceiros' },
  { codigo: '17.13', descricao: 'Leilão e hasta pública' },
  { codigo: '17.14', descricao: 'Advocacia' },
  { codigo: '17.15', descricao: 'Arbitragem de qualquer espécie, inclusive jurídica' },
  { codigo: '17.16', descricao: 'Auditoria' },
  { codigo: '17.17', descricao: 'Análise de Organização e Métodos' },
  { codigo: '17.18', descricao: 'Atuária e cálculos técnicos de qualquer natureza' },
  { codigo: '17.19', descricao: 'Contabilidade, inclusive serviços técnicos e auxiliares' },
  { codigo: '17.20', descricao: 'Consultoria e assessoria econômica ou financeira' },
  { codigo: '17.21', descricao: 'Estatística' },
  { codigo: '17.22', descricao: 'Cobrança em geral' },
  { codigo: '17.23', descricao: 'Assessoria, análise, avaliação, atendimento, consulta' },
  { codigo: '17.24', descricao: 'Revisão de textos' },
  { codigo: '17.25', descricao: 'Regulação de sinistros vinculados a contratos de seguros' },
  { codigo: '18.01', descricao: 'Serviços de regulação de sinistros vinculados a contratos de seguros' },
  { codigo: '19.01', descricao: 'Serviços de distribuição e venda de bilhetes e demais produtos de loteria' },
  { codigo: '20.01', descricao: 'Serviços portuários, ferroportuários, utilização de porto' },
  { codigo: '20.02', descricao: 'Serviços aeroportuários, utilização de aeroporto' },
  { codigo: '20.03', descricao: 'Serviços de terminais rodoviários, ferroviários, metroviários' },
  { codigo: '21.01', descricao: 'Serviços de registros públicos, cartorários e notariais' },
  { codigo: '22.01', descricao: 'Serviços de exploração de rodovia' },
  { codigo: '23.01', descricao: 'Serviços de programação e comunicação visual, desenho industrial' },
  { codigo: '24.01', descricao: 'Serviços de chaveiros, confecção de carimbos, placas' },
  { codigo: '25.01', descricao: 'Funerais, inclusive fornecimento de caixão, urna ou esquifes' },
  { codigo: '25.02', descricao: 'Translado intramunicipal e cremação de corpos e partes de corpos' },
  { codigo: '25.03', descricao: 'Planos ou convênio funerários' },
  { codigo: '25.04', descricao: 'Manutenção e conservação de jazigos e cemitérios' },
  { codigo: '26.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências' },
  { codigo: '27.01', descricao: 'Serviços de assistência social' },
  { codigo: '28.01', descricao: 'Serviços de avaliação de bens e serviços de qualquer natureza' },
  { codigo: '29.01', descricao: 'Serviços de biblioteconomia' },
  { codigo: '30.01', descricao: 'Serviços de biologia, biotecnologia e química' },
  { codigo: '31.01', descricao: 'Serviços técnicos em edificações, eletrônica, eletrotécnica' },
  { codigo: '32.01', descricao: 'Serviços de desenhos técnicos' },
  { codigo: '33.01', descricao: 'Serviços de desembaraço aduaneiro, comissários, despachantes' },
  { codigo: '34.01', descricao: 'Serviços de investigações particulares, detetives e congêneres' },
  { codigo: '35.01', descricao: 'Serviços de reportagem, assessoria de imprensa, jornalismo' },
  { codigo: '36.01', descricao: 'Serviços de meteorologia' },
  { codigo: '37.01', descricao: 'Serviços de artistas, atletas, modelos e manequins' },
  { codigo: '38.01', descricao: 'Serviços de museologia' },
  { codigo: '39.01', descricao: 'Serviços de ourivesaria e lapidação' },
  { codigo: '40.01', descricao: 'Obras de arte sob encomenda' }
];

interface AddNotaFiscalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (nota: NotaFiscal) => void;
  nota?: NotaFiscal | null;
}

export default function AddNotaFiscalDialog({
  open,
  onOpenChange,
  onSave,
  nota
}: AddNotaFiscalDialogProps) {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [showEmpresasList, setShowEmpresasList] = useState(false);
  const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<NotaFiscal>({
    defaultValues: nota || {
      id: '',
      numero: '',
      codigoVerificacao: '',
      cliente: '',
      colaboradorId: '',
      colaboradorNome: '',
      valor: 0,
      dataEmissao: new Date().toISOString().split('T')[0],
      dataVencimento: '',
      dataEnvio: '',
      status: 'não emitida',
      descricao: '',
      categoria: ''
    }
  });

  const status = watch('status');
  const colaboradorId = watch('colaboradorId');
  const valor = watch('valor') || 0;
  const aliquota = watch('aliquota') || 0;
  const valorDeducoes = watch('valorDeducoes') || 0;
  const baseCalculo = watch('baseCalculo') || 0;
  const valorIss = watch('valorIss') || 0;
  const valorAproximadoTributos = watch('valorAproximadoTributos') || 0;
  
  // Função para converter valores com vírgula ou ponto para número
  const parseValor = (val: any): number => {
    if (!val) return 0;
    const strVal = String(val).replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(strVal);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Cálculos para os impostos totais
  const valorInss = watch('valorInss') || 0;
  const valorIrrf = watch('valorIrrf') || 0;
  const valorCsll = watch('valorCsll') || 0;
  const valorCofins = watch('valorCofins') || 0;
  const valorPis = watch('valorPis') || 0;
  
  const totalImpostos = parseValor(valorInss) + parseValor(valorIrrf) + parseValor(valorCsll) + parseValor(valorCofins) + parseValor(valorPis) + parseValor(valorIss);
  const valorLiquido = parseValor(valor) - totalImpostos;
  
  // Calcular porcentagem dos tributos
  const percentualTributos = parseValor(valor) > 0 
    ? (parseValor(valorAproximadoTributos) / parseValor(valor)) * 100 
    : 0;

  useEffect(() => {
    // Carregar colaboradores
    const stored = localStorage.getItem('colaboradores');
    if (stored) {
      setColaboradores(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // Resetar formulário quando a nota mudar ou o modal abrir
    if (open) {
      if (nota) {
        reset(nota);
      } else {
        reset({
          id: '',
          numero: '',
          codigoVerificacao: '',
          cliente: '',
          colaboradorId: '',
          colaboradorNome: '',
          valor: 0,
          dataEmissao: new Date().toISOString().split('T')[0],
          dataVencimento: '',
          dataEnvio: '',
          status: 'não emitida',
          descricao: '',
          categoria: ''
        });
      }
    }
  }, [open, nota, reset]);

  useEffect(() => {
    // Carregar empresas
    const stored = localStorage.getItem('empresas');
    if (stored) {
      const empresasData = JSON.parse(stored);
      console.log('Empresas carregadas:', empresasData);
      setEmpresas(empresasData);
    } else {
      console.log('Nenhuma empresa encontrada no localStorage');
      // Criar empresas padrão se não existirem
      const empresasTomadoras = [
        {
          id: 'et1',
          razaoSocial: 'MICROSOFT BRASIL LTDA',
          cnpj: '04.712.500/0001-07',
          inscricaoEstadual: '117.690.111.118',
          inscricaoMunicipal: '8.345.632-0',
          endereco: 'AV. PRESIDENTE JUSCELINO KUBITSCHEK, 1909 - 4º ANDAR - VILA NOVA CONCEIÇÃO',
          cep: '04543-011',
          municipio: 'SÃO PAULO',
          uf: 'SP',
          email: 'contato@microsoft.com.br',
          telefone: '(11) 3443-8200'
        },
        {
          id: 'et2',
          razaoSocial: 'GOOGLE BRASIL INTERNET LTDA',
          cnpj: '06.990.590/0001-23',
          inscricaoEstadual: '149.418.890.113',
          inscricaoMunicipal: '9.235.874-1',
          endereco: 'AV. BRIG. FARIA LIMA, 3477 - 12º ANDAR - ITAIM BIBI',
          cep: '04538-133',
          municipio: 'SÃO PAULO',
          uf: 'SP',
          email: 'contato@google.com.br',
          telefone: '(11) 2395-8400'
        },
        {
          id: 'et3',
          razaoSocial: 'AMAZON SERVICOS DE VAREJO DO BRASIL LTDA',
          cnpj: '15.436.940/0001-03',
          inscricaoEstadual: '153.589.912.110',
          inscricaoMunicipal: '7.892.345-2',
          endereco: 'AV. PRESIDENTE JUSCELINO KUBITSCHEK, 2041 - TORRE A - VILA OLÍMPIA',
          cep: '04543-011',
          municipio: 'SÃO PAULO',
          uf: 'SP',
          email: 'contato@amazon.com.br',
          telefone: '(11) 3003-2244'
        },
        {
          id: 'et4',
          razaoSocial: 'BANCO BRADESCO S.A.',
          cnpj: '60.746.948/0001-12',
          inscricaoEstadual: '107.548.890.111',
          inscricaoMunicipal: '5.678.234-8',
          endereco: 'RUA HENRIQUE MONTEIRO, 236 - PINHEIROS',
          cep: '05423-020',
          municipio: 'SÃO PAULO',
          uf: 'SP',
          email: 'relacionamento@bradesco.com.br',
          telefone: '(11) 2178-0800'
        },
        {
          id: 'et5',
          razaoSocial: 'ITAÚ UNIBANCO S.A.',
          cnpj: '60.701.190/0001-04',
          inscricaoEstadual: '106.443.856.117',
          inscricaoMunicipal: '4.234.567-3',
          endereco: 'PRAÇA ALFREDO EGYDIO DE SOUZA ARANHA, 100 - PARQUE JABAQUARA',
          cep: '04344-902',
          municipio: 'SÃO PAULO',
          uf: 'SP',
          email: 'contato@itau-unibanco.com.br',
          telefone: '(11) 5029-1300'
        },
        {
          id: 'et6',
          razaoSocial: 'PETROBRAS - PETRÓLEO BRASILEIRO S.A.',
          cnpj: '33.000.167/0001-01',
          inscricaoEstadual: '78.916.764.119',
          inscricaoMunicipal: '3.456.789-5',
          endereco: 'AV. REPÚBLICA DO CHILE, 65 - CENTRO',
          cep: '20031-912',
          municipio: 'RIO DE JANEIRO',
          uf: 'RJ',
          email: 'relacionamento@petrobras.com.br',
          telefone: '(21) 3224-1510'
        },
        {
          id: 'et7',
          razaoSocial: 'VALE S.A.',
          cnpj: '33.592.510/0001-54',
          inscricaoEstadual: '062.286.285.0081',
          inscricaoMunicipal: '2.345.678-1',
          endereco: 'AV. DAS AMÉRICAS, 700 - BL. 2 - 5º ANDAR - BARRA DA TIJUCA',
          cep: '22640-100',
          municipio: 'RIO DE JANEIRO',
          uf: 'RJ',
          email: 'contato@vale.com',
          telefone: '(21) 3485-3900'
        },
        {
          id: 'et8',
          razaoSocial: 'AMBEV - COMPANHIA DE BEBIDAS DAS AMÉRICAS',
          cnpj: '07.526.557/0001-00',
          inscricaoEstadual: '117.511.726.116',
          inscricaoMunicipal: '8.901.234-7',
          endereco: 'RUA DR. RENATO PAES DE BARROS, 1017 - 4º ANDAR - ITAIM BIBI',
          cep: '04530-001',
          municipio: 'SÃO PAULO',
          uf: 'SP',
          email: 'sac@ambev.com.br',
          telefone: '(11) 2122-1300'
        },
        {
          id: 'et9',
          razaoSocial: 'MAGAZINE LUIZA S.A.',
          cnpj: '47.960.950/0001-21',
          inscricaoEstadual: '283.062.408.119',
          inscricaoMunicipal: '6.789.012-4',
          endereco: 'RUA ARNULFO DE LIMA, 2385 - VILA SANTA CRUZ',
          cep: '14.403-471',
          municipio: 'FRANCA',
          uf: 'SP',
          email: 'contato@magazineluiza.com.br',
          telefone: '(16) 3711-2300'
        },
        {
          id: 'et10',
          razaoSocial: 'TELEFÔNICA BRASIL S.A.',
          cnpj: '02.558.157/0001-62',
          inscricaoEstadual: '111.234.567.118',
          inscricaoMunicipal: '1.234.567-9',
          endereco: 'AV. ENGENHEIRO LUÍS CARLOS BERRINI, 1376 - CIDADE MONÇÕES',
          cep: '04571-936',
          municipio: 'SÃO PAULO',
          uf: 'SP',
          email: 'atendimento@telefonica.com.br',
          telefone: '(11) 3430-3000'
        }
      ];
      localStorage.setItem('empresas', JSON.stringify(empresasTomadoras));
      setEmpresas(empresasTomadoras);
      console.log('Empresas criadas e salvas:', empresasTomadoras);
    }
  }, []);

  useEffect(() => {
    if (nota) {
      reset(nota);
    } else {
      // Gerar número automático para nova nota
      const stored = localStorage.getItem('notasFiscais');
      const notas = stored ? JSON.parse(stored) : [];
      const nextNumber = `NF-2024-${String(notas.length + 1).padStart(3, '0')}`;
      
      reset({
        id: '',
        numero: nextNumber,
        codigoVerificacao: '',
        cliente: '',
        colaboradorId: '',
        colaboradorNome: '',
        valor: 0,
        dataEmissao: new Date().toISOString().split('T')[0],
        dataVencimento: '',
        dataEnvio: '',
        status: 'não emitida',
        descricao: '',
        categoria: ''
      });
    }
  }, [nota, reset, open]);

  const onSubmit = (data: NotaFiscal) => {
    // Encontrar o nome do colaborador
    const colaborador = colaboradores.find(c => c.id === data.colaboradorId);
    
    const notaData = {
      ...data,
      id: nota?.id || Date.now().toString(),
      colaboradorNome: colaborador?.nome || '',
      valor: Number(data.valor),
      baseCalculo: baseCalculo,
      valorIss: valorIss,
      dataEnvio: data.dataEnvio || undefined
    };
    
    onSave(notaData);
    onOpenChange(false);
    reset();
  };

  // Função para filtrar empresas com base no texto digitado
  const handleTomadorChange = (value: string) => {
    setValue('tomadorRazaoSocial', value);
    if (value.trim().length > 0) {
      const filtered = empresas.filter(e => 
        e.razaoSocial.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEmpresas(filtered);
      setShowEmpresasList(filtered.length > 0);
    } else {
      setFilteredEmpresas([]);
      setShowEmpresasList(false);
    }
  };

  // Função para selecionar uma empresa da lista
  const selectEmpresa = (empresa: Empresa) => {
    setValue('tomadorRazaoSocial', empresa.razaoSocial);
    setValue('tomadorCpfCnpj', empresa.cnpj || '');
    setValue('tomadorInscricaoEstadual', empresa.inscricaoEstadual || '');
    setValue('tomadorInscricaoMunicipal', empresa.inscricaoMunicipal || '');
    setValue('tomadorEndereco', empresa.endereco || '');
    setValue('tomadorMunicipio', empresa.municipio || '');
    setValue('tomadorUf', empresa.uf || '');
    setValue('tomadorEmail', empresa.email || '');
    setShowEmpresasList(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-card-foreground text-2xl">
            {nota ? 'Editar Nota Fiscal' : 'Emitir Nota Fiscal'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha todos os dados da nota fiscal conforme o espelho
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="prestador">Prestador</TabsTrigger>
              <TabsTrigger value="tomador">Tomador</TabsTrigger>
              <TabsTrigger value="valores">Valores</TabsTrigger>
              <TabsTrigger value="outras">Outras Info</TabsTrigger>
            </TabsList>

            {/* ABA GERAL */}
            <TabsContent value="geral" className="space-y-4 mt-4">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numero" className="text-foreground">Número da Nota *</Label>
                      <Input
                        id="numero"
                        {...register('numero', { required: 'Número é obrigatório' })}
                        placeholder="NF-2024-001"
                        className="border-border bg-input-background"
                      />
                      {errors.numero && (
                        <p className="text-sm text-destructive">{errors.numero.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataEmissao" className="text-foreground">Data e Hora da Emissão *</Label>
                      <Input
                        id="dataEmissao"
                        type="datetime-local"
                        {...register('dataEmissao', { required: 'Data de emissão é obrigatória' })}
                        className="border-border bg-input-background"
                      />
                      {errors.dataEmissao && (
                        <p className="text-sm text-destructive">{errors.dataEmissao.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="codigoVerificacao" className="text-foreground">Código de Verificação</Label>
                      <Input
                        id="codigoVerificacao"
                        {...register('codigoVerificacao')}
                        placeholder="Código de verificação"
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente" className="text-foreground">Nome do Cliente *</Label>
                      <Input
                        id="cliente"
                        {...register('cliente', { required: 'Nome do cliente é obrigatório' })}
                        placeholder="Nome da empresa cliente"
                        className="border-border bg-input-background"
                      />
                      {errors.cliente && (
                        <p className="text-sm text-destructive">{errors.cliente.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="colaboradorId" className="text-foreground">Colaborador Responsável *</Label>
                      <Select
                        value={colaboradorId}
                        onValueChange={(value) => setValue('colaboradorId', value)}
                      >
                        <SelectTrigger className="border-border">
                          <SelectValue placeholder="Selecione o colaborador" />
                        </SelectTrigger>
                        <SelectContent>
                          {colaboradores.map((colaborador) => (
                            <SelectItem key={colaborador.id} value={colaborador.id}>
                              {colaborador.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.colaboradorId && (
                        <p className="text-sm text-destructive">Colaborador é obrigatório</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-foreground">Status *</Label>
                      <Select
                        value={status}
                        onValueChange={(value) => setValue('status', value as NotaFiscal['status'])}
                      >
                        <SelectTrigger className="border-border">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="não emitida">Não Emitida</SelectItem>
                          <SelectItem value="emitida">Emitida</SelectItem>
                          <SelectItem value="conferida">Conferida</SelectItem>
                          <SelectItem value="enviada">Enviada</SelectItem>
                          <SelectItem value="paga">Paga</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoria" className="text-foreground">Categoria *</Label>
                      <Input
                        id="categoria"
                        {...register('categoria', { required: 'Categoria é obrigatória' })}
                        placeholder="Ex: Serviços, Consultoria"
                        className="border-border bg-input-background"
                      />
                      {errors.categoria && (
                        <p className="text-sm text-destructive">{errors.categoria.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao" className="text-foreground">Discriminação dos Serviços *</Label>
                    <Textarea
                      id="descricao"
                      {...register('descricao', { required: 'Descrição é obrigatória' })}
                      placeholder="Descreva detalhadamente os serviços prestados..."
                      rows={4}
                      className="border-border bg-input-background"
                    />
                    {errors.descricao && (
                      <p className="text-sm text-destructive">{errors.descricao.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA PRESTADOR */}
            <TabsContent value="prestador" className="space-y-4 mt-4">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Prestador de Serviço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prestadorRazaoSocial" className="text-foreground">Nome/Razão Social</Label>
                    <Input
                      id="prestadorRazaoSocial"
                      {...register('prestadorRazaoSocial')}
                      placeholder="NOVIGO TECNOLOGIA DA INFORMAÇÃO S.A"
                      className="border-border bg-input-background"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prestadorCpfCnpj" className="text-foreground">CPF/CNPJ</Label>
                      <Input
                        id="prestadorCpfCnpj"
                        {...register('prestadorCpfCnpj')}
                        placeholder="00.000.000/0000-00"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prestadorInscricaoEstadual" className="text-foreground">Inscrição Estadual</Label>
                      <Input
                        id="prestadorInscricaoEstadual"
                        {...register('prestadorInscricaoEstadual')}
                        placeholder="000.000.000.000"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prestadorInscricaoMunicipal" className="text-foreground">Inscrição Municipal</Label>
                      <Input
                        id="prestadorInscricaoMunicipal"
                        {...register('prestadorInscricaoMunicipal')}
                        placeholder="0.000.000-0"
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prestadorEndereco" className="text-foreground">Endereço</Label>
                    <Input
                      id="prestadorEndereco"
                      {...register('prestadorEndereco')}
                      placeholder="AV. BRIG. FARIA LIMA, 1234 - 11º ANDAR - JARDIM PAULISTANO - CEP 01451-00"
                      className="border-border bg-input-background"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="prestadorMunicipio" className="text-foreground">Município/UF</Label>
                      <Input
                        id="prestadorMunicipio"
                        {...register('prestadorMunicipio')}
                        placeholder="SÃO PAULO"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prestadorUf" className="text-foreground">UF</Label>
                      <Input
                        id="prestadorUf"
                        {...register('prestadorUf')}
                        placeholder="SP"
                        maxLength={2}
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prestadorEmail" className="text-foreground">Email</Label>
                    <Input
                      id="prestadorEmail"
                      type="email"
                      {...register('prestadorEmail')}
                      placeholder="contato@novigo.com.br"
                      className="border-border bg-input-background"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA TOMADOR */}
            <TabsContent value="tomador" className="space-y-4 mt-4">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Tomador de Serviço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tomadorRazaoSocial" className="text-foreground">Nome/Razão Social *</Label>
                    <Select
                      value={watch('tomadorRazaoSocial')}
                      onValueChange={(value) => {
                        const empresa = empresas.find(e => e.razaoSocial === value);
                        if (empresa) {
                          selectEmpresa(empresa);
                        } else {
                          setValue('tomadorRazaoSocial', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border">
                        <SelectValue placeholder="Selecione a empresa ou digite o nome" />
                      </SelectTrigger>
                      <SelectContent>
                        {empresas.length > 0 ? (
                          empresas.map((empresa) => (
                            <SelectItem key={empresa.id} value={empresa.razaoSocial}>
                              {empresa.razaoSocial}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            Nenhuma empresa cadastrada
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.tomadorRazaoSocial && (
                      <p className="text-sm text-destructive">{errors.tomadorRazaoSocial.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tomadorCpfCnpj" className="text-foreground">CPF/CNPJ</Label>
                      <Input
                        id="tomadorCpfCnpj"
                        {...register('tomadorCpfCnpj')}
                        placeholder="00.000.000/0001-00"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tomadorInscricaoEstadual" className="text-foreground">Inscrição Estadual</Label>
                      <Input
                        id="tomadorInscricaoEstadual"
                        {...register('tomadorInscricaoEstadual')}
                        placeholder="000.000.000.000"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tomadorInscricaoMunicipal" className="text-foreground">Inscrição Municipal</Label>
                      <Input
                        id="tomadorInscricaoMunicipal"
                        {...register('tomadorInscricaoMunicipal')}
                        placeholder="0.000.000-0"
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tomadorEndereco" className="text-foreground">Endereço</Label>
                    <Input
                      id="tomadorEndereco"
                      {...register('tomadorEndereco')}
                      placeholder="Rua, Número - Bairro - CEP 00000-000"
                      className="border-border bg-input-background"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="tomadorMunicipio" className="text-foreground">Município/UF</Label>
                      <Input
                        id="tomadorMunicipio"
                        {...register('tomadorMunicipio')}
                        placeholder="São Paulo"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tomadorUf" className="text-foreground">UF</Label>
                      <Input
                        id="tomadorUf"
                        {...register('tomadorUf')}
                        placeholder="SP"
                        maxLength={2}
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tomadorEmail" className="text-foreground">Email</Label>
                    <Input
                      id="tomadorEmail"
                      type="email"
                      {...register('tomadorEmail')}
                      placeholder="contato@empresa.com.br"
                      className="border-border bg-input-background"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dados Bancários */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Dados para Depósito
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="banco" className="text-foreground">Banco</Label>
                      <Input
                        id="banco"
                        {...register('banco')}
                        placeholder="Banco BTG Pactual 208"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agencia" className="text-foreground">Agência</Label>
                      <Input
                        id="agencia"
                        {...register('agencia')}
                        placeholder="0050"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contaCorrente" className="text-foreground">Conta Corrente (C/C)</Label>
                      <Input
                        id="contaCorrente"
                        {...register('contaCorrente')}
                        placeholder="383628-6"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pix" className="text-foreground">PIX</Label>
                      <Input
                        id="pix"
                        {...register('pix')}
                        placeholder="41.512.775/0001-23"
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA VALORES */}
            <TabsContent value="valores" className="space-y-4 mt-4">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Valor Total dos Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor" className="text-foreground">Valor Total *</Label>
                      <Input
                        id="valor"
                        inputMode="decimal"
                        {...register('valor', { 
                          required: 'Valor é obrigatório'
                        })}
                        placeholder="Digite o valor"
                        className="border-border bg-input-background"
                      />
                      {errors.valor && (
                        <p className="text-sm text-destructive">{errors.valor.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="codigoServico" className="text-foreground">Código do Serviço</Label>
                      <Select
                        value={watch('codigoServico')}
                        onValueChange={(value) => setValue('codigoServico', value)}
                      >
                        <SelectTrigger className="border-border">
                          <SelectValue placeholder="Selecione o código do serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {CODIGOS_SERVICO.map((servico) => (
                            <SelectItem key={servico.codigo} value={servico.codigo}>
                              {servico.codigo} - {servico.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Impostos - Linha 1 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorInss" className="text-foreground">INSS (R$)</Label>
                      <Input
                        id="valorInss"
                        inputMode="decimal"
                        {...register('valorInss')}
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valorIrrf" className="text-foreground">IRRF (R$)</Label>
                      <Input
                        id="valorIrrf"
                        inputMode="decimal"
                        {...register('valorIrrf')}
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valorCsll" className="text-foreground">CSLL (R$)</Label>
                      <Input
                        id="valorCsll"
                        inputMode="decimal"
                        {...register('valorCsll')}
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>

                  {/* Impostos - Linha 2 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorCofins" className="text-foreground">COFINS (R$)</Label>
                      <Input
                        id="valorCofins"
                        inputMode="decimal"
                        {...register('valorCofins')}
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valorPis" className="text-foreground">PIS (R$)</Label>
                      <Input
                        id="valorPis"
                        inputMode="decimal"
                        {...register('valorPis')}
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valorDeducoes" className="text-foreground">Deduções (R$)</Label>
                      <Input
                        id="valorDeducoes"
                        inputMode="decimal"
                        {...register('valorDeducoes')}
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>

                  {/* Cálculos - Linha 3 */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="baseCalculo" className="text-foreground">Base de Cálculo (R$)</Label>
                      <Input
                        id="baseCalculo"
                        inputMode="decimal"
                        {...register('baseCalculo')}
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aliquota" className="text-foreground">Alíquota (%)</Label>
                      <Input
                        id="aliquota"
                        inputMode="decimal"
                        {...register('aliquota')}
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valorIss" className="text-foreground">Valor ISS (R$)</Label>
                      <Input
                        id="valorIss"
                        inputMode="decimal"
                        {...register('valorIss')}
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valorCredito" className="text-foreground">Crédito (R$)</Label>
                      <Input
                        id="valorCredito"
                        inputMode="decimal"
                        {...register('valorCredito')}
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>

                  {/* Resumo de Valores */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-muted-foreground mb-3">Resumo de Valores</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Valor Bruto</p>
                        <p className="text-foreground">R$ {parseValor(valor).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Impostos</p>
                        <p className="text-orange-600 dark:text-orange-400">R$ {totalImpostos.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Valor Líquido</p>
                        <p className="text-green-600 dark:text-green-400">R$ {valorLiquido.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA OUTRAS INFORMAÇÕES */}
            <TabsContent value="outras" className="space-y-4 mt-4">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Outras Informações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="municipioPrestacao" className="text-foreground block">Município da Prestação de Serviço</Label>
                      <Input
                        id="municipioPrestacao"
                        {...register('municipioPrestacao')}
                        placeholder="São Paulo"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numeroInscricaoObra" className="text-foreground block">Número de Inscrição da Obra</Label>
                      <Input
                        id="numeroInscricaoObra"
                        {...register('numeroInscricaoObra')}
                        placeholder="111"
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorAproximadoTributos" className="text-foreground block">Valor Aproximado dos Tributos/Fonte</Label>
                      <Input
                        id="valorAproximadoTributos"
                        inputMode="decimal"
                        {...register('valorAproximadoTributos')}
                        placeholder="R$ 4200.17"
                        className="border-border bg-input-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground block">Percentual de Tributos (%)</Label>
                      <Input
                        value={percentualTributos.toFixed(2)}
                        disabled
                        placeholder="0.00"
                        className="border-border bg-muted text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes" className="text-foreground block">Observações</Label>
                    <Textarea
                      id="observacoes"
                      {...register('observacoes')}
                      placeholder="(1) Esta NFS-e foi emitida com respaldo na Lei nº 14.097/2005; (2) Esta NFS-e não gera crédito; (3) Data de vencimento do ISS desta NFS-e: 10/09-2025"
                      rows={4}
                      className="border-border bg-input-background"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
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
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
            >
              {nota ? 'Salvar Alterações' : 'Emitir Nota Fiscal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}