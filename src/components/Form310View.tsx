import React from 'react';
import { Form310State } from '../types/tax';
import { formatCOP } from '../services/taxEngine';
import { Info, UtensilsCrossed } from 'lucide-react';

interface Form310ViewProps {
  data: Form310State;
}

export const Form310View: React.FC<Form310ViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md border-2 border-purple-800 overflow-hidden">
        {/* Header */}
        <div className="bg-purple-800 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-purple-950 font-black text-xl px-2.5 py-1 rounded shadow-sm">
              310
            </div>
            <div>
              <h2 className="font-bold text-base uppercase tracking-wide">
                Declaración del Impuesto Nacional al Consumo (INC)
              </h2>
              <p className="text-xs text-purple-200">
                Servicios de expendio de comidas y bebidas, telefonía móvil y vehículos - DIAN
              </p>
            </div>
          </div>
          <div className="bg-purple-950 px-3 py-1.5 rounded text-xs border border-purple-700">
            <span className="text-purple-300 font-mono">Año: </span>
            <strong className="text-white text-sm">{data.ano}</strong>
            <span className="mx-2 text-purple-500">|</span>
            <span className="text-purple-300 font-mono">Bimestre: </span>
            <strong className="text-white text-sm">0{data.bimestre}</strong>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-purple-50/60 p-4 border-b border-purple-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block text-[11px]">5. NIT</span>
            <span className="font-mono font-bold text-slate-800 text-sm">{data.nit}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-500 font-semibold block text-[11px]">12. Razón Social Responsable del INC</span>
            <span className="font-bold text-slate-800 text-sm">{data.razonSocial}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Bases Gravables y Liquidación del Impuesto al Consumo (Art. 512-1 E.T.)</span>
              <span className="text-purple-400 font-mono text-[11px]">Tarifas 4% y 8%</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              {/* Servicios Comidas y Bebidas 8% */}
              <div className="grid grid-cols-12 px-3 py-2.5 items-center bg-white hover:bg-slate-50">
                <span className="col-span-6 font-medium text-slate-800">
                  30. Servicios de comidas y bebidas en restaurantes, cafeterías, autoservicios y bares (8%)
                </span>
                <span className="col-span-3 text-right font-mono text-slate-500">
                  Base: {formatCOP(data.baseServiciosComidasYBebidas8)}
                </span>
                <span className="col-span-3 text-right font-mono font-bold text-purple-900">
                  {formatCOP(data.impuestoComidasYBebidas8)}
                </span>
              </div>

              {/* Telefonía Móvil 4% */}
              <div className="grid grid-cols-12 px-3 py-2 items-center bg-white hover:bg-slate-50">
                <span className="col-span-6 text-slate-600">Servicios de telefonía, datos e internet móvil (4%)</span>
                <span className="col-span-3 text-right font-mono text-slate-400">Base: $0</span>
                <span className="col-span-3 text-right font-mono text-slate-400">$0</span>
              </div>

              {/* Vehículos */}
              <div className="grid grid-cols-12 px-3 py-2 items-center bg-white hover:bg-slate-50">
                <span className="col-span-6 text-slate-600">Vehículos automóviles y camperos gravados</span>
                <span className="col-span-3 text-right font-mono text-slate-400">Base: $0</span>
                <span className="col-span-3 text-right font-mono text-slate-400">$0</span>
              </div>

              <div className="flex justify-between px-3 py-2 bg-slate-100 font-bold text-slate-900">
                <span>TOTAL IMPUESTO AL CONSUMO GENERADO</span>
                <span className="font-mono">{formatCOP(data.totalImpuestoINC)}</span>
              </div>

              <div className="p-3 bg-purple-50 flex items-center justify-between font-bold text-sm text-purple-950 border-t-2 border-purple-600">
                <span>TOTAL SALDO A PAGAR POR EL PERÍODO (INC)</span>
                <span className="font-mono text-base font-black text-purple-900">
                  {formatCOP(data.totalPagarINC)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-4 text-xs text-slate-600 flex items-start space-x-3">
          <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Concepto Clave SENA (Diferencia INC vs. IVA):</strong>
            <p className="mt-0.5">
              Los restaurantes y bares que no operan bajo franquicia están gravados con el <strong>Impuesto Nacional al Consumo (8%)</strong> y no son responsables del IVA por estas actividades. El INC pagado en las compras no genera descuento tributario, sino que se incorpora como mayor valor del costo o gasto deducible en el Formulario 110.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
