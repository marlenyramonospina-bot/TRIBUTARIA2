import {
  AccountBalance,
  Form110State,
  Form210State,
  Form300State,
  Form310State,
  Form350State,
  Form420State,
  JournalTransaction,
  TaxParameters
} from '../types/tax';

export interface TrialBalanceResult {
  balances: AccountBalance[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  difference: number;
}

/**
 * Computes the trial balance from transactions and initial balances
 */
export function calculateTrialBalance(
  transactions: JournalTransaction[],
  initialBalances: Record<string, number> = {}
): TrialBalanceResult {
  const accountMap: Record<
    string,
    { name: string; initial: number; debit: number; credit: number; nature: 'DEBITO' | 'CREDITO' }
  > = {};

  // Initialize from initial balances
  for (const [code, amount] of Object.entries(initialBalances)) {
    const isAssetOrExpense = code.startsWith('1') || code.startsWith('5') || code.startsWith('6');
    const nature: 'DEBITO' | 'CREDITO' = isAssetOrExpense ? 'DEBITO' : 'CREDITO';
    accountMap[code] = {
      name: getAccountNameByCode(code),
      initial: amount,
      debit: 0,
      credit: 0,
      nature
    };
  }

  // Accumulate transactions
  for (const tx of transactions) {
    for (const entry of tx.entries) {
      if (!accountMap[entry.code]) {
        const isAssetOrExpense =
          entry.code.startsWith('1') || entry.code.startsWith('5') || entry.code.startsWith('6');
        accountMap[entry.code] = {
          name: entry.name || getAccountNameByCode(entry.code),
          initial: 0,
          debit: 0,
          credit: 0,
          nature: isAssetOrExpense ? 'DEBITO' : 'CREDITO'
        };
      }
      accountMap[entry.code].debit += Number(entry.debit) || 0;
      accountMap[entry.code].credit += Number(entry.credit) || 0;
    }
  }

  let totalDebits = 0;
  let totalCredits = 0;

  const balances: AccountBalance[] = Object.keys(accountMap)
    .sort()
    .map((code) => {
      const acc = accountMap[code];
      let finalBalance = 0;

      if (acc.nature === 'DEBITO') {
        finalBalance = acc.initial + acc.debit - acc.credit;
      } else {
        finalBalance = acc.initial + acc.credit - acc.debit;
      }

      totalDebits += acc.debit;
      totalCredits += acc.credit;

      return {
        code,
        name: acc.name,
        initialBalance: acc.initial,
        debitTotal: acc.debit,
        creditTotal: acc.credit,
        finalBalance,
        nature: acc.nature
      };
    });

  const diff = Math.abs(totalDebits - totalCredits);

  return {
    balances,
    totalDebits,
    totalCredits,
    isBalanced: diff < 1, // Tolerance for floating-point
    difference: diff
  };
}

function getAccountNameByCode(code: string): string {
  const dictionary: Record<string, string> = {
    '1105': 'Caja General',
    '1110': 'Bancos Nacionales',
    '1305': 'Clientes Nacionales',
    '135515': 'Anticipo Retención en la Fuente',
    '135517': 'Anticipo Retención de IVA',
    '1435': 'Inventarios de Mercancías',
    '1524': 'Equipo de Oficina y Cómputo',
    '2205': 'Proveedores Nacionales',
    '2365': 'Retención en la Fuente por Pagar',
    '2367': 'Retención de IVA por Pagar',
    '236575': 'Autorretención Especial Renta',
    '2408': 'Impuesto a las Ventas por Pagar (IVA)',
    '2440': 'Impuesto Nacional al Consumo por Pagar',
    '3105': 'Capital Suscrito y Pagado',
    '4135': 'Comercio al por Mayor y Menor',
    '4140': 'Servicios de Expendio de Comidas (INC)',
    '4175': 'Devoluciones en Ventas',
    '4210': 'Ingresos Financieros',
    '5105': 'Gastos de Personal',
    '5110': 'Honorarios Profesionales',
    '5120': 'Arrendamientos Operacionales',
    '5135': 'Servicios Generales y Mantenimiento',
    '5205': 'Gastos de Personal de Ventas',
    '6135': 'Costo de Ventas'
  };
  return dictionary[code] || `Cuenta ${code}`;
}

/**
 * Computes Formulario 110 (Renta Personas Jurídicas)
 */
export function generateForm110(
  trialBalance: TrialBalanceResult,
  companyName: string,
  nit: string,
  params: TaxParameters
): Form110State {
  const getBal = (prefix: string) => {
    return trialBalance.balances
      .filter((b) => b.code.startsWith(prefix))
      .reduce((sum, b) => sum + Math.max(0, b.finalBalance), 0);
  };

  const getTxCredits = (prefix: string) => {
    return trialBalance.balances
      .filter((b) => b.code.startsWith(prefix))
      .reduce((sum, b) => sum + b.creditTotal, 0);
  };

  const getTxDebits = (prefix: string) => {
    return trialBalance.balances
      .filter((b) => b.code.startsWith(prefix))
      .reduce((sum, b) => sum + b.debitTotal, 0);
  };

  // Patrimonio
  const efectivoYEquivalentes = getBal('11');
  const cuentasPorCobrar = getBal('1305');
  const inventarios = getBal('14');
  const activosFijos = getBal('15');
  const inversiones = getBal('12');
  const otrosActivos = 0;
  const totalPatrimonioBruto =
    efectivoYEquivalentes + cuentasPorCobrar + inventarios + activosFijos + inversiones + otrosActivos;
  const pasivos = getBal('2');
  const totalPatrimonioLiquido = Math.max(0, totalPatrimonioBruto - pasivos);

  // Ingresos
  const ingresosBrutosOperacionales = getTxCredits('4135') + getTxCredits('4140');
  const interesesYFinancieros = getTxCredits('4210');
  const ingresosBrutosNoOperacionales = interesesYFinancieros;
  const devoluciones = getTxDebits('4175');
  const ingresosNoConstitutivos = 0;
  const totalIngresosNetos =
    ingresosBrutosOperacionales + ingresosBrutosNoOperacionales - devoluciones - ingresosNoConstitutivos;

  // Costos y deducciones
  const costoDeVentas = getTxDebits('61');
  const gastosAdmin =
    getTxDebits('5105') +
    getTxDebits('5110') +
    getTxDebits('5120') +
    getTxDebits('5135');
  const gastosVentas = getTxDebits('52');
  const gastosFinancieros = getTxDebits('53');
  const otrosGastos = 0;
  const totalCostosYDeducciones =
    costoDeVentas + gastosAdmin + gastosVentas + gastosFinancieros + otrosGastos;

  // Renta Líquida
  const rentaLiquidaOrdinaria = Math.max(0, totalIngresosNetos - totalCostosYDeducciones);
  const rentaLiquidaGravable = rentaLiquidaOrdinaria;
  const rentaPresuntiva = 0; // 0% tarifa legal

  // Impuesto
  const impuestoSobreRentaLiquida = Math.round(rentaLiquidaGravable * params.corporateRate);
  const descuentosTributarios = 0;
  const impuestoNetoDeRenta = Math.max(0, impuestoSobreRentaLiquida - descuentosTributarios);
  const sobretasa = 0;
  const totalImpuestoACargo = impuestoNetoDeRenta + sobretasa;

  // Retenciones y autorretenciones
  const retencionesEnLaFuentePracticadas = getTxDebits('135515');
  const autorretencionesPracticadas = getTxCredits('236575');
  const anticipoRentaAnoAnterior = 0;
  // Anticipo siguiente año (proyección pedagógica del 75% deduciendo retenciones)
  const anticipoRentaAnoSiguiente = Math.max(
    0,
    Math.round(impuestoNetoDeRenta * 0.75 - retencionesEnLaFuentePracticadas)
  );

  const saldoNeto =
    totalImpuestoACargo +
    anticipoRentaAnoSiguiente -
    retencionesEnLaFuentePracticadas -
    autorretencionesPracticadas -
    anticipoRentaAnoAnterior;

  const saldoAPagar = saldoNeto > 0 ? saldoNeto : 0;
  const saldoAFavor = saldoNeto < 0 ? Math.abs(saldoNeto) : 0;

  return {
    nit,
    razonSocial: companyName,
    ano: params.taxYear,
    periodo: 1,
    efectivoYEquivalentes,
    inversiones,
    cuentasPorCobrar,
    inventarios,
    activosFijos,
    otrosActivos,
    totalPatrimonioBruto,
    pasivos,
    totalPatrimonioLiquido,
    ingresosBrutosOperacionales,
    ingresosBrutosNoOperacionales,
    interesesYFinancieros,
    ingresosNoConstitutivos,
    devolucionesEnVentas: devoluciones,
    totalIngresosNetos,
    costoDeVentas,
    gastosOperacionalesAdministracion: gastosAdmin,
    gastosOperacionalesVentas: gastosVentas,
    gastosFinancieros,
    otrosGastosYDeducciones: otrosGastos,
    totalCostosYDeducciones,
    rentaLiquidaOrdinaria,
    compensacionPerdidas: 0,
    rentaLiquidaGravable,
    rentaPresuntiva,
    impuestoSobreRentaLiquida,
    descuentosTributarios,
    impuestoNetoDeRenta,
    sobretasa,
    totalImpuestoACargo,
    retencionesEnLaFuentePracticadas,
    autorretencionesPracticadas,
    anticipoRentaAnoAnterior,
    anticipoRentaAnoSiguiente,
    saldoAPagar,
    saldoAFavor
  };
}

/**
 * Computes Formulario 210 (Renta Personas Naturales Residentes - Sistema Cedular)
 */
export function generateForm210(
  trialBalance: TrialBalanceResult,
  nombres: string,
  nit: string,
  params: TaxParameters
): Form210State {
  // Patrimonio
  const patrimonioBruto = trialBalance.balances
    .filter((b) => b.code.startsWith('1'))
    .reduce((sum, b) => sum + Math.max(0, b.finalBalance), 0);
  const deudas = trialBalance.balances
    .filter((b) => b.code.startsWith('2'))
    .reduce((sum, b) => sum + Math.max(0, b.finalBalance), 0);
  const patrimonioLiquido = Math.max(0, patrimonioBruto - deudas);

  // Rentas de Trabajo y Honorarios
  const ingresosLaborales = 0;
  const honorariosYServicios = trialBalance.balances
    .filter((b) => b.code.startsWith('4135'))
    .reduce((sum, b) => sum + b.creditTotal, 0);

  // Rentas de Capital
  const ingresosCapital = trialBalance.balances
    .filter((b) => b.code.startsWith('4210'))
    .reduce((sum, b) => sum + b.creditTotal, 0);

  // Aportes a seguridad social (INCRNGO)
  const aportesSeguridadSocial = trialBalance.balances
    .filter((b) => b.code.startsWith('5105'))
    .reduce((sum, b) => sum + b.debitTotal, 0);

  const ingresosNoConstitutivosLaboral = aportesSeguridadSocial;

  // Límite de rentas exentas y deducciones (40% con tope de 1.340 UVT)
  const limiteUVT1340 = 1340 * params.uvtValue;
  const baseSubtotal = honorariosYServicios + ingresosLaborales - ingresosNoConstitutivosLaboral;
  const exencion25Estimada = Math.min(baseSubtotal * 0.25, 790 * params.uvtValue);
  const deduccionesLaborales = Math.min(exencion25Estimada, Math.min(baseSubtotal * 0.4, limiteUVT1340));

  const rentaLiquidaLaboral = Math.max(0, baseSubtotal - deduccionesLaborales);
  const rentaLiquidaCapital = Math.max(0, ingresosCapital);
  const rentaLiquidaNoLaboral = 0;

  const rentaLiquidaOrdinariaGeneral = rentaLiquidaLaboral + rentaLiquidaCapital;
  const rentaLiquidaGravableGeneral = rentaLiquidaOrdinariaGeneral;

  // Tarifa Art. 241 E.T. en UVT
  const baseUVT = rentaLiquidaGravableGeneral / params.uvtValue;
  let impuestoUVT = 0;

  if (baseUVT <= 1090) {
    impuestoUVT = 0;
  } else if (baseUVT <= 1700) {
    impuestoUVT = (baseUVT - 1090) * 0.19;
  } else if (baseUVT <= 4100) {
    impuestoUVT = (baseUVT - 1700) * 0.28 + 116;
  } else if (baseUVT <= 8670) {
    impuestoUVT = (baseUVT - 4100) * 0.33 + 788;
  } else if (baseUVT <= 18970) {
    impuestoUVT = (baseUVT - 8670) * 0.35 + 2296;
  } else if (baseUVT <= 31000) {
    impuestoUVT = (baseUVT - 18970) * 0.37 + 5901;
  } else {
    impuestoUVT = (baseUVT - 31000) * 0.39 + 10352;
  }

  const impuestoGeneralPesos = Math.round(impuestoUVT * params.uvtValue);
  const retencionesPracticadas = trialBalance.balances
    .filter((b) => b.code.startsWith('135515'))
    .reduce((sum, b) => sum + b.debitTotal, 0);

  const anticipoAnoSiguiente = Math.max(
    0,
    Math.round(impuestoGeneralPesos * 0.75 - retencionesPracticadas)
  );

  const saldoNeto = impuestoGeneralPesos + anticipoAnoSiguiente - retencionesPracticadas;
  const saldoAPagar = saldoNeto > 0 ? saldoNeto : 0;
  const saldoAFavor = saldoNeto < 0 ? Math.abs(saldoNeto) : 0;

  return {
    nit,
    nombres,
    ano: params.taxYear,
    patrimonioBruto,
    deudas,
    patrimonioLiquido,
    ingresosLaborales: honorariosYServicios,
    ingresosNoConstitutivosLaboral,
    rentasExentasLaborales: deduccionesLaborales,
    deduccionesLaborales,
    rentaLiquidaLaboral,
    ingresosCapital,
    costosGastosCapital: 0,
    rentaLiquidaCapital,
    ingresosNoLaborales: 0,
    costosNoLaborales: 0,
    rentaLiquidaNoLaboral,
    rentaLiquidaOrdinariaGeneral,
    limiteExencionesGeneral: limiteUVT1340,
    rentaLiquidaGravableGeneral,
    ingresosPensiones: 0,
    rentasExentasPensiones: 0,
    rentaLiquidaPensiones: 0,
    ingresosDividendos: 0,
    impuestoGeneralUVT: Math.round(impuestoUVT * 100) / 100,
    impuestoGeneralPesos,
    impuestoDividendos: 0,
    totalImpuesto: impuestoGeneralPesos,
    retencionesPracticadas,
    anticipoAnoAnterior: 0,
    anticipoAnoSiguiente,
    saldoAPagar,
    saldoAFavor
  };
}

/**
 * Computes Formulario 300 (IVA Bimestral)
 */
export function generateForm300(
  trialBalance: TrialBalanceResult,
  companyName: string,
  nit: string,
  params: TaxParameters
): Form300State {
  const getTxCredits = (code: string) => {
    const acc = trialBalance.balances.find((b) => b.code === code);
    return acc ? acc.creditTotal : 0;
  };

  const getTxDebits = (code: string) => {
    const acc = trialBalance.balances.find((b) => b.code === code);
    return acc ? acc.debitTotal : 0;
  };

  const ingresosGravados19 = getTxCredits('4135');
  const ingresosGravados5 = 0;
  const ingresosExentos = 0;
  const ingresosExcluidos = 0;
  const ingresosNoGravados = getTxCredits('4210');
  const totalIngresosBrutos =
    ingresosGravados19 + ingresosGravados5 + ingresosExentos + ingresosExcluidos + ingresosNoGravados;
  const devolucionesEnVentas = getTxDebits('4175');
  const totalIngresosNetos = totalIngresosBrutos - devolucionesEnVentas;

  // Compras
  const comprasGravadas19 = getTxDebits('1435');
  const comprasGravadas5 = 0;
  const comprasServicios19 = getTxDebits('5120'); // ej. arrendamiento comercial gravado
  const comprasExcluidasExentas = 0;
  const totalComprasBrutas = comprasGravadas19 + comprasGravadas5 + comprasServicios19 + comprasExcluidasExentas;

  // IVA Generado (desde transacciones de 2408 crédito)
  const ivaGenerado19 = Math.round(ingresosGravados19 * 0.19);
  const ivaGenerado5 = 0;
  const totalIvaGenerado = ivaGenerado19 + ivaGenerado5;

  // IVA Descontable
  const ivaDescontableCompras19 = Math.round(comprasGravadas19 * 0.19);
  const ivaDescontableCompras5 = 0;
  const ivaDescontableServicios19 = Math.round(comprasServicios19 * 0.19);
  const totalIvaDescontable = ivaDescontableCompras19 + ivaDescontableCompras5 + ivaDescontableServicios19;

  const saldoIvaPeriodo = totalIvaGenerado - totalIvaDescontable;
  const retencionIvaPracticadaQueLeHicieron = getTxDebits('135517');
  const saldoAFavorPeriodoAnterior = 0;

  const totalLiquidado = saldoIvaPeriodo - retencionIvaPracticadaQueLeHicieron - saldoAFavorPeriodoAnterior;
  const saldoAPagar = totalLiquidado > 0 ? totalLiquidado : 0;
  const saldoAFavor = totalLiquidado < 0 ? Math.abs(totalLiquidado) : 0;

  return {
    nit,
    razonSocial: companyName,
    ano: params.taxYear,
    bimestre: 1, // Enero-Febrero
    ingresosGravados19,
    ingresosGravados5,
    ingresosExentos,
    ingresosExcluidos,
    ingresosNoGravados,
    totalIngresosBrutos,
    devolucionesEnVentas,
    totalIngresosNetos,
    comprasGravadas19,
    comprasGravadas5,
    comprasServicios19,
    comprasExcluidasExentas,
    totalComprasBrutas,
    ivaGenerado19,
    ivaGenerado5,
    totalIvaGenerado,
    ivaDescontableCompras19,
    ivaDescontableCompras5,
    ivaDescontableServicios19,
    totalIvaDescontable,
    saldoIvaPeriodo,
    retencionIvaPracticadaQueLeHicieron,
    saldoAFavorPeriodoAnterior,
    saldoAPagar,
    saldoAFavor
  };
}

/**
 * Computes Formulario 350 (Retención en la Fuente Mensual)
 */
export function generateForm350(
  trialBalance: TrialBalanceResult,
  companyName: string,
  nit: string,
  params: TaxParameters
): Form350State {
  const getTxDebits = (code: string) => {
    const acc = trialBalance.balances.find((b) => b.code === code);
    return acc ? acc.debitTotal : 0;
  };

  const getTxCredits = (code: string) => {
    const acc = trialBalance.balances.find((b) => b.code === code);
    return acc ? acc.creditTotal : 0;
  };

  // Bases
  const baseLaboral = getTxDebits('5105');
  const retencionLaboral = 650000; // Nómina Art 383

  const baseHonorarios = getTxDebits('5110');
  const retencionHonorarios = Math.round(baseHonorarios * 0.11);

  const baseServicios = getTxDebits('5135');
  const retencionServicios = Math.round(baseServicios * 0.04);

  const baseArrendamientos = getTxDebits('5120');
  const retencionArrendamientos = Math.round(baseArrendamientos * 0.035);

  const baseCompras = getTxDebits('1435');
  const retencionCompras = Math.round(baseCompras * 0.025);

  const baseAutorretencionEspecial = getTxCredits('4135') + getTxCredits('4140');
  const retencionAutorretencionEspecial = Math.round(baseAutorretencionEspecial * params.autoRetentionRate);

  const otrasRetencionesRenta = 0;

  const totalRetencionesRenta =
    retencionLaboral +
    retencionHonorarios +
    retencionServicios +
    retencionArrendamientos +
    retencionCompras +
    retencionAutorretencionEspecial +
    otrasRetencionesRenta;

  const baseReteIva = 0;
  const retencionReteIva = getTxCredits('2367');

  const totalRetenciones = totalRetencionesRenta + retencionReteIva;
  const sanciones = 0;
  const totalPagar = totalRetenciones + sanciones;

  return {
    nit,
    razonSocial: companyName,
    ano: params.taxYear,
    mes: 2, // Febrero
    baseLaboral,
    retencionLaboral,
    baseHonorarios,
    retencionHonorarios,
    baseServicios,
    retencionServicios,
    baseArrendamientos,
    retencionArrendamientos,
    baseCompras,
    retencionCompras,
    baseAutorretencionEspecial,
    retencionAutorretencionEspecial,
    otrasRetencionesRenta,
    totalRetencionesRenta,
    baseReteIva,
    retencionReteIva,
    totalRetenciones,
    sanciones,
    totalPagar
  };
}

/**
 * Computes Formulario 310 (Impuesto Nacional al Consumo - INC)
 */
export function generateForm310(
  trialBalance: TrialBalanceResult,
  companyName: string,
  nit: string,
  params: TaxParameters
): Form310State {
  const getTxCredits = (code: string) => {
    const acc = trialBalance.balances.find((b) => b.code === code);
    return acc ? acc.creditTotal : 0;
  };

  const baseServiciosComidasYBebidas8 = getTxCredits('4140');
  const impuestoComidasYBebidas8 = Math.round(baseServiciosComidasYBebidas8 * 0.08);

  const baseTelefoniaMovil4 = 0;
  const impuestoTelefoniaMovil4 = 0;
  const baseVehiculos = 0;
  const impuestoVehiculos = 0;

  const totalImpuestoINC = impuestoComidasYBebidas8 + impuestoTelefoniaMovil4 + impuestoVehiculos;
  const retencionesINCPracticadas = 0;
  const totalPagarINC = totalImpuestoINC - retencionesINCPracticadas;

  return {
    nit,
    razonSocial: companyName,
    ano: params.taxYear,
    bimestre: 2,
    baseServiciosComidasYBebidas8,
    impuestoComidasYBebidas8,
    baseTelefoniaMovil4,
    impuestoTelefoniaMovil4,
    baseVehiculos,
    impuestoVehiculos,
    totalImpuestoINC,
    retencionesINCPracticadas,
    totalPagarINC
  };
}

/**
 * Computes Formulario 420 (Impuesto al Patrimonio)
 * Aplicable a Personas Naturales con patrimonio líquido > 72.000 UVT al 1 de enero
 */
export function generateForm420(
  trialBalance: TrialBalanceResult,
  nombreDeclarante: string,
  nit: string,
  params: TaxParameters
): Form420State {
  const totalPatrimonioBruto = trialBalance.balances
    .filter((b) => b.code.startsWith('1'))
    .reduce((sum, b) => sum + Math.max(0, b.finalBalance), 0);

  const totalDeudas = trialBalance.balances
    .filter((b) => b.code.startsWith('2'))
    .reduce((sum, b) => sum + Math.max(0, b.finalBalance), 0);

  const patrimonioLiquido = Math.max(0, totalPatrimonioBruto - totalDeudas);
  const uvtVigente = params.uvtValue;
  const patrimonioLiquidoEnUVT = Math.round((patrimonioLiquido / uvtVigente) * 100) / 100;
  const limiteNoSujetoUVT = 72000;

  let baseGravableUVT = 0;
  let impuestoPatrimonioPesos = 0;

  if (patrimonioLiquidoEnUVT > limiteNoSujetoUVT) {
    baseGravableUVT = patrimonioLiquidoEnUVT - limiteNoSujetoUVT;

    // Tabla marginal Art. 296-3 E.T.
    let impuestoUVT = 0;
    if (patrimonioLiquidoEnUVT <= 122000) {
      impuestoUVT = (patrimonioLiquidoEnUVT - 72000) * 0.005;
    } else if (patrimonioLiquidoEnUVT <= 239000) {
      impuestoUVT = (patrimonioLiquidoEnUVT - 122000) * 0.01 + 250;
    } else {
      impuestoUVT = (patrimonioLiquidoEnUVT - 239000) * 0.015 + 1420;
    }

    impuestoPatrimonioPesos = Math.round(impuestoUVT * uvtVigente);
  }

  return {
    nit,
    nombreDeclarante,
    ano: params.taxYear,
    totalPatrimonioBruto,
    totalDeudas,
    patrimonioLiquido,
    uvtVigente,
    patrimonioLiquidoEnUVT,
    limiteNoSujetoUVT,
    baseGravableUVT,
    impuestoPatrimonioPesos,
    descuentosTributarios: 0,
    totalPagarPatrimonio: impuestoPatrimonioPesos
  };
}

/**
 * Format currency in Colombian Pesos (COP)
 */
export function formatCOP(val: number): string {
  if (isNaN(val)) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(val);
}

/**
 * Format plain number with thousand separators
 */
export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0
  }).format(val);
}
