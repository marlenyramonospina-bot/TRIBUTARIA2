import React from 'react';
import {
  FileText,
  Calculator,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Printer
} from 'lucide-react';
import { CompanyPreset } from '../data/defaultData';
import { formatCOP } from '../services/taxEngine';

interface HeaderProps {
  currentPreset: CompanyPreset;
  onSelectPreset: (presetId: string) => void;
  presets: CompanyPreset[];
  activeTab: 'ledger' | 'forms' | 'workshop' | 'tutor';
  setActiveTab: (tab: 'ledger' | 'forms' | 'workshop' | 'tutor') => void;
  selectedFormTab: '110' | '210' | '300' | '350' | '310' | '420';
  setSelectedFormTab: (form: '110' | '210' | '300' | '350' | '310' | '420') => void;
  onOpenPucModal: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPreset,
  onSelectPreset,
  presets,
  activeTab,
  setActiveTab,
  selectedFormTab,
  setSelectedFormTab,
  onOpenPucModal,
  onPrint
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white shadow-xl sticky top-0 z-40">
      {/* Top Bar: SENA & DIAN Institution Identity */}
      <div className="bg-emerald-800 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between font-medium">
        <div className="flex items-center space-x-3">
          <span className="bg-emerald-950 px-2 py-0.5 rounded font-bold tracking-wide uppercase text-[11px] text-emerald-300">
            SENA Centro de Servicios Financieros
          </span>
          <span>Tecnología en Gestión Contable y de Información Financiera</span>
          <span className="hidden md:inline text-emerald-300">•</span>
          <span className="hidden md:inline text-emerald-200">
            Competencia: Elaborar declaraciones tributarias según normativa DIAN vigente
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-slate-900/60 text-emerald-200 px-2.5 py-0.5 rounded font-mono text-xs">
            UVT {currentPreset.params.taxYear}: {formatCOP(currentPreset.params.uvtValue)}
          </span>
          <span className="text-emerald-300 hidden sm:inline">Tarifa Renta PJ: 35%</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md font-black text-xl tracking-tighter">
              DIAN
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  TribusSENA <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700">v2.5 Fiscal</span>
                </h1>
                <span className="text-xs text-slate-400 hidden sm:inline">|</span>
                <span className="text-xs text-slate-300 hidden sm:inline">Simulador Tributario Integral de Colombia</span>
              </div>
              <p className="text-xs text-slate-400">
                Puente automático: Movimientos Contables PUC → Formularios Oficiales DIAN
              </p>
            </div>
          </div>

          {/* Preset Selector & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <Building2 className="w-4 h-4 text-emerald-400 ml-2 mr-1" />
              <select
                aria-label="Seleccionar empresa o contribuyente"
                value={currentPreset.id}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-medium px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500 rounded"
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-800 text-white">
                    {p.name} ({p.type === 'PERSONA_JURIDICA' ? 'PJ' : 'PN'})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onOpenPucModal}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Ver Mapeo de cuentas PUC a Renglones DIAN"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Diccionario PUC ↔ DIAN</span>
            </button>

            <button
              onClick={onPrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              title="Imprimir resumen y liquidación borrador"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'ledger'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Movimientos Contables & Balance</span>
            </button>

            <button
              onClick={() => setActiveTab('forms')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'forms'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Formularios Oficiales DIAN</span>
            </button>

            <button
              onClick={() => setActiveTab('workshop')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'workshop'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>3. Taller Evaluativo SENA</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'tutor'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>4. Guía Pedagógica & Estatuto</span>
            </button>
          </div>

          {/* Sub-tabs when Forms is active */}
          {activeTab === 'forms' && (
            <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 px-1.5 font-medium hidden sm:inline">Formulario:</span>
              <button
                onClick={() => setSelectedFormTab('110')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  selectedFormTab === '110'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                110 (Renta PJ)
              </button>
              <button
                onClick={() => setSelectedFormTab('210')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  selectedFormTab === '210'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                210 (Renta PN)
              </button>
              <button
                onClick={() => setSelectedFormTab('300')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  selectedFormTab === '300'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                300 (IVA)
              </button>
              <button
                onClick={() => setSelectedFormTab('350')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  selectedFormTab === '350'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                350 (Retefuente)
              </button>
              <button
                onClick={() => setSelectedFormTab('310')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  selectedFormTab === '310'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                310 (INC)
              </button>
              <button
                onClick={() => setSelectedFormTab('420')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  selectedFormTab === '420'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                420 (Patrimonio)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
