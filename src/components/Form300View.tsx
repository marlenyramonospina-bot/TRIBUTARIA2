import React from 'react';
import { Form300State } from '../types/tax';
import { formatCOP } from '../services/taxEngine';
import { Info, HelpCircle } from 'lucide-react';

interface Form300ViewProps {
  data: Form300State;
}

export const Form300View: React.FC<Form300ViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md border-2 border-teal-800 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-teal-800 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-teal-900 font-black text-xl px-2.5 py-1 rounded shadow-sm">
              300
            </div>
            <div>
              <h2 className="font-bold text-base uppercase tracking-wide">
                Declaración del Impuesto sobre las Ventas (IVA)
              </h2>
              <p className="text-xs text-teal-200">
                Periodicidad Bimestral o Cuatrimestral (Artículos 600 y 601 del E.T.) - DIAN
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-teal-950 px-3 py-1.5 rounded text-xs border border-teal-700">
              <span className="text-teal-300 font-mono">Año: </span>
              <strong className="text-white text-sm">{data.ano}</strong>
              <span className="mx-2 text-teal-500">|</span>
              <span className="text-teal-300 font-mono">Bimestre: </span>
              <strong className="text-white text-sm">0{data.bimestre} (Ene-Feb)</strong>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-teal-50/60 p-4 border-b border-teal-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block text-[11px]">5. Número de Identificación Tributaria (NIT)</span>
            <span className="font-mono font-bold text-slate-800 text-sm">{data.nit}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-500 font-semibold block text-[11px]">12. Razón Social Responsable de IVA</span>
            <span className="font-bold text-slate-800 text-sm">{data.razonSocial}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* INGRESOS POR OPERACIONES GRAVADAS Y EXCLUIDAS */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Sección: Ingresos por Operaciones del Período</span>
              <span className="text-teal-400 font-mono text-[11px]">Renglones 27 a 38</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <div className="flex justify-between px-3 py-2">
                <span>27. Ingresos por operaciones gravadas a la tarifa general (19%)</span>
                <span className="font-mono font-semibold">{formatCOP(data.ingresosGravados19)}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>28. Ingresos por operaciones gravadas a la tarifa del 5%</span>
                <span className="font-mono">{formatCOP(data.ingresosGravados5)}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>32. Ingresos por operaciones exentas (Tarifa 0% Art. 477 E.T.)</span>
                <span className="font-mono">{formatCOP(data.ingresosExentos)}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>33. Ingresos por operaciones excluidas (Art. 424 E.T.)</span>
                <span className="font-mono">{formatCOP(data.ingresosExcluidos)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-slate-100 font-semibold">
                <span>36. TOTAL INGRESOS BRUTOS DEL PERÍODO</span>
                <span className="font-mono">{formatCOP(data.totalIngresosBrutos)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 text-indigo-700">
                <span>37. Menos: Devoluciones en ventas anuladas, rescindidas o resueltas</span>
                <span className="font-mono">- {formatCOP(data.devolucionesEnVentas)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-slate-100 font-bold text-slate-900">
                <span>38. TOTAL INGRESOS NETOS GRAVABLES</span>
                <span className="font-mono">{formatCOP(data.totalIngresosNetos)}</span>
              </div>
            </div>
          </div>

          {/* COMPRAS DEL PERÍODO */}
          <div>
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Sección: Compras e Importaciones Nacionales</span>
              <span className="text-teal-400 font-mono text-[11px]">Renglones 44 a 54</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <div className="flex justify-between px-3 py-2">
                <span>44. De bienes gravados a la tarifa general (19%)</span>
                <span className="font-mono font-semibold">{formatCOP(data.comprasGravadas19)}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>45. De bienes gravados a la tarifa del 5%</span>
                <span className="font-mono">{formatCOP(data.comprasGravadas5)}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span>48. De servicios gravados a la tarifa general (19%)</span>
                <span className="font-mono">{formatCOP(data.comprasServicios19)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-slate-100 font-bold text-slate-900">
                <span>54. TOTAL COMPRAS BRUTAS DEL PERÍODO</span>
                <span className="font-mono">{formatCOP(data.totalComprasBrutas)}</span>
              </div>
            </div>
          </div>

          {/* IMPUESTO GENERADO VS DESCONTABLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Generado */}
            <div>
              <div className="bg-teal-900 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
                <span>Impuesto Generado</span>
                <span className="text-teal-300 font-mono text-[11px]">Renglón 57 a 65</span>
              </div>
              <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
                <div className="flex justify-between px-3 py-2">
                  <span>57. A la tarifa general (19%)</span>
                  <span className="font-mono font-semibold text-teal-900">{formatCOP(data.ivaGenerado19)}</span>
                </div>
                <div className="flex justify-between px-3 py-2">
                  <span>58. A la tarifa del 5%</span>
                  <span className="font-mono">{formatCOP(data.ivaGenerado5)}</span>
                </div>
                <div className="flex justify-between px-3 py-2 bg-teal-50 font-bold text-teal-950">
                  <span>65. TOTAL IMPUESTO GENERADO</span>
                  <span className="font-mono">{formatCOP(data.totalIvaGenerado)}</span>
                </div>
              </div>
            </div>

            {/* Descontable */}
            <div>
              <div className="bg-slate-700 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
                <span>Impuesto Descontable</span>
                <span className="text-emerald-300 font-mono text-[11px]">Renglón 66 a 76</span>
              </div>
              <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
                <div className="flex justify-between px-3 py-2">
                  <span>66. Por compras de bienes (19%)</span>
                  <span className="font-mono text-emerald-800">{formatCOP(data.ivaDescontableCompras19)}</span>
                </div>
                <div className="flex justify-between px-3 py-2">
                  <span>70. Por servicios gravados (19%)</span>
                  <span className="font-mono text-emerald-800">{formatCOP(data.ivaDescontableServicios19)}</span>
                </div>
                <div className="flex justify-between px-3 py-2 bg-emerald-50 font-bold text-emerald-950">
                  <span>76. TOTAL IMPUESTO DESCONTABLE</span>
                  <span className="font-mono">{formatCOP(data.totalIvaDescontable)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CONTROL DE SALDOS */}
          <div>
            <div className="bg-teal-950 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs uppercase flex justify-between">
              <span>Liquidación Privada y Control de Saldos</span>
              <span className="text-teal-300 font-mono text-[11px]">Renglones 77 a 83</span>
            </div>
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs">
              <div className="flex justify-between px-3 py-2 bg-slate-50 font-semibold">
                <span>77. Saldo a pagar por el período fiscal (65 - 76)</span>
                <span className="font-mono">{formatCOP(data.saldoIvaPeriodo)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 text-indigo-700">
                <span>78. Menos: Retenciones de IVA practicadas que le hicieron (ReteIVA 15%)</span>
                <span className="font-mono">- {formatCOP(data.retencionIvaPracticadaQueLeHicieron)}</span>
              </div>

              <div className="p-3 bg-teal-50 flex items-center justify-between font-bold text-sm text-teal-950 border-t-2 border-teal-600">
                <span>82. TOTAL SALDO A PAGAR POR EL PERÍODO FISCAL</span>
                <span className="font-mono text-base font-black text-teal-900">
                  {formatCOP(data.saldoAPagar)}
                </span>
              </div>

              {data.saldoAFavor > 0 && (
                <div className="p-3 bg-blue-50 flex items-center justify-between font-bold text-sm text-blue-950 border-t border-blue-300">
                  <span>83. TOTAL SALDO A FAVOR POR EL PERÍODO FISCAL</span>
                  <span className="font-mono text-base font-black text-blue-900">
                    {formatCOP(data.saldoAFavor)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-4 text-xs text-slate-600 flex items-start space-x-3">
          <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Directriz Didáctica SENA:</strong>
            <p className="mt-0.5">
              Recuerda a los aprendices que para que el IVA pagado sea descontable, debe estar respaldado en factura electrónica de venta debidamente validada por la DIAN y tener relación de causalidad directa con las actividades gravadas con IVA (Art. 488 E.T.).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
