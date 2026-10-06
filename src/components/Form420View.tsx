import React from 'react';
import { Form420State } from '../types/tax';
import { formatCOP } from '../services/taxEngine';
import { Info, ShieldAlert } from 'lucide-react';

interface Form420ViewProps {
  data: Form420State;
}

export const Form420View: React.FC<Form420ViewProps> = ({ data }) => {
  const isObligado = data.patrimonioLiquidoEnUVT > data.limiteNoSujetoUVT;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md border-2 border-rose-800 overflow-hidden">
        {/* Header */}
        <div className="bg-rose-900 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-rose-950 font-black text-xl px-2.5 py-1 rounded shadow-sm">
              420
            </div>
            <div>
              <h2 className="font-bold text-base uppercase tracking-wide">
                Declaración del Impuesto al Patrimonio
              </h2>
              <p className="text-xs text-rose-200">
                Sujetos Pasivos: Personas Naturales con Patrimonio Líquido &gt; 72.000 UVT (Art. 292-3 E.T. Ley 2277)
              </p>
            </div>
          </div>
          <div className="bg-rose-950 px-3 py-1.5 rounded text-xs border border-rose-700">
            <span className="text-rose-300 font-mono">Año Gravable: </span>
            <strong className="text-white text-sm">{data.ano}</strong>
          </div>
        </div>

        {/* Declarant Info */}
        <div className="bg-rose-50/60 p-4 border-b border-rose-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block text-[11px]">5. NIT / Documento de Identidad</span>
            <span className="font-mono font-bold text-slate-800 text-sm">{data.nit}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-500 font-semibold block text-[11px]">12. Apellidos y Nombres del Declarante</span>
            <span className="font-bold text-slate-800 text-sm">{data.nombreDeclarante}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* OBLIGATORIEDAD STATUS BADGE */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isObligado
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}
          >
            <div>
              <h4 className="font-bold text-sm">
                {isObligado
                  ? '⚠️ Contribuyente OBLIGADO a declarar y pagar Impuesto al Patrimonio'
                  : '✓ NO OBLIGADO al Impuesto al Patrimonio'}
              </h4>
              <p className="text-xs mt-0.5 opacity-90">
                Patrimonio Líquido al 1 de enero: <strong>{formatCOP(data.patrimonioLiquido)}</strong> ({data.patrimonioLiquidoEnUVT.toLocaleString()} UVT).
                Umbral legal mínimo: <strong>72.000 UVT ({formatCOP(72000 * data.uvtVigente)})</strong>.
              </p>
            </div>
            <span className="font-mono font-black text-lg">
              {data.patrimonioLiquidoEnUVT.toLocaleString()} UVT
            </span>
          </div>

          {/* PATRIMONIO LIQUIDACIÓN */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Determinación de la Base Gravable (Art. 295-3 E.T.)</span>
              <span className="text-rose-400 font-mono text-[11px]">Posesión al 1 de Enero</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <div className="flex justify-between px-3 py-2">
                <span>33. Total Patrimonio Bruto Poseído</span>
                <span className="font-mono font-semibold">{formatCOP(data.totalPatrimonioBruto)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 text-indigo-700">
                <span>34. Menos: Total Deudas válidamente respaldadas</span>
                <span className="font-mono">- {formatCOP(data.totalDeudas)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-slate-100 font-bold text-slate-900">
                <span>35. PATRIMONIO LÍQUIDO FISCAL (33 - 34)</span>
                <span className="font-mono">{formatCOP(data.patrimonioLiquido)}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>Valor de la UVT del año gravable</span>
                <span className="font-mono">{formatCOP(data.uvtVigente)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 font-mono">
                <span>Patrimonio Líquido expresado en UVT</span>
                <span className="font-bold">{data.patrimonioLiquidoEnUVT.toLocaleString()} UVT</span>
              </div>
              <div className="flex justify-between px-3 py-2 text-slate-500">
                <span>Menos: Límite no sujeto de las primeras 72.000 UVT</span>
                <span className="font-mono">- 72.000 UVT</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-rose-50 font-bold text-rose-950">
                <span>BASE GRAVABLE EN UVT SUJETA A TARIFA MARGINAL</span>
                <span className="font-mono">{Math.max(0, data.baseGravableUVT).toLocaleString()} UVT</span>
              </div>
            </div>
          </div>

          {/* LIQUIDACIÓN DE LA TARIFA MARGINAL */}
          <div>
            <div className="bg-rose-950 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Tabla de Tarifas Marginales (Artículo 296-3 del E.T.)</span>
              <span className="text-rose-300 font-mono text-[11px]">Tarifas 0.5%, 1.0% y 1.5%</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <div className="p-3 bg-slate-50 text-[11px] text-slate-600">
                • 0 a 72.000 UVT: 0% | • &gt; 72.000 a 122.000 UVT: 0.5% | • &gt; 122.000 a 239.000 UVT: 1.0% | • &gt; 239.000 UVT: 1.5%
              </div>

              <div className="p-4 bg-rose-50 flex items-center justify-between font-bold text-sm text-rose-950">
                <span>TOTAL IMPUESTO AL PATRIMONIO A CARGO (Y A PAGAR)</span>
                <span className="font-mono text-base font-black text-rose-950">
                  {formatCOP(data.totalPagarPatrimonio)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-4 text-xs text-slate-600 flex items-start space-x-3">
          <Info className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Nota Didáctica SENA:</strong>
            <p className="mt-0.5">
              Las personas naturales pueden restar de su base patrimonial las primeras 12.000 UVT del valor de su casa o apartamento de habitación (Art. 295-3 E.T.). El pago de este impuesto se realiza comúnmente en dos cuotas iguales en mayo y septiembre.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
