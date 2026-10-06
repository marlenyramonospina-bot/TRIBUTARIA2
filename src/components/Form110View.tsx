import React, { useState } from 'react';
import { Form110State } from '../types/tax';
import { formatCOP } from '../services/taxEngine';
import { Info, HelpCircle, FileCheck2, Calculator, ShieldCheck } from 'lucide-react';

interface Form110ViewProps {
  data: Form110State;
  onUpdateField?: (field: keyof Form110State, value: number) => void;
}

export const Form110View: React.FC<Form110ViewProps> = ({ data }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const rowExpl: Record<number, string> = {
    33: 'Efectivo y equivalentes de efectivo: Saldos en caja general, cuentas bancarias e inversiones a la vista al 31 de diciembre (Art. 261 E.T.).',
    35: 'Cuentas por cobrar: Saldos a favor de clientes menos deterioro de cartera fiscal (Art. 145 E.T.).',
    36: 'Inventarios: Valuación fiscal de mercancías no fabricadas por la empresa a costo de adquisición (Art. 66 E.T.).',
    37: 'Propiedades, planta y equipo: Costo fiscal menos depreciación acumulada según topes del Art. 137 E.T.',
    39: 'Total patrimonio bruto: Sumatoria de todos los bienes y derechos apreciables en dinero del contribuyente.',
    40: 'Total pasivos: Obligaciones financieras, proveedores y deudas válidas con soporte fiscal (Art. 283 E.T.).',
    41: 'Total patrimonio líquido: Patrimonio bruto menos pasivos (R39 - R40).',
    42: 'Ingresos brutos operacionales: Total facturación electrónica emitida por actividades del objeto social.',
    48: 'Devoluciones, rebajas y descuentos: Registradas con nota crédito electrónica referenciando factura.',
    49: 'Total ingresos netos: Ingresos brutos menos ingresos no constitutivos y devoluciones.',
    58: 'Costo de ventas: Costo imputable a la mercancía vendida en el período fiscal (Art. 62 E.T.).',
    60: 'Gastos de administración: Salarios con nómina electrónica, honorarios, arriendos y servicios.',
    65: 'Total costos y deducciones: Suma de costos y gastos operacionales deducibles fiscalmente.',
    66: 'Renta líquida ordinaria: Total ingresos netos menos costos y deducciones (R49 - R65).',
    76: 'Impuesto sobre renta líquida: Tarifa del 35% sobre la Renta Líquida Gravable (Art. 240 E.T.).',
    86: 'Retenciones en la fuente que le practicaron: Respaldadas en certificados expedidos por clientes.',
    87: 'Autorretenciones: Autorretención especial a título de renta practicada mensualmente (DUR 1625).',
    89: 'Anticipo renta año siguiente: Porcentaje legal (75% o 50%) menos retenciones sufridas (Art. 807 E.T.).',
    91: 'Total saldo a pagar: Impuesto neto + anticipo siguiente - retenciones - autorretenciones.'
  };

  return (
    <div className="space-y-6">
      {/* Official Form Header Styled like DIAN Muisca */}
      <div className="bg-white rounded-xl shadow-md border-2 border-emerald-800 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-emerald-800 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-emerald-900 font-black text-xl px-2.5 py-1 rounded shadow-sm">
              110
            </div>
            <div>
              <h2 className="font-bold text-base uppercase tracking-wide">
                Declaración de Renta y Complementarios o de Ingresos y Patrimonio para Personas Jurídicas
              </h2>
              <p className="text-xs text-emerald-200">
                Dirección de Impuestos y Aduanas Nacionales - Formulario Oficial DIAN
              </p>
            </div>
          </div>
          <div className="text-right flex items-center gap-4">
            <div className="bg-emerald-950 px-3 py-1.5 rounded text-xs border border-emerald-700">
              <span className="text-emerald-300 font-mono">Año Gravable: </span>
              <strong className="text-white text-sm">{data.ano}</strong>
            </div>
            <div className="hidden sm:block text-right text-[11px] font-mono text-emerald-300">
              Código Único: 110-{data.ano}-SENA
            </div>
          </div>
        </div>

        {/* Declarant Details */}
        <div className="bg-emerald-50/60 p-4 border-b border-emerald-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block text-[11px]">5. Número de Identificación Tributaria (NIT)</span>
            <span className="font-mono font-bold text-slate-800 text-sm">{data.nit}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-500 font-semibold block text-[11px]">
              12. Razón Social del Contribuyente
            </span>
            <span className="font-bold text-slate-800 text-sm">{data.razonSocial}</span>
          </div>
        </div>

        {/* Form Body - Official Row Matrix */}
        <div className="p-6 space-y-6">
          {/* Section: PATRIMONIO */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase tracking-wide flex justify-between">
              <span>Sección: Datos del Patrimonio (Artículos 261 al 287 del E.T.)</span>
              <span className="text-emerald-400 font-mono text-[11px]">Renglones 33 a 41</span>
            </div>

            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <RowItem rowNum={33} label="Efectivo y equivalentes de efectivo" value={data.efectivoYEquivalentes} expl={rowExpl[33]} />
              <RowItem rowNum={34} label="Inversiones e instrumentos financieros derivados" value={data.inversiones} />
              <RowItem rowNum={35} label="Cuentas, documentos y arrendamientos financieros por cobrar" value={data.cuentasPorCobrar} expl={rowExpl[35]} />
              <RowItem rowNum={36} label="Inventarios" value={data.inventarios} expl={rowExpl[36]} />
              <RowItem rowNum={37} label="Activos fijos (Propiedades, planta y equipo)" value={data.activosFijos} expl={rowExpl[37]} />
              <RowItem rowNum={38} label="Otros activos" value={data.otrosActivos} />
              <RowItem rowNum={39} label="TOTAL PATRIMONIO BRUTO (33+34+35+36+37+38)" value={data.totalPatrimonioBruto} isTotal expl={rowExpl[39]} />
              <RowItem rowNum={40} label="Pasivos (Total deudas fiscales válidas)" value={data.pasivos} expl={rowExpl[40]} />
              <RowItem rowNum={41} label="TOTAL PATRIMONIO LÍQUIDO (39 - 40)" value={data.totalPatrimonioLiquido} isGrandTotal expl={rowExpl[41]} />
            </div>
          </div>

          {/* Section: INGRESOS */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase tracking-wide flex justify-between">
              <span>Sección: Ingresos Fiscales Netos (Artículos 26 al 28 del E.T.)</span>
              <span className="text-emerald-400 font-mono text-[11px]">Renglones 42 a 49</span>
            </div>

            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <RowItem rowNum={42} label="Ingresos brutos operacionales" value={data.ingresosBrutosOperacionales} expl={rowExpl[42]} />
              <RowItem rowNum={43} label="Ingresos brutos no operacionales" value={data.ingresosBrutosNoOperacionales} />
              <RowItem rowNum={44} label="Intereses y rendimientos financieros" value={data.interesesYFinancieros} />
              <RowItem rowNum={47} label="Ingresos no constitutivos de renta ni ganancia ocasional" value={data.ingresosNoConstitutivos} />
              <RowItem rowNum={48} label="Menos devoluciones, rebajas y descuentos en ventas" value={data.devolucionesEnVentas || 0} expl={rowExpl[48]} />
              <RowItem rowNum={49} label="TOTAL INGRESOS NETOS (42+43+44 - 47 - 48)" value={data.totalIngresosNetos} isTotal expl={rowExpl[49]} />
            </div>
          </div>

          {/* Section: COSTOS Y DEDUCCIONES */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase tracking-wide flex justify-between">
              <span>Sección: Costos y Deducciones (Artículos 58 al 177 del E.T.)</span>
              <span className="text-emerald-400 font-mono text-[11px]">Renglones 58 a 65</span>
            </div>

            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <RowItem rowNum={58} label="Costo de ventas" value={data.costoDeVentas} expl={rowExpl[58]} />
              <RowItem rowNum={60} label="Gastos operacionales de administración" value={data.gastosOperacionalesAdministracion} expl={rowExpl[60]} />
              <RowItem rowNum={61} label="Gastos operacionales de ventas" value={data.gastosOperacionalesVentas} />
              <RowItem rowNum={62} label="Gastos financieros" value={data.gastosFinancieros} />
              <RowItem rowNum={63} label="Otros gastos y deducciones" value={data.otrosGastosYDeducciones} />
              <RowItem rowNum={65} label="TOTAL COSTOS Y DEDUCCIONES (58+60+61+62+63)" value={data.totalCostosYDeducciones} isTotal expl={rowExpl[65]} />
            </div>
          </div>

          {/* Section: RENTA LÍQUIDA */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase tracking-wide flex justify-between">
              <span>Sección: Renta Líquida Ordinaria</span>
              <span className="text-emerald-400 font-mono text-[11px]">Renglones 66 a 71</span>
            </div>

            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <RowItem rowNum={66} label="RENTA LÍQUIDA ORDINARIA DEL EJERCICIO (49 - 65)" value={data.rentaLiquidaOrdinaria} isTotal expl={rowExpl[66]} />
              <RowItem rowNum={68} label="Compensación de pérdidas fiscales de años anteriores" value={data.compensacionPerdidas} />
              <RowItem rowNum={70} label="RENTA LÍQUIDA GRAVABLE (66 - 68)" value={data.rentaLiquidaGravable} isGrandTotal />
              <RowItem rowNum={71} label="Renta presuntiva (Tarifa 0% vigente)" value={data.rentaPresuntiva} />
            </div>
          </div>

          {/* Section: LIQUIDACIÓN PRIVADA */}
          <div>
            <div className="bg-emerald-900 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase tracking-wide flex justify-between">
              <span>Sección: Liquidación Privada del Impuesto (Tarifa 35% Art. 240 E.T.)</span>
              <span className="text-emerald-300 font-mono text-[11px]">Renglones 76 a 92</span>
            </div>

            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <RowItem rowNum={76} label="Impuesto sobre la renta líquida gravable (35%)" value={data.impuestoSobreRentaLiquida} expl={rowExpl[76]} />
              <RowItem rowNum={79} label="Descuentos tributarios (Art. 254 a 257-1 E.T.)" value={data.descuentosTributarios} />
              <RowItem rowNum={81} label="IMPUESTO NETO DE RENTA (76 - 79)" value={data.impuestoNetoDeRenta} isTotal />
              <RowItem rowNum={85} label="TOTAL IMPUESTO A CARGO" value={data.totalImpuestoACargo} isTotal />
              <RowItem rowNum={86} label="Menos: Retenciones en la fuente que le practicaron" value={data.retencionesEnLaFuentePracticadas} isCredit expl={rowExpl[86]} />
              <RowItem rowNum={87} label="Menos: Autorretenciones practicadas (0.55% DUR 1625)" value={data.autorretencionesPracticadas} isCredit expl={rowExpl[87]} />
              <RowItem rowNum={88} label="Menos: Anticipo de renta liquidado año anterior" value={data.anticipoRentaAnoAnterior} isCredit />
              <RowItem rowNum={89} label="Más: Anticipo de renta para el año siguiente (Art. 807 E.T.)" value={data.anticipoRentaAnoSiguiente} expl={rowExpl[89]} />
              
              <div className="p-3 bg-emerald-50 flex items-center justify-between font-bold text-sm text-emerald-950 border-t-2 border-emerald-600">
                <div className="flex items-center space-x-2">
                  <span className="w-8 font-mono bg-emerald-700 text-white text-center py-0.5 rounded text-xs">
                    91
                  </span>
                  <span>TOTAL SALDO A PAGAR POR EL AÑO GRAVABLE</span>
                </div>
                <span className="font-mono text-base text-emerald-900 font-black">
                  {formatCOP(data.saldoAPagar)}
                </span>
              </div>

              {data.saldoAFavor > 0 && (
                <div className="p-3 bg-blue-50 flex items-center justify-between font-bold text-sm text-blue-950 border-t border-blue-300">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 font-mono bg-blue-700 text-white text-center py-0.5 rounded text-xs">
                      92
                    </span>
                    <span>TOTAL SALDO A FAVOR DEL CONTRIBUYENTE</span>
                  </div>
                  <span className="font-mono text-base text-blue-900 font-black">
                    {formatCOP(data.saldoAFavor)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pedagogical Note for Apprentices */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-xs text-slate-600 flex items-start space-x-3">
          <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Nota Didáctica para Aprendices SENA:</strong>
            <p className="mt-0.5">
              El Formulario 110 se presenta anualmente según los dos últimos dígitos del NIT. Recuerda verificar el cumplimiento de la Conciliación Contable-Fiscal (Formato 2516, Art. 772-1 E.T.) y que las autorretenciones del renglón 87 hayan sido efectivamente canceladas en los Formularios 350 de cada mes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RowItem: React.FC<{
  rowNum: number;
  label: string;
  value: number;
  isTotal?: boolean;
  isGrandTotal?: boolean;
  isCredit?: boolean;
  expl?: string;
}> = ({ rowNum, label, value, isTotal, isGrandTotal, isCredit, expl }) => {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 group hover:bg-slate-50 transition ${
        isGrandTotal
          ? 'bg-emerald-50/70 font-bold text-slate-900'
          : isTotal
          ? 'bg-slate-100/70 font-semibold text-slate-800'
          : 'text-slate-700'
      }`}
    >
      <div className="flex items-center space-x-2.5">
        <span
          className={`w-7 text-center py-0.5 rounded text-[11px] font-mono font-bold ${
            isGrandTotal
              ? 'bg-emerald-700 text-white'
              : isTotal
              ? 'bg-slate-700 text-white'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          {rowNum}
        </span>
        <span className="text-xs">{label}</span>
        {expl && (
          <span title={expl} className="text-slate-400 hover:text-emerald-700 cursor-help">
            <HelpCircle className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      <div className="font-mono text-xs">
        <span
          className={
            isGrandTotal
              ? 'text-emerald-900 font-extrabold text-sm'
              : isCredit
              ? 'text-indigo-700 font-medium'
              : isTotal
              ? 'text-slate-900 font-bold'
              : 'text-slate-800'
          }
        >
          {isCredit && value > 0 ? `- ${formatCOP(value)}` : formatCOP(value)}
        </span>
      </div>
    </div>
  );
};
