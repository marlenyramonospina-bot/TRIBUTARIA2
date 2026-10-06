import { JournalTransaction, TaxParameters, WorkshopQuestion } from '../types/tax';

export interface CompanyPreset {
  id: string;
  name: string;
  nit: string;
  type: 'PERSONA_JURIDICA' | 'PERSONA_NATURAL';
  economicActivity: string;
  ciiuCode: string;
  regime: string;
  description: string;
  transactions: JournalTransaction[];
  initialBalances: Record<string, number>; // code -> balance
  params: TaxParameters;
}

export const TAX_PARAMETERS_2024: TaxParameters = {
  uvtValue: 47065, // UVT 2024
  taxYear: 2024,
  corporateRate: 0.35, // 35%
  autoRetentionRate: 0.0055, // 0.55%
  financialSurcharge: 0,
  minWage: 1300000
};

export const TAX_PARAMETERS_2025: TaxParameters = {
  uvtValue: 49799, // UVT 2025
  taxYear: 2025,
  corporateRate: 0.35,
  autoRetentionRate: 0.0055,
  financialSurcharge: 0,
  minWage: 1423500
};

export const COMPANY_PRESETS: CompanyPreset[] = [
  {
    id: 'andina_sas',
    name: 'Manufacturas & Distribuciones Andina S.A.S.',
    nit: '901.482.391-4',
    type: 'PERSONA_JURIDICA',
    economicActivity: 'Comercio al por mayor de productos manufacturados',
    ciiuCode: '4649',
    regime: 'Responsable de IVA (Régimen Ordinario)',
    description: 'Empresa modelo para liquidar Renta PJ (Formulario 110), IVA Bimestral (Formulario 300) y Retefuente Mensual (Formulario 350). Sujeta a autorretención especial del 0.55%.',
    params: TAX_PARAMETERS_2024,
    initialBalances: {
      '1105': 12500000,
      '1110': 185000000,
      '1305': 92000000,
      '1435': 140000000,
      '1524': 85000000,
      '2205': 78000000,
      '3105': 436500000
    },
    transactions: [
      {
        id: 'TX-001',
        date: '2024-02-10',
        docNumber: 'FEV-1001',
        concept: 'Venta de mercancías gravadas al 19% a crédito',
        thirdParty: 'Almacenes El Éxito del Valle S.A.',
        nit: '890.100.220-1',
        entries: [
          { code: '1305', name: 'Clientes Nacionales', debit: 116620000, credit: 0, description: 'Cuenta por cobrar cliente' },
          { code: '135515', name: 'Anticipo Retefuente 2.5%', debit: 2500000, credit: 0, description: 'Retefuente practicada por cliente' },
          { code: '4135', name: 'Comercio al por mayor y menor', debit: 0, credit: 100000000, description: 'Ingreso gravado 19%' },
          { code: '2408', name: 'IVA Generado 19%', debit: 0, credit: 19000000, description: 'Impuesto generado en ventas' },
          { code: '236575', name: 'Autorretención Especial Renta (0.55%)', debit: 0, credit: 550000, description: 'Autorretención por pagar' },
          { code: '135515', name: 'Anticipo Autorretención (0.55%)', debit: 550000, credit: 0, description: 'Autorretención a favor en renta' },
          { code: '6135', name: 'Costo de Ventas', debit: 58000000, credit: 0, description: 'Costo de inventario vendido' },
          { code: '1435', name: 'Inventarios de Mercancías', debit: 0, credit: 58000000, description: 'Salida de bodega' }
        ]
      },
      {
        id: 'TX-002',
        date: '2024-02-14',
        docNumber: 'FEV-1002',
        concept: 'Venta de mercancías al contado con IVA 19%',
        thirdParty: 'Distribuidora del Café SAS',
        nit: '900.554.120-8',
        entries: [
          { code: '1110', name: 'Bancos Nacionales', debit: 70800000, credit: 0, description: 'Transferencia bancaria recibida' },
          { code: '135515', name: 'Anticipo Retefuente 2.5%', debit: 1500000, credit: 0, description: 'Retención practicada' },
          { code: '4135', name: 'Comercio al por mayor y menor', debit: 0, credit: 60000000, description: 'Ingreso gravado' },
          { code: '2408', name: 'IVA Generado 19%', debit: 0, credit: 11400000, description: 'IVA generado en ventas' },
          { code: '236575', name: 'Autorretención Especial Renta (0.55%)', debit: 0, credit: 330000, description: 'Autorretención por pagar' },
          { code: '135515', name: 'Anticipo Autorretención (0.55%)', debit: 330000, credit: 0, description: 'Autorretención a favor' },
          { code: '6135', name: 'Costo de Ventas', debit: 34000000, credit: 0, description: 'Costo mercancía' },
          { code: '1435', name: 'Inventarios de Mercancías', debit: 0, credit: 34000000, description: 'Salida de bodega' }
        ]
      },
      {
        id: 'TX-003',
        date: '2024-02-18',
        docNumber: 'FAC-PROV-5420',
        concept: 'Compra de inventario de mercancías a proveedor con IVA 19%',
        thirdParty: 'Industrias Químicas de Colombia S.A.',
        nit: '860.001.442-9',
        entries: [
          { code: '1435', name: 'Inventarios de Mercancías', debit: 70000000, credit: 0, description: 'Compra mercancía gravada' },
          { code: '2408', name: 'IVA Descontable 19%', debit: 13300000, credit: 0, description: 'IVA descontable en compras' },
          { code: '2365', name: 'Retefuente por Compras 2.5%', debit: 0, credit: 1750000, description: 'Retención practicada al proveedor' },
          { code: '2205', name: 'Proveedores Nacionales', debit: 0, credit: 81550000, description: 'Factura por pagar a 60 días' }
        ]
      },
      {
        id: 'TX-004',
        date: '2024-02-22',
        docNumber: 'NE-0045',
        concept: 'Pago de Nómina Electrónica y Seguridad Social - Administración',
        thirdParty: 'Nómina Empleados S.A.S.',
        nit: '999.001.001-0',
        entries: [
          { code: '5105', name: 'Gastos de Personal Administrativo', debit: 18000000, credit: 0, description: 'Sueldos y aportes parafiscales' },
          { code: '2365', name: 'Retención por Salarios (Art. 383)', debit: 0, credit: 650000, description: 'Retención salarios retenida' },
          { code: '1110', name: 'Bancos Nacionales', debit: 0, credit: 17350000, description: 'Pago dispersión bancaria' }
        ]
      },
      {
        id: 'TX-005',
        date: '2024-02-25',
        docNumber: 'DS-0881',
        concept: 'Pago de Honorarios Revisoría Fiscal y Auditoría',
        thirdParty: 'Dra. Martha Patricia Silva',
        nit: '52.981.334-8',
        entries: [
          { code: '5110', name: 'Gastos Honorarios Asesoría', debit: 5000000, credit: 0, description: 'Honorarios revisoría fiscal' },
          { code: '2365', name: 'Retefuente Honorarios (11% No Declarante)', debit: 0, credit: 550000, description: 'Retención practicada' },
          { code: '1110', name: 'Bancos Nacionales', debit: 0, credit: 4450000, description: 'Giro bancario' }
        ]
      },
      {
        id: 'TX-006',
        date: '2024-02-27',
        docNumber: 'FAC-ARR-102',
        concept: 'Arrendamiento de bodega comercial con IVA 19%',
        thirdParty: 'Inmobiliaria Santander SAS',
        nit: '900.221.455-6',
        entries: [
          { code: '5120', name: 'Gastos de Arrendamiento', debit: 6000000, credit: 0, description: 'Canon mensual bodega' },
          { code: '2408', name: 'IVA Descontable Servicios 19%', debit: 1140000, credit: 0, description: 'IVA descontable canon' },
          { code: '2365', name: 'Retefuente Arrendamiento (3.5%)', debit: 0, credit: 210000, description: 'Retención arrendamiento' },
          { code: '1110', name: 'Bancos Nacionales', debit: 0, credit: 6930000, description: 'Pago arriendo' }
        ]
      },
      {
        id: 'TX-007',
        date: '2024-02-28',
        docNumber: 'ND-BANC-0228',
        concept: 'Rendimientos financieros ganados en cuenta corriente',
        thirdParty: 'Bancolombia S.A.',
        nit: '890.903.938-8',
        entries: [
          { code: '1110', name: 'Bancos Nacionales', debit: 1450000, credit: 0, description: 'Ingreso bancario abonado' },
          { code: '135515', name: 'Anticipo Retefuente Financieros (7%)', debit: 101500, credit: 0, description: 'Retención por rendimientos' },
          { code: '4210', name: 'Ingresos Financieros', debit: 0, credit: 1551500, description: 'Intereses recibidos' }
        ]
      }
    ]
  },
  {
    id: 'restaurante_caribe',
    name: 'Restaurante & Banquetería Sabor Caribe S.A.S.',
    nit: '900.831.109-2',
    type: 'PERSONA_JURIDICA',
    economicActivity: 'Expendio a la mesa de comidas preparadas y bebidas',
    ciiuCode: '5611',
    regime: 'Responsable de Impuesto Nacional al Consumo (INC 8%)',
    description: 'Empresa pedagógica para liquidar Impuesto Nacional al Consumo (Formulario 310 - 8%), Retención en la fuente (Formulario 350) y Renta PJ (Formulario 110).',
    params: TAX_PARAMETERS_2024,
    initialBalances: {
      '1105': 8500000,
      '1110': 95000000,
      '1435': 32000000,
      '1524': 110000000,
      '2205': 42000000,
      '3105': 203500000
    },
    transactions: [
      {
        id: 'TX-R01',
        date: '2024-03-05',
        docNumber: 'POS-8901',
        concept: 'Ventas de comidas preparadas y bebidas del bimestre (INC 8%)',
        thirdParty: 'Clientes Consumo Masivo',
        nit: '222.222.222-2',
        entries: [
          { code: '1110', name: 'Bancos (Tarjetas y datáfono)', debit: 97200000, credit: 0, description: 'Ingresos recaudados' },
          { code: '4140', name: 'Servicio de Expendio de Comidas (Base INC)', debit: 0, credit: 90000000, description: 'Base del servicio gastronómico' },
          { code: '2440', name: 'Impuesto Nacional al Consumo por Pagar (8%)', debit: 0, credit: 7200000, description: 'INC 8% cobrado' },
          { code: '236575', name: 'Autorretención Especial Renta (0.55%)', debit: 0, credit: 495000, description: 'Autorretención especial' },
          { code: '135515', name: 'Anticipo Autorretención (0.55%)', debit: 495000, credit: 0, description: 'Anticipo renta' },
          { code: '6135', name: 'Costo de Alimentos y Bebidas', debit: 38000000, credit: 0, description: 'Consumo de insumos' },
          { code: '1435', name: 'Inventario de Materias Primas', debit: 0, credit: 38000000, description: 'Salida insumos cocina' }
        ]
      },
      {
        id: 'TX-R02',
        date: '2024-03-12',
        docNumber: 'FAC-CARNES-402',
        concept: 'Compra de carnes y verduras a distribuidor (Bien Excluido de IVA)',
        thirdParty: 'Carnes & Alimentos del Sinú S.A.S.',
        nit: '900.771.201-9',
        entries: [
          { code: '1435', name: 'Inventarios de Alimentos', debit: 22000000, credit: 0, description: 'Compra de carnes frescas' },
          { code: '2365', name: 'Retefuente por Compras (2.5%)', debit: 0, credit: 550000, description: 'Retención practicada' },
          { code: '1110', name: 'Bancos Nacionales', debit: 0, credit: 21450000, description: 'Transferencia bancaria' }
        ]
      },
      {
        id: 'TX-R03',
        date: '2024-03-20',
        docNumber: 'FAC-SER-661',
        concept: 'Servicio de mantenimiento y calibración de hornos y estufas',
        thirdParty: 'Técnicos Industriales S.A.S.',
        nit: '800.192.304-1',
        entries: [
          { code: '5135', name: 'Servicios de Mantenimiento', debit: 3500000, credit: 0, description: 'Mantenimiento preventivo' },
          { code: '2365', name: 'Retefuente Servicios (4%)', debit: 0, credit: 140000, description: 'Retención por servicios' },
          { code: '1110', name: 'Bancos Nacionales', debit: 0, credit: 3360000, description: 'Pago de servicio' }
        ]
      }
    ]
  },
  {
    id: 'carlos_restrepo_pn',
    name: 'Dr. Carlos Eduardo Restrepo Gómez',
    nit: '71.392.481-3',
    type: 'PERSONA_NATURAL',
    economicActivity: 'Actividades de contabilidad, teneduría de libros y consultoría tributaria',
    ciiuCode: '6920',
    regime: 'Persona Natural Residente - Sistema Cedular',
    description: 'Contribuyente Persona Natural para liquidar Renta Cedular (Formulario 210) e Impuesto al Patrimonio (Formulario 420). Posee bienes raíces, inversiones financieras y honorarios profesionales.',
    params: TAX_PARAMETERS_2024,
    initialBalances: {
      '1105': 5000000,
      '1110': 380000000, // Cuentas de ahorros y fiduciarias
      '1305': 45000000,  // Cuentas por cobrar honorarios
      '1524': 3250000000, // Apartamento residencial + oficina + vehículo
      '2205': 180000000, // Crédito hipotecario y obligaciones financieras
      '3105': 3500000000
    },
    transactions: [
      {
        id: 'TX-PN01',
        date: '2024-04-15',
        docNumber: 'FAC-HON-105',
        concept: 'Honorarios por asesoría tributaria a empresas (No vincula > 2 trabajadores)',
        thirdParty: 'Grupo Inversionista Antioquia S.A.',
        nit: '900.412.339-1',
        entries: [
          { code: '1110', name: 'Bancos Nacionales', debit: 133500000, credit: 0, description: 'Recaudo neto asesoría' },
          { code: '135515', name: 'Retención en la Fuente Sufrida (11%)', debit: 16500000, credit: 0, description: 'Certificado retefuente 11%' },
          { code: '4135', name: 'Ingresos por Honorarios (Cédula General)', debit: 0, credit: 150000000, description: 'Honorarios facturados' }
        ]
      },
      {
        id: 'TX-PN02',
        date: '2024-06-20',
        docNumber: 'CERT-FIDI-09',
        concept: 'Rendimientos de capital y dividendos no gravados (año 2017+)',
        thirdParty: 'Fiducuenta Bancolombia / Ecopetrol',
        nit: '860.002.964-4',
        entries: [
          { code: '1110', name: 'Bancos Nacionales', debit: 28500000, credit: 0, description: 'Rendimientos abonados' },
          { code: '135515', name: 'Retención Rendimientos Financieros (7%)', debit: 1500000, credit: 0, description: 'Retención sobre rendimientos' },
          { code: '4210', name: 'Rendimientos de Capital', debit: 0, credit: 30000000, description: 'Ingresos de capital' }
        ]
      },
      {
        id: 'TX-PN03',
        date: '2024-07-10',
        docNumber: 'PAGO-PILA-PN',
        concept: 'Pago de Aportes Seguridad Social como Independiente (Salud, Pensión, ARL)',
        thirdParty: 'Operador PILA Aportes en Línea',
        nit: '900.123.456-7',
        entries: [
          { code: '5105', name: 'Aportes a Pensión y Salud (INCRNGO)', debit: 18600000, credit: 0, description: 'No constitutivos de renta ni ganancia ocasional' },
          { code: '1110', name: 'Bancos Nacionales', debit: 0, credit: 18600000, description: 'Débito automático bancario' }
        ]
      }
    ]
  }
];

export const WORKSHOP_QUESTIONS: WorkshopQuestion[] = [
  {
    id: 'Q1',
    taxForm: '350',
    title: 'Caso Retefuente: Compra de Mercancías a Responsable de IVA',
    scenario: 'Nuestra empresa "Comercializadora SAS" compra mercancías gravadas al 19% por valor de $5.000.000 antes de IVA a un proveedor responsable del IVA (declarante). La base mínima legal para compras generales en UVT es de 27 UVT ($1.271.000 para 2024).',
    dataClues: [
      { label: 'Valor bruto de compra', value: '$5.000.000' },
      { label: 'Base mínima 27 UVT', value: '$1.270.755' },
      { label: 'Calidad del proveedor', value: 'Declarante de renta' }
    ],
    question: '¿Cuál es la tarifa y el valor exacto de retención en la fuente que debe practicarse y declararse en el Formulario 350?',
    options: [
      {
        id: 'A',
        text: '3.5% ($175.000) porque es compra general a un no declarante.',
        isCorrect: false,
        explanation: 'Incorrecto: La tarifa del 3.5% aplica únicamente cuando el proveedor es no declarante del impuesto sobre la renta.'
      },
      {
        id: 'B',
        text: '2.5% ($125.000) en el renglón de compras a declarantes.',
        isCorrect: true,
        explanation: '¡Excelente y correcto! Al ser el proveedor declarante de renta y superar la cuantía mínima de 27 UVT, la tarifa aplicable es del 2.5%, registrándose en la cuenta 236540 y renglón 50 del Formulario 350.'
      },
      {
        id: 'C',
        text: '0% porque la retención la practica la DIAN al final del año.',
        isCorrect: false,
        explanation: 'Incorrecto: Las personas jurídicas son agentes retenedores a título de renta (Art. 368 E.T.) y deben practicar la retención en el momento del pago o abono en cuenta.'
      },
      {
        id: 'D',
        text: '11% ($550.000) por tratarse de honorarios comerciales.',
        isCorrect: false,
        explanation: 'Incorrecto: La compra de inventarios corporales muebles tributa bajo el concepto de compras generales (2.5%), no como honorarios.'
      }
    ]
  },
  {
    id: 'Q2',
    taxForm: '300',
    title: 'Caso IVA: IVA Descontable con Factura Electrónica',
    scenario: 'Durante el bimestre enero-febrero, la empresa tuvo ingresos brutos por ventas gravadas al 19% de $80.000.000 (IVA generado: $15.200.000). Compró inventarios por $40.000.000 con IVA de $7.600.000 amparados en Factura Electrónica de Venta con su debido acuse de recibo de la mercancía y de la factura.',
    dataClues: [
      { label: 'IVA Generado (Renglón 57)', value: '$15.200.000' },
      { label: 'IVA Descontable compras (Renglón 66)', value: '$7.600.000' },
      { label: 'Retenciones IVA que le practicaron', value: '$0' }
    ],
    question: '¿Cuál es el saldo a pagar en el Formulario 300 del período y qué requisito fiscal clave valida la procedencia del descuento?',
    options: [
      {
        id: 'A',
        text: 'Saldo a pagar de $15.200.000; el IVA pagado no es descontable en el régimen ordinario.',
        isCorrect: false,
        explanation: 'Incorrecto: En el régimen ordinario de IVA, el impuesto pagado en adquisiciones vinculadas a operaciones gravadas sí constituye IVA descontable (Art. 485 y 488 E.T.).'
      },
      {
        id: 'B',
        text: 'Saldo a pagar de $7.600.000 ($15.200.000 - $7.600.000), sustentado en el mensaje electrónico de acuse de recibo del bien y de la factura electrónica (Art. 616-1 E.T.).',
        isCorrect: true,
        explanation: '¡Correcto! El saldo a pagar es la diferencia directa entre el IVA generado y el IVA descontable ($7.600.000). Además, según la Resolución 000085 de la DIAN y Art. 616-1 E.T., para compras a crédito es requisito sine qua non generar los dos eventos Application Response (acuse de recibo de factura y recibo del bien o servicio).'
      },
      {
        id: 'C',
        text: 'Saldo a favor de $7.600.000 porque las compras superan el 50% de las ventas.',
        isCorrect: false,
        explanation: 'Incorrecto: Para que exista saldo a favor, el IVA descontable debe superar al IVA generado.'
      }
    ]
  },
  {
    id: 'Q3',
    taxForm: '110',
    title: 'Caso Renta PJ: Tarifa General y Autorretención Especial',
    scenario: 'Una Sociedad por Acciones Simplificada (S.A.S.) del sector comercial, beneficiaria de la exoneración de aportes parafiscales del Art. 114-1 del E.T. (no paga SENA, ICBF ni Salud patronal por empleados que devenguen < 10 SMLMV), liquida su año gravable con una Renta Líquida Gravable de $100.000.000.',
    dataClues: [
      { label: 'Renta Líquida Gravable', value: '$100.000.000' },
      { label: 'Tarifa general de renta Art. 240 E.T.', value: '35%' },
      { label: 'Condición Art. 114-1 E.T.', value: 'Exonerada de aportes Sena/Icbf' }
    ],
    question: '¿Cuál es el impuesto básico sobre la renta líquida y cuál es el mecanismo obligatorio mensual que compensa dicha exoneración parafiscal?',
    options: [
      {
        id: 'A',
        text: 'Impuesto de $35.000.000 (35%), y mensualmente debió liquidar y pagar la Autorretención Especial a título de renta (Decreto 2201 de 2016 / DUR 1625).',
        isCorrect: true,
        explanation: '¡Completamente acertado! La tarifa general de sociedades nacionales es del 35% (Art. 240 E.T.). Al estar exonerada de aportes en virtud del Art. 114-1 E.T., la sociedad está obligada a practicarse mensualmente la autorretención especial sobre sus ingresos brutos (0.55%, 1.10% o 2.20% según CIIU), declarándola en el F350 y descontándola en el renglón 87 del F110.'
      },
      {
        id: 'B',
        text: 'Impuesto de $20.000.000 (20%) tarifa única mipyme, sin autorretenciones.',
        isCorrect: false,
        explanation: 'Incorrecto: La tarifa general corporativa ordinaria en Colombia es del 35%. La tarifa del 20% es exclusiva de usuarios operadores o industriales de Zona Franca.'
      },
      {
        id: 'C',
        text: 'Impuesto de $35.000.000, pero no tiene que autorretenerse nada porque solo los grandes contribuyentes lo hacen.',
        isCorrect: false,
        explanation: 'Incorrecto: La autorretención especial del Decreto 2201 de 2016 aplica a TODAS las sociedades sujetas al impuesto de renta que estén exoneradas de aportes parafiscales, independientemente de si son grandes contribuyentes o no.'
      }
    ]
  },
  {
    id: 'Q4',
    taxForm: '420',
    title: 'Caso Impuesto al Patrimonio: Umbral de Obligatoriedad',
    scenario: 'Al 1 de enero del año fiscal, un contribuyente persona natural residente presenta los siguientes datos: Patrimonio Bruto de $4.800.000.000 y Pasivos válidamente soportados de $900.000.000. El valor de la UVT vigente es de $47.065.',
    dataClues: [
      { label: 'Patrimonio Bruto', value: '$4.800.000.000' },
      { label: 'Deudas fiscales', value: '$900.000.000' },
      { label: 'Patrimonio Líquido', value: '$3.900.000.000' },
      { label: 'Tope legal Art. 292-3 E.T.', value: '72.000 UVT ($3.388.680.000)' }
    ],
    question: '¿Está obligada esta persona natural a presentar la Declaración del Impuesto al Patrimonio (Formulario 420)?',
    options: [
      {
        id: 'A',
        text: 'No, porque el impuesto al patrimonio solo grava a las personas jurídicas y empresas.',
        isCorrect: false,
        explanation: 'Incorrecto: La Ley 2277 de 2022 restableció el impuesto al patrimonio con carácter permanente gravando exclusivamente a PERSONAS NATURALES y sucesiones ilíquidas, no a personas jurídicas nacionales.'
      },
      {
        id: 'B',
        text: 'Sí, porque su patrimonio líquido ($3.900.000.000 = 82.864 UVT) supera el umbral legal de 72.000 UVT fijado en el artículo 292-3 del Estatuto Tributario.',
        isCorrect: true,
        explanation: '¡Excelente! El patrimonio líquido al 1 de enero ($3.900.000.000) dividido por la UVT de $47.065 arroja 82.864 UVT, sobrepasando las 72.000 UVT. En consecuencia, queda obligado a declarar en el Formulario 420.'
      },
      {
        id: 'C',
        text: 'No, porque las deudas extinguen cualquier obligación patrimonial complementaria.',
        isCorrect: false,
        explanation: 'Incorrecto: Las deudas solo restan para hallar el patrimonio líquido; si el neto resultante supera 72.000 UVT, surge la obligación tributaria sustancial y formal.'
      }
    ]
  }
];
