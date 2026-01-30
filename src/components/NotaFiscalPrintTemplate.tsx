import { NotaFiscal } from './NotasFiscais';

export function generatePrintHTML(nota: NotaFiscal): string {
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

  return `
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
          padding: 20px;
          background: white;
          color: #000;
          font-size: 10px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          border: 2px solid #000;
          padding: 0;
        }
        
        .header {
          border-bottom: 2px solid #000;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f5f5f5;
        }
        
        .header-left {
          flex: 1;
        }
        
        .header-left h1 {
          font-size: 11px;
          margin-bottom: 3px;
          font-weight: bold;
        }
        
        .header-left h2 {
          font-size: 10px;
          font-weight: normal;
        }
        
        .logo {
          font-size: 16px;
          font-weight: bold;
          color: #2563eb;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .header-right {
          text-align: right;
          font-size: 9px;
        }
        
        .header-right div {
          margin-bottom: 2px;
        }
        
        .title-section {
          background: #f5f5f5;
          border-bottom: 2px solid #000;
          padding: 8px;
          text-align: center;
          font-weight: bold;
          font-size: 11px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        td, th {
          border: 1px solid #000;
          padding: 6px;
          font-size: 9px;
          vertical-align: top;
        }
        
        th {
          background: #f5f5f5;
          font-weight: bold;
          text-align: left;
        }
        
        .label {
          font-weight: bold;
          font-size: 8px;
        }
        
        .value {
          font-size: 9px;
        }
        
        .discriminacao {
          min-height: 120px;
          padding: 8px;
          border: 1px solid #000;
          margin: 0;
        }
        
        .valores-table td {
          text-align: center;
        }
        
        .section-header {
          background: #e0e0e0;
          font-weight: bold;
          text-align: center;
          padding: 8px;
          border-bottom: 2px solid #000;
          font-size: 10px;
        }
        
        .observacoes {
          padding: 8px;
          border-top: 1px solid #000;
          font-size: 8px;
          min-height: 50px;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .container {
            border: 2px solid #000;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Cabeçalho -->
        <div class="header">
          <div class="header-left">
            <h1>PREFEITURA DO MUNICÍPIO DE SÃO PAULO</h1>
            <h2>SECRETARIA MUNICIPAL DA FAZENDA</h2>
          </div>
          <div class="logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            NOVIGO IT
          </div>
          <div class="header-right">
            <div><strong>Número da Nota</strong></div>
            <div>${nota.numero}</div>
            <div><strong>Data e Hora da Emissão</strong></div>
            <div>${formatDateForPrint(nota.dataEmissao)}</div>
            <div><strong>Código de Verificação</strong></div>
            <div>${nota.codigoVerificacao || '-'}</div>
          </div>
        </div>

        <div class="title-section">
          NOTA FISCAL ELETRÔNICA DE SERVIÇOS - NFS-e
        </div>

        <!-- Prestador de Serviço -->
        <div class="section-header">PRESTADOR DE SERVIÇO</div>
        <table>
          <tr>
            <td colspan="3">
              <div class="label">Nome/Razão Social</div>
              <div class="value">${nota.prestadorRazaoSocial || 'NOVIGO TECNOLOGIA DA INFORMAÇÃO S.A'}</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="label">CPF/CNPJ</div>
              <div class="value">${nota.prestadorCpfCnpj || '00.000.000/0001-00'}</div>
            </td>
            <td>
              <div class="label">Inscrição Estadual</div>
              <div class="value">${nota.prestadorInscricaoEstadual || 'ISENTO'}</div>
            </td>
            <td>
              <div class="label">Inscrição Municipal</div>
              <div class="value">${nota.prestadorInscricaoMunicipal || '0.000.000-0'}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="label">Endereço</div>
              <div class="value">${nota.prestadorEndereco || 'AV. BRIG. FARIA LIMA, 1234 - 11º ANDAR - JARDIM PAULISTANO - CEP 01451-001'}</div>
            </td>
            <td>
              <div class="label">Email</div>
              <div class="value">${nota.prestadorEmail || 'contato@novigo.com.br'}</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="label">Município/UF</div>
              <div class="value">${nota.prestadorMunicipio || 'SÃO PAULO'} - ${nota.prestadorUf || 'SP'}</div>
            </td>
            <td colspan="2">
              <div class="label">Telefone</div>
              <div class="value">(11) 0000-0000</div>
            </td>
          </tr>
        </table>

        <!-- Tomador de Serviço -->
        <div class="section-header">TOMADOR DE SERVIÇO</div>
        <table>
          <tr>
            <td colspan="3">
              <div class="label">Nome/Razão Social</div>
              <div class="value">${nota.tomadorRazaoSocial || nota.cliente}</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="label">CPF/CNPJ</div>
              <div class="value">${nota.tomadorCpfCnpj || '-'}</div>
            </td>
            <td>
              <div class="label">Inscrição Estadual</div>
              <div class="value">${nota.tomadorInscricaoEstadual || '-'}</div>
            </td>
            <td>
              <div class="label">Inscrição Municipal</div>
              <div class="value">${nota.tomadorInscricaoMunicipal || '-'}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="label">Endereço</div>
              <div class="value">${nota.tomadorEndereco || '-'}</div>
            </td>
            <td>
              <div class="label">Email</div>
              <div class="value">${nota.tomadorEmail || '-'}</div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="label">Contato</div>
              <div class="value">${nota.tomadorEmail || '-'}</div>
            </td>
          </tr>
        </table>

        <!-- Discriminação dos Serviços -->
        <div class="section-header">DISCRIMINAÇÃO DOS SERVIÇOS</div>
        <div class="discriminacao">
          ${nota.descricao}
          ${nota.dataVencimento ? `<br><br>Vencimento: ${formatDateForPrint(nota.dataVencimento)}` : ''}
          ${nota.dataEnvio ? `<br>Data de Envio: ${formatDateForPrint(nota.dataEnvio)}` : ''}
          ${nota.banco ? `<br><br>Dados para depósito:<br>Banco: ${nota.banco}${nota.agencia ? ` | Agência: ${nota.agencia}` : ''}${nota.contaCorrente ? ` | C/C: ${nota.contaCorrente}` : ''}${nota.pix ? `<br>PIX: ${nota.pix}` : ''}` : ''}
        </div>

        <!-- Valores -->
        <div class="section-header">VALOR TOTAL DOS SERVIÇOS: ${formatCurrencyForPrint(nota.valor)}</div>
        <table class="valores-table">
          <tr>
            <td>
              <div class="label">INSS (R$)</div>
              <div class="value">${formatCurrencyForPrint(nota.valorInss)}</div>
            </td>
            <td>
              <div class="label">IRRF (R$)</div>
              <div class="value">${formatCurrencyForPrint(nota.valorIrrf)}</div>
            </td>
            <td>
              <div class="label">CSLL (R$)</div>
              <div class="value">${formatCurrencyForPrint(nota.valorCsll)}</div>
            </td>
            <td>
              <div class="label">COFINS (R$)</div>
              <div class="value">${formatCurrencyForPrint(nota.valorCofins)}</div>
            </td>
            <td>
              <div class="label">PIS (R$)</div>
              <div class="value">${formatCurrencyForPrint(nota.valorPis)}</div>
            </td>
          </tr>
        </table>

        <table class="valores-table">
          <tr>
            <td>
              <div class="label">Código de Serviço</div>
              <div class="value">${nota.codigoServico || '-'}</div>
            </td>
            <td colspan="3"></td>
          </tr>
          <tr>
            <td>
              <div class="label">Valor Total das Deduções (R$)</div>
              <div class="value">${formatCurrencyForPrint(nota.valorDeducoes)}</div>
            </td>
            <td>
              <div class="label">Base de Cálculo (R$)</div>
              <div class="value">${formatCurrencyForPrint(nota.baseCalculo)}</div>
            </td>
            <td>
              <div class="label">Alíquota (%)</div>
              <div class="value">${nota.aliquota || 0}</div>
            </td>
            <td>
              <div class="label">Valor ISS (R$)</div>
              <div class="value">${formatCurrencyForPrint(nota.valorIss)}</div>
            </td>
            <td>
              <div class="label">Crédito (R$)</div>
              <div class="value">${formatCurrencyForPrint(nota.valorCredito)}</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="label">Município da Prestação do Serviço</div>
              <div class="value">${nota.municipioPrestacao || '-'}</div>
            </td>
            <td>
              <div class="label">Número de Inscrição da Obra</div>
              <div class="value">${nota.numeroInscricaoObra || '-'}</div>
            </td>
            <td colspan="2">
              <div class="label">Valor aproximado dos Tributos / Fonte</div>
              <div class="value">${nota.valorAproximadoTributos ? formatCurrencyForPrint(nota.valorAproximadoTributos) + ' (' + ((nota.valorAproximadoTributos / nota.valor) * 100).toFixed(2) + '%)' : '-'}</div>
            </td>
            <td></td>
          </tr>
        </table>

        <!-- Outras Informações -->
        <div class="section-header">OUTRAS INFORMAÇÕES</div>
        <div class="observacoes">
          ${nota.observacoes || '(1) Esta NFS-e foi emitida com respaldo na Lei Complementar n° 116/2003; (2) Esta NFS-e não gera crédito'}
        </div>
      </div>
    </body>
    </html>
  `;
}
