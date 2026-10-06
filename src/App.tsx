/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { COMPANY_PRESETS, CompanyPreset } from './data/defaultData';
import {
  calculateTrialBalance,
  generateForm110,
  generateForm210,
  generateForm300,
  generateForm350,
  generateForm310,
  generateForm420
} from './services/taxEngine';
import { Header } from './components/Header';
import { AccountingLedger } from './components/AccountingLedger';
import { Form110View } from './components/Form110View';
import { Form210View } from './components/Form210View';
import { Form300View } from './components/Form300View';
import { Form350View } from './components/Form350View';
import { Form310View } from './components/Form310View';
import { Form420View } from './components/Form420View';
import { SenaTutorPanel } from './components/SenaTutorPanel';
import { TaxWorkshop } from './components/TaxWorkshop';
import { PucMapperModal } from './components/PucMapperModal';
import { PrintableSummary } from './components/PrintableSummary';
import { JournalTransaction } from './types/tax';

export default function App() {
  const [presets, setPresets] = useState<CompanyPreset[]>(COMPANY_PRESETS);
  const [currentPresetId, setCurrentPresetId] = useState<string>('andina_sas');
  const [activeTab, setActiveTab] = useState<'ledger' | 'forms' | 'workshop' | 'tutor'>('ledger');
  const [selectedFormTab, setSelectedFormTab] = useState<'110' | '210' | '300' | '350' | '310' | '420'>('110');
  const [showPucModal, setShowPucModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Active preset
  const currentPreset = useMemo(() => {
    return presets.find((p) => p.id === currentPresetId) || presets[0];
  }, [presets, currentPresetId]);

  // When changing preset, auto-tune selected form
  const handleSelectPreset = (presetId: string) => {
    setCurrentPresetId(presetId);
    const chosen = presets.find((p) => p.id === presetId);
    if (chosen) {
      if (chosen.type === 'PERSONA_NATURAL') {
        setSelectedFormTab('210');
      } else if (chosen.id === 'restaurante_caribe') {
        setSelectedFormTab('310');
      } else {
        setSelectedFormTab('110');
      }
    }
  };

  // Add transaction to current preset
  const handleAddTransaction = (newTx: JournalTransaction) => {
    setPresets((prev) =>
      prev.map((p) => {
        if (p.id === currentPreset.id) {
          return {
            ...p,
            transactions: [newTx, ...p.transactions]
          };
        }
        return p;
      })
    );
  };

  // Real-time calculations from ledger & PUC balances
  const trialBalance = useMemo(() => {
    return calculateTrialBalance(currentPreset.transactions, currentPreset.initialBalances);
  }, [currentPreset]);

  const form110 = useMemo(() => {
    return generateForm110(trialBalance, currentPreset.name, currentPreset.nit, currentPreset.params);
  }, [trialBalance, currentPreset]);

  const form210 = useMemo(() => {
    return generateForm210(trialBalance, currentPreset.name, currentPreset.nit, currentPreset.params);
  }, [trialBalance, currentPreset]);

  const form300 = useMemo(() => {
    return generateForm300(trialBalance, currentPreset.name, currentPreset.nit, currentPreset.params);
  }, [trialBalance, currentPreset]);

  const form350 = useMemo(() => {
    return generateForm350(trialBalance, currentPreset.name, currentPreset.nit, currentPreset.params);
  }, [trialBalance, currentPreset]);

  const form310 = useMemo(() => {
    return generateForm310(trialBalance, currentPreset.name, currentPreset.nit, currentPreset.params);
  }, [trialBalance, currentPreset]);

  const form420 = useMemo(() => {
    return generateForm420(trialBalance, currentPreset.name, currentPreset.nit, currentPreset.params);
  }, [trialBalance, currentPreset]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header with SENA branding, presets, UVT and mode switches */}
      <Header
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        presets={presets}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedFormTab={selectedFormTab}
        setSelectedFormTab={setSelectedFormTab}
        onOpenPucModal={() => setShowPucModal(true)}
        onPrint={() => setShowPrintModal(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* TAB 1: ACCOUNTING LEDGER & TRIAL BALANCE */}
        {activeTab === 'ledger' && (
          <AccountingLedger
            transactions={currentPreset.transactions}
            trialBalance={trialBalance}
            onAddTransaction={handleAddTransaction}
            onNavigateToForms={() => setActiveTab('forms')}
            companyName={currentPreset.name}
            regime={currentPreset.regime}
          />
        )}

        {/* TAB 2: OFFICIAL DIAN TAX FORMS */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            {/* Quick Context Banner */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500">Liquidando con base en los movimientos de: </span>
                <strong className="text-slate-800 font-bold">{currentPreset.name}</strong>
                <span className="text-slate-500"> (NIT: {currentPreset.nit})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                  {currentPreset.type === 'PERSONA_JURIDICA' ? 'Persona Jurídica' : 'Persona Natural'}
                </span>
                <button
                  onClick={() => setActiveTab('ledger')}
                  className="text-emerald-700 hover:text-emerald-800 underline font-semibold"
                >
                  Modificar Asientos Contables
                </button>
              </div>
            </div>

            {/* Selected Form Render */}
            {selectedFormTab === '110' && <Form110View data={form110} />}
            {selectedFormTab === '210' && <Form210View data={form210} uvtValue={currentPreset.params.uvtValue} />}
            {selectedFormTab === '300' && <Form300View data={form300} />}
            {selectedFormTab === '350' && <Form350View data={form350} />}
            {selectedFormTab === '310' && <Form310View data={form310} />}
            {selectedFormTab === '420' && <Form420View data={form420} />}
          </div>
        )}

        {/* TAB 3: EVALUATIVE WORKSHOP */}
        {activeTab === 'workshop' && <TaxWorkshop />}

        {/* TAB 4: SENA TUTOR & STATUTE GUIDE */}
        {activeTab === 'tutor' && (
          <SenaTutorPanel
            uvtValue={currentPreset.params.uvtValue}
            taxYear={currentPreset.params.taxYear}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 px-6 text-xs text-center">
        <p>
          Simulador Tributario SENA • Dirección de Formación Profesional Integral • Normativa DIAN y Estatuto Tributario Nacional
        </p>
      </footer>

      {/* Modals */}
      <PucMapperModal isOpen={showPucModal} onClose={() => setShowPucModal(false)} />

      {showPrintModal && (
        <PrintableSummary
          preset={currentPreset}
          trialBalance={trialBalance}
          form110={form110}
          form210={form210}
          form300={form300}
          form350={form350}
          form310={form310}
          form420={form420}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
