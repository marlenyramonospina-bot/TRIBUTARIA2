import React from 'react';
import { Form350State } from '../types/tax';
import { formatCOP } from '../services/taxEngine';
import { Info, AlertTriangle } from 'lucide-react';

interface Form350ViewProps {
  data: Form350State;
}

export const Form350View: React.FC<Form350ViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md border-2 border-amber-800 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-amber-800 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-amber-950 font-black text-xl px-2.5 py-1 rounded shadow-sm">
              350
            </div>
            <div>
              <h2 className="font-bold text-base uppercase tracking-wide">
                Declaración Mensual de Retenciones en la Fuente
              </h2>
              <p className="text-xs text-amber-200">
                A título de Renta, Ventas (IVA) y Timbre Nacional - DIAN Colombia
              </p>
            </div>
          </div>
          <div className="bg-amber-950 px-3 py-1.5 rounded text-xs border border-amber-700">
            <span className="text-amber-300 font-mono">Año: </span>
            <strong className="text-white text-sm">{data.ano}</strong>
            <span className="mx-2 text-amber-500">|</span>
            <span className="text-amber-300 font-mono">Mes: </span>
            <strong className="text-white text-sm">0{data.mes}</strong>
          </div>
        </div>

        {/* Declarant Details */}
        <div className="bg-amber-50/60 p-4 border-b border-amber-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block text-[11px]">5. Número de Identificación Tributaria (NIT)</span>
            <span className="font-mono font-bold text-slate-800 text-sm">{data.nit}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-500 font-semibold block text-[11px]">12. Agente Retenedor (Razón Social)</span>
            <span className="font-bold text-slate-800 text-sm">{data.razonSocial}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* RETENCIONES A TÍTULO DE RENTA */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Retenciones Practicadas a Título de Impuesto sobre la Renta</span>
              <span className="text-amber-400 font-mono text-[11px]">Conceptos F350</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              {/* Salarios */}
              <div className="grid grid-cols-12 px-3 py-2 items-center bg-white hover:bg-slate-50">
                <span className="col-span-6">Pagos laborales y rentas de trabajo (Art. 383 E.T.)</span>
                <span className="col-span-3 text-right font-mono text-slate-500">Base: {formatCOP(data.baseLaboral)}</span>
                <span className="col-span-3 text-right font-mono font-bold text-slate-900">{formatCOP(data.retencionLaboral)}</span>
              </div>
              {/* Honorarios */}
              <div className="grid grid-cols-12 px-3 py-2 items-center bg-white hover:bg-slate-50">
                <span className="col-span-6">Honorarios profesionales (Tarifa 10% / 11%)</span>
                <span className="col-span-3 text-right font-mono text-slate-500">Base: {formatCOP(data.baseHonorarios)}</span>
                <span className="col-span-3 text-right font-mono font-bold text-slate-900">{formatCOP(data.retencionHonorarios)}</span>
              </div>
              {/* Servicios */}
              <div className="grid grid-cols-12 px-3 py-2 items-center bg-white hover:bg-slate-50">
                <span className="col-span-6">Servicios generales y mantenimiento (Tarifa 4% / 6%)</span>
                <span className="col-span-3 text-right font-mono text-slate-500">Base: {formatCOP(data.baseServicios)}</span>
                <span className="col-span-3 text-right font-mono font-bold text-slate-900">{formatCOP(data.retencionServicios)}</span>
              </div>
              {/* Arrendamientos */}
              <div className="grid grid-cols-12 px-3 py-2 items-center bg-white hover:bg-slate-50">
                <span className="col-span-6">Arrendamientos bienes muebles e inmuebles (Tarifa 3.5% / 4%)</span>
                <span className="col-span-3 text-right font-mono text-slate-500">Base: {formatCOP(data.baseArrendamientos)}</span>
                <span className="col-span-3 text-right font-mono font-bold text-slate-900">{formatCOP(data.retencionArrendamientos)}</span>
              </div>
              {/* Compras */}
              <div className="grid grid-cols-12 px-3 py-2 items-center bg-white hover:bg-slate-50">
                <span className="col-span-6">Compras generales a declarantes (Tarifa 2.5% - Base &gt; 27 UVT)</span>
                <span className="col-span-3 text-right font-mono text-slate-500">Base: {formatCOP(data.baseCompras)}</span>
                <span className="col-span-3 text-right font-mono font-bold text-slate-900">{formatCOP(data.retencionCompras)}</span>
              </div>
              {/* Autorretención Especial */}
              <div className="grid grid-cols-12 px-3 py-2 items-center bg-amber-50/70 hover:bg-amber-100/50">
                <span className="col-span-6 font-semibold text-amber-950">
                  Autorretención Especial a Título de Renta (Decreto 2201 / DUR 1625 - 0.55%)
                </span>
                <span className="col-span-3 text-right font-mono text-amber-800">Base: {formatCOP(data.baseAutorretencionEspecial)}</span>
                <span className="col-span-3 text-right font-mono font-bold text-amber-950">{formatCOP(data.retencionAutorretencionEspecial)}</span>
              </div>
              {/* Subtotal Renta */}
              <div className="flex justify-between px-3 py-2.5 bg-slate-100 font-bold text-slate-900">
                <span>TOTAL RETENCIONES A TÍTULO DE RENTA</span>
                <span className="font-mono">{formatCOP(data.totalRetencionesRenta)}</span>
              </div>
            </div>
          </div>

          {/* RETENCIONES DE IVA (RETEIVA) */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Retenciones Practicadas a Título de Impuesto sobre las Ventas (IVA)</span>
              <span className="text-amber-400 font-mono text-[11px]">Art. 437-1 y 437-2 E.T.</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <div className="flex justify-between px-3 py-2">
                <span>Retención en la fuente por compras y servicios (ReteIVA 15%)</span>
                <span className="font-mono font-bold">{formatCOP(data.retencionReteIva)}</span>
              </div>
            </div>
          </div>

          {/* TOTAL A PAGAR Y ADVERTENCIA */}
          <div>
            <div className="border border-amber-400 rounded-lg overflow-hidden">
              <div className="p-4 bg-amber-50 flex items-center justify-between font-bold text-sm text-amber-950">
                <span>TOTAL A PAGAR DE RETENCIONES DEL MES</span>
                <span className="font-mono text-lg font-black text-amber-950">
                  {formatCOP(data.totalPagar)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Alert: Art. 580-1 E.T. (Ineficacia por no pago) */}
        <div className="bg-rose-50 border-t border-rose-200 p-4 text-xs text-rose-800 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-rose-900 font-bold">¡Alerta Legal Art. 580-1 del Estatuto Tributario!</strong>
            <p className="mt-0.5">
              Las declaraciones de retención en la fuente presentadas sin pago total no producirán efecto legal alguno (son consideradas ineficaces de pleno derecho), sin necesidad de acto administrativo que así lo declare. Solo se cuenta con un plazo de gracia de dos meses si el valor a pagar es inferior a 10 UVT o si existen saldos a favor susceptibles de compensación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
