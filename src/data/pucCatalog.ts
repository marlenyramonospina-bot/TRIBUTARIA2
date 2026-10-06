export interface PucAccountInfo {
  code: string;
  name: string;
  category: 'ACTIVO' | 'PASIVO' | 'PATRIMONIO' | 'INGRESOS' | 'GASTOS' | 'COSTOS';
  nature: 'DEBITO' | 'CREDITO';
  taxFormMapping: {
    form110Row?: { rowNumber: number; rowName: string };
    form300Row?: { rowNumber: number; rowName: string };
    form350Row?: { rowNumber: number; rowName: string };
    form310Row?: { rowNumber: number; rowName: string };
    form420Row?: { rowNumber: number; rowName: string };
  };
  notes: string;
}

export const PUC_CATALOG: PucAccountInfo[] = [
  // ACTIVOS (1)
  {
    code: '1105',
    name: 'Caja General y Menor',
    category: 'ACTIVO',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 33, rowName: 'Efectivo y equivalentes de efectivo' },
      form420Row: { rowNumber: 33, rowName: 'Patrimonio Bruto - Efectivo' }
    },
    notes: 'Base del patrimonio bruto. Sujeto a bancarización (Art. 771-5 E.T.).'
  },
  {
    code: '1110',
    name: 'Bancos e Instituciones Financieras',
    category: 'ACTIVO',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 33, rowName: 'Efectivo y equivalentes de efectivo' },
      form420Row: { rowNumber: 33, rowName: 'Patrimonio Bruto - Bancos' }
    },
    notes: 'Conciliación bancaria al 31 de diciembre. Aplica GMF 4x1000 deducible en un 50% (Art. 115 E.T.).'
  },
  {
    code: '1305',
    name: 'Clientes Nacionales (Cuentas por Cobrar)',
    category: 'ACTIVO',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 35, rowName: 'Cuentas, documentos y préstamos por cobrar' },
      form420Row: { rowNumber: 35, rowName: 'Patrimonio Bruto - Cuentas por cobrar' }
    },
    notes: 'Valor nominal menos deterioro fiscal de cartera según método individual o general (Art. 145 E.T.).'
  },
  {
    code: '135515',
    name: 'Anticipo de Impuestos - Retención en la Fuente a Favor',
    category: 'ACTIVO',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 86, rowName: 'Autorretenciones / Retenciones practicadas año gravable' }
    },
    notes: 'Descontable en el renglón 86 del F110 previa certificación de los agentes retenedores.'
  },
  {
    code: '135517',
    name: 'Anticipo de Impuestos - Retención de IVA a Favor (ReteIVA)',
    category: 'ACTIVO',
    nature: 'DEBITO',
    taxFormMapping: {
      form300Row: { rowNumber: 78, rowName: 'Retención de IVA practicada que le hicieron (ReteIVA)' }
    },
    notes: 'Descontable en la declaración de IVA (Formulario 300 renglón 78).'
  },
  {
    code: '1435',
    name: 'Mercancías no Fabricadas por la Empresa (Inventarios)',
    category: 'ACTIVO',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 36, rowName: 'Inventarios' },
      form420Row: { rowNumber: 36, rowName: 'Patrimonio Bruto - Inventarios' }
    },
    notes: 'Valuación fiscal según Art. 66 y 271 E.T. (Costo histórico, método promedio o PEPS).'
  },
  {
    code: '1524',
    name: 'Equipo de Oficina y Cómputo (Propiedad, Planta y Equipo)',
    category: 'ACTIVO',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 37, rowName: 'Propiedades, planta y equipo e inversión' },
      form420Row: { rowNumber: 37, rowName: 'Patrimonio Bruto - Bienes muebles e inmuebles' }
    },
    notes: 'Depreciación fiscal limitada a tasas máximas anuales del Art. 137 E.T.'
  },

  // PASIVOS (2)
  {
    code: '2205',
    name: 'Proveedores Nacionales',
    category: 'PASIVO',
    nature: 'CREDITO',
    taxFormMapping: {
      form110Row: { rowNumber: 40, rowName: 'Total Pasivos (Deudas fiscales)' },
      form420Row: { rowNumber: 40, rowName: 'Total Deudas' }
    },
    notes: 'Deudas reales y soportadas válidamente ante la DIAN (Art. 283 y 770 E.T.).'
  },
  {
    code: '2365',
    name: 'Retención en la Fuente por Pagar (Renta)',
    category: 'PASIVO',
    nature: 'CREDITO',
    taxFormMapping: {
      form350Row: { rowNumber: 50, rowName: 'Total Retenciones practicadas en el mes' }
    },
    notes: 'Se declara y paga mensualmente en el Formulario 350. Su no pago acarrea ineficacia (Art. 580-1 E.T.).'
  },
  {
    code: '2367',
    name: 'Retención de IVA por Pagar (ReteIVA practicado)',
    category: 'PASIVO',
    nature: 'CREDITO',
    taxFormMapping: {
      form350Row: { rowNumber: 77, rowName: 'Retenciones a título de IVA (ReteIVA)' }
    },
    notes: 'Retención practicada al régimen ordinario o por grandes contribuyentes. Se declara en el F350.'
  },
  {
    code: '236575',
    name: 'Autorretención Especial a Título de Renta (DUR 1625)',
    category: 'PASIVO',
    nature: 'CREDITO',
    taxFormMapping: {
      form350Row: { rowNumber: 74, rowName: 'Autorretenciones Especiales Renta' },
      form110Row: { rowNumber: 87, rowName: 'Autorretenciones practicadas' }
    },
    notes: 'Aplicable a sociedades exoneradas de aportes parafiscales Sena e Icbf (Art. 114-1 E.T.).'
  },
  {
    code: '2408',
    name: 'Impuesto sobre las Ventas por Pagar (IVA)',
    category: 'PASIVO',
    nature: 'CREDITO',
    taxFormMapping: {
      form300Row: { rowNumber: 82, rowName: 'Saldo a Pagar por el período fiscal' }
    },
    notes: 'Subcuentas: 240801 (IVA Generado - Crédito) y 240802 (IVA Descontable - Débito).'
  },
  {
    code: '2440',
    name: 'Impuesto Nacional al Consumo por Pagar (INC)',
    category: 'PASIVO',
    nature: 'CREDITO',
    taxFormMapping: {
      form310Row: { rowNumber: 50, rowName: 'Total a pagar Impuesto Nacional al Consumo' }
    },
    notes: 'Bimestral en el Formulario 310. Tarifa del 8% en restaurantes y bares.'
  },

  // INGRESOS (4)
  {
    code: '4135',
    name: 'Comercio al por mayor y al por menor (Ventas gravadas)',
    category: 'INGRESOS',
    nature: 'CREDITO',
    taxFormMapping: {
      form110Row: { rowNumber: 42, rowName: 'Ingresos brutos operacionales' },
      form300Row: { rowNumber: 27, rowName: 'Ingresos brutos gravados a tarifa general (19%)' }
    },
    notes: 'Debe estar 100% amparado en Facturación Electrónica de Venta con validación previa DIAN.'
  },
  {
    code: '4140',
    name: 'Servicios de Expendio a la Mesa / Restaurante (INC 8%)',
    category: 'INGRESOS',
    nature: 'CREDITO',
    taxFormMapping: {
      form110Row: { rowNumber: 42, rowName: 'Ingresos brutos operacionales' },
      form310Row: { rowNumber: 30, rowName: 'Servicios de comidas y bebidas (8%)' }
    },
    notes: 'Gravado con Impuesto al Consumo (8%), no con IVA salvo franquicias.'
  },
  {
    code: '4210',
    name: 'Ingresos Financieros (Intereses y rendimientos)',
    category: 'INGRESOS',
    nature: 'CREDITO',
    taxFormMapping: {
      form110Row: { rowNumber: 44, rowName: 'Intereses y rendimientos financieros' }
    },
    notes: 'Ingreso no operacional gravado en Renta.'
  },
  {
    code: '4175',
    name: 'Devoluciones en Ventas',
    category: 'INGRESOS',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 48, rowName: 'Devoluciones, rebajas y descuentos en ventas' },
      form300Row: { rowNumber: 37, rowName: 'Devoluciones en ventas anuladas o rescindidas' }
    },
    notes: 'Soportadas con Nota Crédito Electrónica DIAN referenciando la factura origen.'
  },

  // GASTOS (5)
  {
    code: '5105',
    name: 'Gastos de Personal (Sueldos y Prestaciones Administrativas)',
    category: 'GASTOS',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 60, rowName: 'Gastos operacionales de administración' },
      form350Row: { rowNumber: 30, rowName: 'Retenciones por rentas de trabajo (Art. 383)' }
    },
    notes: 'Exige nómina electrónica transmitida y pago oportuno de PILA para deducibilidad (Art. 108 E.T.).'
  },
  {
    code: '5110',
    name: 'Honorarios Profesionales (Asesoría Contable / Legal)',
    category: 'GASTOS',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 60, rowName: 'Gastos operacionales de administración' },
      form350Row: { rowNumber: 33, rowName: 'Retenciones por honorarios (10% / 11%)' }
    },
    notes: 'Aplica retención en la fuente del 10% o 11% si el profesional no declara renta.'
  },
  {
    code: '5120',
    name: 'Arrendamientos Operacionales',
    category: 'GASTOS',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 60, rowName: 'Gastos operacionales de administración' },
      form350Row: { rowNumber: 42, rowName: 'Retenciones por arrendamientos (Bienes muebles o inmuebles)' }
    },
    notes: 'Bienes raíces comerciales: tarifa retención 3.5% y gravado con IVA 19%.'
  },
  {
    code: '5135',
    name: 'Servicios Generales, Aseo y Vigilancia',
    category: 'GASTOS',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 60, rowName: 'Gastos operacionales de administración' },
      form350Row: { rowNumber: 36, rowName: 'Retenciones por servicios generales (4%)' }
    },
    notes: 'AIU en servicios de aseo y vigilancia (IVA sobre AIU y retención especial).'
  },
  {
    code: '5205',
    name: 'Gastos de Personal de Ventas',
    category: 'GASTOS',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 61, rowName: 'Gastos operacionales de ventas' }
    },
    notes: 'Comisiones y salarios de fuerza comercial soportados en documento nómina electrónica.'
  },

  // COSTOS (6)
  {
    code: '6135',
    name: 'Costo de Ventas y Prestación de Servicios',
    category: 'COSTOS',
    nature: 'DEBITO',
    taxFormMapping: {
      form110Row: { rowNumber: 58, rowName: 'Costo de ventas' }
    },
    notes: 'Juego de inventarios o sistema permanente. Cumplimiento de soporte electrónico (Art. 616-1 E.T.).'
  }
];
