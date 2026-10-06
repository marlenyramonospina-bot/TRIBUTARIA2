export interface AccountEntry {
  code: string;
  name: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalTransaction {
  id: string;
  date: string;
  docNumber: string;
  concept: string;
  thirdParty: string;
  nit: string;
  entries: AccountEntry[];
}

export interface AccountBalance {
  code: string;
  name: string;
  initialBalance: number;
  debitTotal: number;
  creditTotal: number;
  finalBalance: number;
  nature: 'DEBITO' | 'CREDITO';
}

export interface TaxParameters {
  uvtValue: number; // e.g. 47065 (2024) or 49799 (2025)
  taxYear: number;
  corporateRate: number; // 0.35 (35%)
  autoRetentionRate: number; // e.g. 0.0055 (0.55%) o 0.0110
  financialSurcharge: number; // 0.05 if financial institution
  minWage: number; // Salario mínimo legal
}

export interface Form110State {
  // Encabezado
  nit: string;
  razonSocial: string;
  ano: number;
  periodo: number;
  // Patrimonio (Renglones 33-41)
  efectivoYEquivalentes: number; // R33
  inversiones: number; // R34
  cuentasPorCobrar: number; // R35
  inventarios: number; // R36
  activosFijos: number; // R37
  otrosActivos: number; // R38
  totalPatrimonioBruto: number; // R39
  pasivos: number; // R40
  totalPatrimonioLiquido: number; // R41
  // Ingresos (Renglones 42-57)
  ingresosBrutosOperacionales: number; // R42
  ingresosBrutosNoOperacionales: number; // R43
  interesesYFinancieros: number; // R44
  ingresosNoConstitutivos: number; // R47
  devolucionesEnVentas: number; // R48
  totalIngresosNetos: number; // R49
  // Costos y Gastos (Renglones 58-71)
  costoDeVentas: number; // R58
  gastosOperacionalesAdministracion: number; // R60
  gastosOperacionalesVentas: number; // R61
  gastosFinancieros: number; // R62
  otrosGastosYDeducciones: number; // R63
  totalCostosYDeducciones: number; // R65
  // Renta Líquida y Ganancia Ocasional
  rentaLiquidaOrdinaria: number; // R66
  compensacionPerdidas: number; // R68
  rentaLiquidaGravable: number; // R70
  rentaPresuntiva: number; // R71 (0% actual)
  // Liquidación Privada (Renglones 75-108)
  impuestoSobreRentaLiquida: number; // R76
  descuentosTributarios: number; // R79
  impuestoNetoDeRenta: number; // R81
  sobretasa: number; // R82
  totalImpuestoACargo: number; // R85
  retencionesEnLaFuentePracticadas: number; // R86
  autorretencionesPracticadas: number; // R87
  anticipoRentaAnoAnterior: number; // R88
  anticipoRentaAnoSiguiente: number; // R89
  saldoAPagar: number; // R91
  saldoAFavor: number; // R92
}

export interface Form210State {
  nit: string;
  nombres: string;
  ano: number;
  // Patrimonio
  patrimonioBruto: number;
  deudas: number;
  patrimonioLiquido: number;
  // Cédula General
  ingresosLaborales: number;
  ingresosNoConstitutivosLaboral: number;
  rentasExentasLaborales: number;
  deduccionesLaborales: number;
  rentaLiquidaLaboral: number;
  ingresosCapital: number;
  costosGastosCapital: number;
  rentaLiquidaCapital: number;
  ingresosNoLaborales: number;
  costosNoLaborales: number;
  rentaLiquidaNoLaboral: number;
  rentaLiquidaOrdinariaGeneral: number;
  limiteExencionesGeneral: number;
  rentaLiquidaGravableGeneral: number;
  // Cédula Pensiones
  ingresosPensiones: number;
  rentasExentasPensiones: number;
  rentaLiquidaPensiones: number;
  // Cédula Dividendos
  ingresosDividendos: number;
  // Liquidación
  impuestoGeneralUVT: number;
  impuestoGeneralPesos: number;
  impuestoDividendos: number;
  totalImpuesto: number;
  retencionesPracticadas: number;
  anticipoAnoAnterior: number;
  anticipoAnoSiguiente: number;
  saldoAPagar: number;
  saldoAFavor: number;
}

export interface Form300State {
  nit: string;
  razonSocial: string;
  ano: number;
  bimestre: number;
  // Ingresos brutos por operaciones gravadas
  ingresosGravados19: number; // R27
  ingresosGravados5: number; // R28
  ingresosExentos: number; // R32
  ingresosExcluidos: number; // R33
  ingresosNoGravados: number; // R34
  totalIngresosBrutos: number; // R36
  devolucionesEnVentas: number; // R37
  totalIngresosNetos: number; // R38
  // Compras e importaciones
  comprasGravadas19: number; // R44
  comprasGravadas5: number; // R45
  comprasServicios19: number; // R48
  comprasExcluidasExentas: number; // R49
  totalComprasBrutas: number; // R54
  // Impuesto Generado
  ivaGenerado19: number; // R57
  ivaGenerado5: number; // R58
  totalIvaGenerado: number; // R65
  // Impuesto Descontable
  ivaDescontableCompras19: number; // R66
  ivaDescontableCompras5: number; // R67
  ivaDescontableServicios19: number; // R70
  totalIvaDescontable: number; // R76
  // Control y Saldos
  saldoIvaPeriodo: number; // R77 (Generado - Descontable)
  retencionIvaPracticadaQueLeHicieron: number; // R78
  saldoAFavorPeriodoAnterior: number; // R79
  saldoAPagar: number; // R82
  saldoAFavor: number; // R83
}

export interface Form350State {
  nit: string;
  razonSocial: string;
  ano: number;
  mes: number;
  // Retenciones a título de Renta
  baseLaboral: number;
  retencionLaboral: number;
  baseHonorarios: number;
  retencionHonorarios: number;
  baseServicios: number;
  retencionServicios: number;
  baseArrendamientos: number;
  retencionArrendamientos: number;
  baseCompras: number;
  retencionCompras: number;
  baseAutorretencionEspecial: number;
  retencionAutorretencionEspecial: number;
  otrasRetencionesRenta: number;
  totalRetencionesRenta: number;
  // Retenciones a título de IVA (ReteIVA)
  baseReteIva: number;
  retencionReteIva: number;
  // Total a pagar
  totalRetenciones: number;
  sanciones: number;
  totalPagar: number;
}

export interface Form310State {
  nit: string;
  razonSocial: string;
  ano: number;
  bimestre: number;
  // Base gravable
  baseServiciosComidasYBebidas8: number; // Restaurantes y bares
  impuestoComidasYBebidas8: number;
  baseTelefoniaMovil4: number;
  impuestoTelefoniaMovil4: number;
  baseVehiculos: number;
  impuestoVehiculos: number;
  totalImpuestoINC: number;
  retencionesINCPracticadas: number;
  totalPagarINC: number;
}

export interface Form420State {
  nit: string;
  nombreDeclarante: string;
  ano: number;
  totalPatrimonioBruto: number;
  totalDeudas: number;
  patrimonioLiquido: number;
  uvtVigente: number;
  patrimonioLiquidoEnUVT: number;
  limiteNoSujetoUVT: number; // 72.000 UVT
  baseGravableUVT: number;
  impuestoPatrimonioPesos: number;
  descuentosTributarios: number;
  totalPagarPatrimonio: number;
}

export interface WorkshopQuestion {
  id: string;
  taxForm: '110' | '210' | '300' | '350' | '310' | '420';
  title: string;
  scenario: string;
  dataClues: { label: string; value: string }[];
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}
