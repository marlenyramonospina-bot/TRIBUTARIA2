import React from 'react';
import { CompanyPreset } from '../data/defaultData';
import { TrialBalanceResult, formatCOP } from '../services/taxEngine';
import {
  Form110State,
  Form210State,
  Form300State,
  Form350State,
  Form310State,
  Form420State
} from '../types/tax';
import { Printer, X } from 'lucide-react';

interface PrintableSummaryProps {
  preset: CompanyPreset;
  trialBalance: TrialBalanceResult;
  form110: Form110State;
  form210: Form210State;
  form300: Form300State;
  form350: Form350State;
  form310: Form310State;
  form420: Form420State;
  onClose: () => void;
}

export const PrintableSummary: React.FC<PrintableSummaryProps> = ({
  preset,
  trialBalance,
  form110,
  form210,
  form300,
  form350,
  form310,
  form420,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[92vh] overflow-y-auto text-slate-800 print:max-h-none print:shadow-none print:m-0 print:p-4">
        {/* Actions bar (hidden in print) */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
            Vista Previa de Informe y Hoja de Liquidación Tributaria SENA
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Official Document Body */}
        <div className="pt-6 space-y-6">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="text-xs font-bold uppercase text-emerald-800">
                SERVICIO NACIONAL DE APRENDIZAJE - SENA
              </div>
              <h2 className="text-xl font-black text-slate-900">
                HOJA DE TRABAJO Y CONCILIACIÓN TRIBUTARIA
              </h2>
              <p className="text-xs text-slate-600">
                Programa: Tecnología en Gestión Contable y de Información Financiera
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="font-mono font-bold block text-sm">Año Gravable: {preset.params.taxYear}</span>
              <span className="text-slate-500">UVT: {formatCOP(preset.params.uvtValue)}</span>
            </div>
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block">Razón Social / Contribuyente:</span>
              <strong className="text-slate-900 text-sm">{preset.name}</strong>
              <span className="text-slate-500 block mt-1">NIT: {preset.nit}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Régimen y Actividad:</span>
              <strong className="text-slate-800">{preset.regime}</strong>
              <span className="text-slate-500 block mt-1">CIIU: {preset.ciiuCode}</span>
            </div>
          </div>

          {/* Summary Matrix of Tax Declarations */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Resumen de Declaraciones Tributarias Liquidadas:
            </h3>
            <table className="w-full text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-2 border border-slate-300 text-left">Formulario DIAN</th>
                  <th className="p-2 border border-slate-300 text-left">Impuesto / Concepto</th>
                  <th className="p-2 border border-slate-300 text-right">Base / Renta Líquida</th>
                  <th className="p-2 border border-slate-300 text-right">Saldo a Pagar</th>
                  <th className="p-2 border border-slate-300 text-right">Saldo a Favor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {preset.type === 'PERSONA_JURIDICA' ? (
                  <>
                    <tr>
                      <td className="p-2 border border-slate-300 font-bold">Formulario 110</td>
                      <td className="p-2 border border-slate-300 font-sans">Renta Personas Jurídicas</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCOP(form110.rentaLiquidaGravable)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold text-emerald-800">{formatCOP(form110.saldoAPagar)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCOP(form110.saldoAFavor)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300 font-bold">Formulario 300</td>
                      <td className="p-2 border border-slate-300 font-sans">Impuesto sobre las Ventas (IVA)</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCOP(form300.totalIngresosNetos)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold text-emerald-800">{formatCOP(form300.saldoAPagar)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCOP(form300.saldoAFavor)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300 font-bold">Formulario 350</td>
                      <td className="p-2 border border-slate-300 font-sans">Retención en la Fuente Mensual</td>
                      <td className="p-2 border border-slate-300 text-right">Múltiples bases</td>
                      <td className="p-2 border border-slate-300 text-right font-bold text-emerald-800">{formatCOP(form350.totalPagar)}</td>
                      <td className="p-2 border border-slate-300 text-right">$0</td>
                    </tr>
                    {form310.totalPagarINC > 0 && (
                      <tr>
                        <td className="p-2 border border-slate-300 font-bold">Formulario 310</td>
                        <td className="p-2 border border-slate-300 font-sans">Impuesto Nacional al Consumo (INC)</td>
                        <td className="p-2 border border-slate-300 text-right">{formatCOP(form310.baseServiciosComidasYBebidas8)}</td>
                        <td className="p-2 border border-slate-300 text-right font-bold text-emerald-800">{formatCOP(form310.totalPagarINC)}</td>
                        <td className="p-2 border border-slate-300 text-right">$0</td>
                      </tr>
                    )}
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="p-2 border border-slate-300 font-bold">Formulario 210</td>
                      <td className="p-2 border border-slate-300 font-sans">Renta Personas Naturales Cedular</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCOP(form210.rentaLiquidaGravableGeneral)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold text-emerald-800">{formatCOP(form210.saldoAPagar)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCOP(form210.saldoAFavor)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300 font-bold">Formulario 420</td>
                      <td className="p-2 border border-slate-300 font-sans">Impuesto al Patrimonio (Ley 2277)</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCOP(form420.patrimonioLiquido)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold text-emerald-800">{formatCOP(form420.totalPagarPatrimonio)}</td>
                      <td className="p-2 border border-slate-300 text-right">$0</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Trial Balance Audit Proof */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-800 mb-1">
              Verificación de Partida Doble (Auditoría Contable):
            </h4>
            <div className="flex justify-between font-mono">
              <span>Total Débitos del Ejercicio: <strong>{formatCOP(trialBalance.totalDebits)}</strong></span>
              <span>Total Créditos del Ejercicio: <strong>{formatCOP(trialBalance.totalCredits)}</strong></span>
              <span className="text-emerald-700 font-bold">
                {trialBalance.isBalanced ? '✓ Sumas Iguales Verificadas' : 'Descuadre'}
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-12 text-xs">
            <div className="border-t border-slate-400 pt-2 text-center">
              <strong className="block text-slate-900">Firma del Aprendiz SENA</strong>
              <span className="text-slate-500">C.C. / T.I. N° __________________________</span>
            </div>
            <div className="border-t border-slate-400 pt-2 text-center">
              <strong className="block text-slate-900">Firma del Instructor / Revisor Fiscal</strong>
              <span className="text-slate-500">T.P. Contador Público N° ________________</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
