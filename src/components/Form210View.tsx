import React from 'react';
import { Form210State } from '../types/tax';
import { formatCOP } from '../services/taxEngine';
import { Info, HelpCircle } from 'lucide-react';

interface Form210ViewProps {
  data: Form210State;
  uvtValue: number;
}

export const Form210View: React.FC<Form210ViewProps> = ({ data, uvtValue }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md border-2 border-emerald-800 overflow-hidden">
        {/* Official Header */}
        <div className="bg-emerald-800 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-emerald-900 font-black text-xl px-2.5 py-1 rounded shadow-sm">
              210
            </div>
            <div>
              <h2 className="font-bold text-base uppercase tracking-wide">
                Declaración de Renta y Complementarios Personas Naturales y Asimiladas Residentes
              </h2>
              <p className="text-xs text-emerald-200">
                Sistema Cedular (Artículos 329 al 343 del Estatuto Tributario) - DIAN Colombia
              </p>
            </div>
          </div>
          <div className="bg-emerald-950 px-3 py-1.5 rounded text-xs border border-emerald-700">
            <span className="text-emerald-300 font-mono">Año Gravable: </span>
            <strong className="text-white text-sm">{data.ano}</strong>
          </div>
        </div>

        {/* Person Info */}
        <div className="bg-emerald-50/60 p-4 border-b border-emerald-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block text-[11px]">5. Número de Identificación Tributaria / Cédula</span>
            <span className="font-mono font-bold text-slate-800 text-sm">{data.nit}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-500 font-semibold block text-[11px]">
              12. Apellidos y Nombres del Declarante
            </span>
            <span className="font-bold text-slate-800 text-sm">{data.nombres}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* PATRIMONIO */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Patrimonio de la Persona Natural</span>
              <span className="text-emerald-400 font-mono text-[11px]">Renglones 28 a 30</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <div className="flex justify-between px-3 py-2">
                <span>28. Total Patrimonio Bruto (Bienes muebles, inmuebles, ahorros)</span>
                <span className="font-mono font-bold">{formatCOP(data.patrimonioBruto)}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>29. Total Deudas (Créditos hipotecarios, de consumo)</span>
                <span className="font-mono">{formatCOP(data.deudas)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-emerald-50 font-bold text-emerald-950">
                <span>30. TOTAL PATRIMONIO LÍQUIDO (28 - 29)</span>
                <span className="font-mono">{formatCOP(data.patrimonioLiquido)}</span>
              </div>
            </div>
          </div>

          {/* CÉDULA GENERAL */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Cédula General (Rentas de Trabajo, Capital y No Laborales)</span>
              <span className="text-emerald-400 font-mono text-[11px]">Art. 335 y 336 E.T.</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <div className="flex justify-between px-3 py-2">
                <span>32. Ingresos Brutos Rentas de Trabajo y Honorarios</span>
                <span className="font-mono font-semibold">{formatCOP(data.ingresosLaborales)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 text-indigo-700">
                <span>33. Ingresos no constitutivos de renta (Aportes obligatorios Salud y Pensión)</span>
                <span className="font-mono">- {formatCOP(data.ingresosNoConstitutivosLaboral)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 text-indigo-700">
                <span>37. Rentas exentas (25% Art. 206 Num 10 E.T.) y deducciones imputables</span>
                <span className="font-mono">- {formatCOP(data.rentasExentasLaborales)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-slate-50 font-semibold">
                <span>38. Renta líquida de trabajo ordinaria</span>
                <span className="font-mono">{formatCOP(data.rentaLiquidaLaboral)}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>46. Ingresos brutos por rentas de capital (Intereses, rendimientos)</span>
                <span className="font-mono font-semibold">{formatCOP(data.ingresosCapital)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-slate-100 font-bold text-slate-900">
                <span>65. TOTAL RENTA LÍQUIDA GRAVABLE CÉDULA GENERAL</span>
                <span className="font-mono">{formatCOP(data.rentaLiquidaGravableGeneral)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-amber-50 text-amber-900 font-medium text-[11px]">
                <span>Equivalente en UVT (Base gravable para tabla Art. 241 E.T.):</span>
                <span className="font-mono font-bold">
                  {(data.rentaLiquidaGravableGeneral / uvtValue).toFixed(2)} UVT
                </span>
              </div>
            </div>
          </div>

          {/* LIQUIDACIÓN PRIVADA */}
          <div>
            <div className="bg-emerald-900 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Liquidación Privada según Tabla Progresiva Art. 241 del Estatuto Tributario</span>
              <span className="text-emerald-300 font-mono text-[11px]">Tarifas 0% a 39%</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <div className="flex justify-between px-3 py-2">
                <span>117. Impuesto sobre la renta de la Cédula General (Liquidado en UVT: {data.impuestoGeneralUVT} UVT)</span>
                <span className="font-mono font-bold text-slate-900">{formatCOP(data.impuestoGeneralPesos)}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>124. TOTAL IMPUESTO SOBRE LAS RENTAS LÍQUIDAS GRAVABLES</span>
                <span className="font-mono font-bold">{formatCOP(data.totalImpuesto)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 text-indigo-700">
                <span>128. Menos: Retenciones en la fuente practicadas en el año</span>
                <span className="font-mono">- {formatCOP(data.retencionesPracticadas)}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>131. Más: Anticipo de renta año siguiente (Art. 807 E.T.)</span>
                <span className="font-mono">{formatCOP(data.anticipoAnoSiguiente)}</span>
              </div>

              <div className="p-3 bg-emerald-50 flex items-center justify-between font-bold text-sm text-emerald-950 border-t-2 border-emerald-600">
                <span>135. TOTAL SALDO A PAGAR DEL CONTRIBUYENTE</span>
                <span className="font-mono text-base font-black text-emerald-900">
                  {formatCOP(data.saldoAPagar)}
                </span>
              </div>

              {data.saldoAFavor > 0 && (
                <div className="p-3 bg-blue-50 flex items-center justify-between font-bold text-sm text-blue-950 border-t border-blue-300">
                  <span>136. TOTAL SALDO A FAVOR</span>
                  <span className="font-mono text-base font-black text-blue-900">
                    {formatCOP(data.saldoAFavor)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-4 text-xs text-slate-600 flex items-start space-x-3">
          <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Criterio Pedagógico SENA:</strong>
            <p className="mt-0.5">
              En personas naturales, las primeras 1.090 UVT de renta líquida gravable tienen tarifa 0%. La reforma tributaria (Ley 2277) limitó las rentas exentas y deducciones al 40% o máximo 1.340 UVT anuales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
