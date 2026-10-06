import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  Scale,
  CheckCircle,
  FileText,
  Calculator,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { formatCOP } from '../services/taxEngine';

interface SenaTutorPanelProps {
  uvtValue: number;
  taxYear: number;
}

export const SenaTutorPanel: React.FC<SenaTutorPanelProps> = ({ uvtValue, taxYear }) => {
  // Mini sanction calculator
  const [taxOwed, setTaxOwed] = useState<number>(5000000);
  const [monthsLate, setMonthsLate] = useState<number>(2);

  const rawExtemp = Math.round(taxOwed * 0.05 * monthsLate);
  const minSanction = 10 * uvtValue; // 10 UVT Art. 639
  const finalSanction = Math.max(rawExtemp, minSanction);

  return (
    <div className="space-y-6">
      {/* Tutor Intro Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-700/80 rounded-xl">
            <Scale className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              Guía Metodológica & Normativa Tributaria SENA
            </h2>
            <p className="text-xs text-emerald-200 mt-1">
              Competencia Técnica: Liquidación y auditoría de declaraciones tributarias conforme al Estatuto Tributario Nacional y Decretos Reglamentarios vigentes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Calendario Tributario & Vencimientos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Calendario Tributario y Periodicidad de los Formularios</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">Formulario 110 (Renta PJ)</strong>
                  <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    ANUAL
                  </span>
                </div>
                <p className="text-slate-600">
                  Vence en <strong>abril o mayo</strong> según los dos últimos dígitos del NIT. Grandes contribuyentes pagan en 3 cuotas; personas jurídicas ordinarias en 2 cuotas.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">Formulario 210 (Renta PN)</strong>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    ANUAL
                  </span>
                </div>
                <p className="text-slate-600">
                  Vence entre <strong>agosto y octubre</strong> según los dos últimos dígitos del NIT del contribuyente. Pago en una sola cuota con presentación.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">Formulario 300 (IVA)</strong>
                  <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    BIMESTRAL / CUATRIMESTRAL
                  </span>
                </div>
                <p className="text-slate-600">
                  Bimestral para ingresos brutos &gt; 92.000 UVT (vence en mar, may, jul, sep, nov, ene). Cuatrimestral para ingresos &lt; 92.000 UVT (vence en may, sep, ene).
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">Formulario 350 (Retefuente)</strong>
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    MENSUAL OBLIGATORIO
                  </span>
                </div>
                <p className="text-slate-600">
                  Vence los primeros días del mes siguiente. <em>Ojo:</em> Debe presentarse con pago total para evitar ineficacia jurídica (Art. 580-1 E.T.).
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">Formulario 310 (INC)</strong>
                  <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    BIMESTRAL
                  </span>
                </div>
                <p className="text-slate-600">
                  Periodicidad bimestral para servicios de restaurantes, telefonía y vehículos gravados con el Impuesto Nacional al Consumo.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">Formulario 420 (Patrimonio)</strong>
                  <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    ANUAL (2 CUOTAS)
                  </span>
                </div>
                <p className="text-slate-600">
                  Vence en <strong>mayo (cuota 1) y septiembre (cuota 2)</strong>. Exclusivo para personas naturales con patrimonio líquido superior a 72.000 UVT al 1 de enero.
                </p>
              </div>
            </div>
          </div>

          {/* Soportes Electrónicos Obligatorios */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Soportes Fiscales Obligatorios en Colombia (Art. 771-2 y 616-1 E.T.)</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold">Factura Electrónica de Venta (FEV):</strong>
                  <p className="text-slate-600 mt-0.5">
                    Único documento válido para sustentar compras con IVA descontable y costos deducibles en renta. Debe incluir validación previa DIAN (CUFE).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold">Documento Soporte en Adquisiciones a No Obligados:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Exigido para compras o servicios contratados con personas naturales que no expiden factura electrónica. Se transmite electrónicamente a la DIAN con código CUDS.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold">Nómina Electrónica:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Indispensable para que los pagos laborales (sueldos, cesantías, primas, seguridad social) sean deducibles en el Formulario 110 (Renglón 60).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold">Bancarización (Art. 771-5 E.T.):</strong>
                  <p className="text-slate-600 mt-0.5">
                    Los pagos individuales en efectivo superiores a 100 UVT no son reconocidos fiscalmente. Todos los costos y deducciones relevantes deben canalizarse a través de medios bancarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sanciones & Simulador de Sanción Mínima */}
        <div className="space-y-6">
          {/* Régimen Sancionatorio */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex items-center space-x-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-800">
                Régimen Sancionatorio Clave
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-200 space-y-1">
                <strong className="text-rose-900 block font-bold">
                  Sanción Mínima Legal (Art. 639 E.T.)
                </strong>
                <p>
                  Ninguna sanción tributaria en Colombia puede ser inferior a <strong>10 UVT</strong>.
                </p>
                <div className="bg-white px-2 py-1 rounded border border-rose-300 font-mono font-bold text-rose-800 text-center text-xs">
                  Sanción Mínima {taxYear}: {formatCOP(minSanction)}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-bold">
                  Extemporaneidad (Art. 641 E.T.)
                </strong>
                <p>
                  5% por cada mes o fracción de mes de retraso sobre el impuesto a cargo, sin que exceda del 100% del impuesto.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-bold">
                  Corrección (Art. 644 E.T.)
                </strong>
                <p>
                  10% sobre el mayor valor a pagar o menor saldo a favor cuando se corrige voluntariamente antes del emplazamiento para corregir.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Sanction Calculator */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              <span>Simulador de Sanción por Extemporaneidad</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Impuesto a cargo ($):</label>
                <input
                  type="number"
                  value={taxOwed}
                  onChange={(e) => setTaxOwed(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Meses o fracción de retraso:</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={monthsLate}
                  onChange={(e) => setMonthsLate(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Cálculo directo (5% x {monthsLate} meses):</span>
                  <span className="font-mono">{formatCOP(rawExtemp)}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Sanción Mínima legal (10 UVT):</span>
                  <span className="font-mono">{formatCOP(minSanction)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 text-sm pt-1 border-t border-slate-800">
                  <span>Sanción final a liquidar:</span>
                  <span className="font-mono">{formatCOP(finalSanction)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
