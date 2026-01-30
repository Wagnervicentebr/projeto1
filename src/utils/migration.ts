import { Vendedor, Empresa, Colaborador, NotaFiscal, configuracoesPadrao } from '../types';

// Migração automática dos dados antigos para a nova estrutura
export function migrateData() {
  // 1. Migrar Vendedores (já estão corretos, apenas renomear alguns campos)
  const oldColaboradores = JSON.parse(localStorage.getItem('colaboradores') || '[]');
  const vendedores: Vendedor[] = oldColaboradores
    .filter((c: any) => c.tipo === 'vendedor' && ['v1', 'v2', 'v3', 'v4', 'v5'].includes(c.id))
    .map((c: any) => ({
      id: c.id,
      nome: c.nome,
      email: c.email,
      telefone: c.telefone,
      dataCadastro: c.dataAdmissao,
      status: c.status,
    }));

  // Se não houver vendedores, criar os padrão
  if (vendedores.length === 0) {
    vendedores.push(
      {
        id: 'v1',
        nome: 'Luís Santos',
        email: 'luis@novigoIT.com',
        telefone: '(11) 98765-1001',
        dataCadastro: '2022-01-10',
        status: 'ativo',
      },
      {
        id: 'v2',
        nome: 'Fábio Oliveira',
        email: 'fabio@novigoIT.com',
        telefone: '(11) 98765-1002',
        dataCadastro: '2022-03-15',
        status: 'ativo',
      },
      {
        id: 'v3',
        nome: 'Mariana Costa',
        email: 'mariana@novigoIT.com',
        telefone: '(11) 98765-1003',
        dataCadastro: '2022-05-20',
        status: 'ativo',
      },
      {
        id: 'v4',
        nome: 'Ricardo Mendes',
        email: 'ricardo@novigoIT.com',
        telefone: '(11) 98765-1004',
        dataCadastro: '2023-02-10',
        status: 'ativo',
      },
      {
        id: 'v5',
        nome: 'Juliana Silva',
        email: 'juliana@novigoIT.com',
        telefone: '(11) 98765-1005',
        dataCadastro: '2023-06-05',
        status: 'ativo',
      }
    );
  }

  // 2. Migrar Empresas (eram colaboradores tipo 'empresa')
  const empresas: Empresa[] = oldColaboradores
    .filter((c: any) => c.tipo === 'empresa')
    .map((c: any, index: number) => ({
      id: c.id,
      nomeCompleto: c.nome,
      cnae: `${6201 + index}-5/00`, // CNAEs fictícios
      gestorNome: `Gestor ${c.nome.split(' ')[0]}`,
      gestorEmail: c.email,
      gestorTelefone: c.telefone,
      vendedorId: vendedores[index % vendedores.length]?.id || 'v1',
      vendedorNome: vendedores[index % vendedores.length]?.nome || 'Luís Santos',
      categoria: index === 0 ? 'Tecnologia' : index === 1 ? 'Consultoria' : 'Serviços',
      status: 'ativa',
      dataCadastro: c.dataAdmissao,
    }));

  // Se não houver empresas, criar empresas padrão
  if (empresas.length === 0) {
    empresas.push(
      {
        id: 'e1',
        nomeCompleto: 'Tech Solutions Ltda',
        cnae: '6201-5/00',
        gestorNome: 'Carlos Silva',
        gestorEmail: 'carlos@techsolutions.com',
        gestorTelefone: '(11) 3456-7890',
        vendedorId: 'v1',
        vendedorNome: 'Luís Santos',
        categoria: 'Tecnologia',
        status: 'ativa',
        dataCadastro: '2023-06-01',
      },
      {
        id: 'e2',
        nomeCompleto: 'Consultoria ABC',
        cnae: '7020-4/00',
        gestorNome: 'Ana Paula',
        gestorEmail: 'ana@consultoria.com',
        gestorTelefone: '(11) 3456-7891',
        vendedorId: 'v1',
        vendedorNome: 'Luís Santos',
        categoria: 'Consultoria',
        status: 'ativa',
        dataCadastro: '2023-07-15',
      },
      {
        id: 'e3',
        nomeCompleto: 'Inovação Digital Ltda',
        cnae: '6311-9/00',
        gestorNome: 'Roberto Alves',
        gestorEmail: 'roberto@inovacaodigital.com',
        gestorTelefone: '(11) 3456-7892',
        vendedorId: 'v1',
        vendedorNome: 'Luís Santos',
        categoria: 'Tecnologia',
        status: 'ativa',
        dataCadastro: '2023-08-20',
      },
      {
        id: 'e4',
        nomeCompleto: 'Banco Empresarial S/A',
        cnae: '6422-1/00',
        gestorNome: 'Patricia Mendes',
        gestorEmail: 'patricia@bancoemp.com.br',
        gestorTelefone: '(11) 3456-7893',
        vendedorId: 'v2',
        vendedorNome: 'Fábio Oliveira',
        categoria: 'Banco',
        status: 'ativa',
        dataCadastro: '2023-09-10',
      },
      {
        id: 'e5',
        nomeCompleto: 'Indústria XYZ Ltda',
        cnae: '2599-3/99',
        gestorNome: 'Fernando Costa',
        gestorEmail: 'fernando@industriaxyz.com',
        gestorTelefone: '(11) 3456-7894',
        vendedorId: 'v3',
        vendedorNome: 'Mariana Costa',
        categoria: 'Indústria',
        status: 'ativa',
        dataCadastro: '2023-10-05',
      }
    );
  }

  // 3. Migrar Colaboradores (eram colaboradores tipo 'vendedor' mas não os 5 vendedores principais)
  const colaboradores: Colaborador[] = oldColaboradores
    .filter((c: any) => c.tipo === 'vendedor' && !['v1', 'v2', 'v3', 'v4', 'v5'].includes(c.id))
    .map((c: any, index: number) => ({
      id: c.id,
      nome: c.nome,
      email: c.email,
      telefone: c.telefone,
      categoria: (index % 4 === 0 ? 'CLT' : index % 4 === 1 ? 'PJ' : index % 4 === 2 ? 'RPA' : 'Flex') as any,
      tipoTrabalho: (index % 3 === 0 ? 'Presencial' : index % 3 === 1 ? 'Home Office' : 'Híbrido') as any,
      configuracaoHibrido: index % 3 === 2 ? '3x2' as any : undefined,
      empresaId: empresas[index % empresas.length]?.id || 'e1',
      empresaNome: empresas[index % empresas.length]?.nomeCompleto || 'Tech Solutions Ltda',
      vendedorId: vendedores[index % vendedores.length]?.id || 'v1',
      vendedorNome: vendedores[index % vendedores.length]?.nome || 'Luís Santos',
      cargo: c.cargo,
      departamento: c.departamento,
      dataAdmissao: c.dataAdmissao,
      dataDemissao: undefined,
      status: c.status,
    }));

  // Se não houver colaboradores, criar alguns padrão
  if (colaboradores.length === 0) {
    colaboradores.push(
      {
        id: 'c1',
        nome: 'Maria Silva',
        email: 'maria@example.com',
        telefone: '(11) 98765-4321',
        categoria: 'CLT',
        tipoTrabalho: 'Presencial',
        empresaId: 'e1',
        empresaNome: 'Tech Solutions Ltda',
        vendedorId: 'v1',
        vendedorNome: 'Luís Santos',
        cargo: 'Analista de Sistemas',
        departamento: 'TI',
        dataAdmissao: '2023-01-15',
        status: 'ativo',
      },
      {
        id: 'c2',
        nome: 'João Santos',
        email: 'joao@example.com',
        telefone: '(11) 98765-4322',
        categoria: 'PJ',
        tipoTrabalho: 'Home Office',
        empresaId: 'e2',
        empresaNome: 'Consultoria ABC',
        vendedorId: 'v2',
        vendedorNome: 'Fábio Oliveira',
        cargo: 'Desenvolvedor Full Stack',
        departamento: 'TI',
        dataAdmissao: '2023-02-20',
        status: 'ativo',
      },
      {
        id: 'c3',
        nome: 'Ana Oliveira',
        email: 'ana@example.com',
        telefone: '(11) 98765-4323',
        categoria: 'CLT',
        tipoTrabalho: 'Híbrido',
        configuracaoHibrido: '3x2',
        empresaId: 'e3',
        empresaNome: 'Inovação Digital Ltda',
        vendedorId: 'v3',
        vendedorNome: 'Mariana Costa',
        cargo: 'Analista Financeira',
        departamento: 'Financeiro',
        dataAdmissao: '2023-03-10',
        status: 'ativo',
      },
      {
        id: 'c4',
        nome: 'Carlos Mendes',
        email: 'carlos@example.com',
        telefone: '(11) 98765-4324',
        categoria: 'RPA',
        tipoTrabalho: 'Presencial',
        empresaId: 'e4',
        empresaNome: 'Banco Empresarial S/A',
        vendedorId: 'v4',
        vendedorNome: 'Ricardo Mendes',
        cargo: 'Consultor Financeiro',
        departamento: 'Consultoria',
        dataAdmissao: '2023-04-05',
        status: 'ativo',
      },
      {
        id: 'c5',
        nome: 'Patricia Costa',
        email: 'patricia@example.com',
        telefone: '(11) 98765-4325',
        categoria: 'Flex',
        tipoTrabalho: 'Home Office',
        empresaId: 'e5',
        empresaNome: 'Indústria XYZ Ltda',
        vendedorId: 'v5',
        vendedorNome: 'Juliana Silva',
        cargo: 'Designer UX/UI',
        departamento: 'Design',
        dataAdmissao: '2023-05-12',
        status: 'ativo',
      }
    );
  }

  // 4. Migrar Notas Fiscais
  const oldNotas = JSON.parse(localStorage.getItem('notasFiscais') || '[]');
  const notas: NotaFiscal[] = oldNotas.map((n: any, index: number) => {
    const valorBruto = n.valor || 0;
    const iss = valorBruto * 0.05; // 5%
    const pis = valorBruto * 0.0165; // 1.65%
    const cofins = valorBruto * 0.076; // 7.6%
    const irrf = valorBruto * 0.015; // 1.5%
    const totalImpostos = iss + pis + cofins + irrf;
    const valorLiquido = valorBruto - totalImpostos;

    return {
      id: n.id,
      numero: n.numero,
      empresaId: empresas[index % empresas.length]?.id || 'e1',
      empresaNome: empresas[index % empresas.length]?.nomeCompleto || 'Tech Solutions Ltda',
      vendedorId: n.colaboradorId || vendedores[index % vendedores.length]?.id || 'v1',
      vendedorNome: n.colaboradorNome || vendedores[index % vendedores.length]?.nome || 'Luís Santos',
      descricao: n.descricao || 'Serviços prestados',
      valorBruto,
      impostos: {
        iss: parseFloat(iss.toFixed(2)),
        pis: parseFloat(pis.toFixed(2)),
        cofins: parseFloat(cofins.toFixed(2)),
        irrf: parseFloat(irrf.toFixed(2)),
      },
      valorLiquido: parseFloat(valorLiquido.toFixed(2)),
      regimeTributario: 'Lucro Presumido',
      dataEmissao: n.dataEmissao,
      dataVencimento: n.dataVencimento,
      dataEnvio: n.dataEnvio,
      status: n.status,
    };
  });

  // 5. Salvar tudo no localStorage
  localStorage.setItem('vendedores', JSON.stringify(vendedores));
  localStorage.setItem('empresas', JSON.stringify(empresas));
  localStorage.setItem('colaboradores_new', JSON.stringify(colaboradores));
  localStorage.setItem('notasFiscais_new', JSON.stringify(notas));
  localStorage.setItem('configuracoes', JSON.stringify(configuracoesPadrao));

  // 6. Criar empresas tomadoras de serviço (clientes)
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

  // Marcar migração como concluída
  localStorage.setItem('migration_completed', 'true');

  return {
    vendedores,
    empresas,
    colaboradores,
    notas,
    configuracoes: configuracoesPadrao,
  };
}

export function checkMigration() {
  return localStorage.getItem('migration_completed') === 'true';
}