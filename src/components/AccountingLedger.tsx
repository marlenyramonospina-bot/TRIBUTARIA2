import React, { useState } from 'react';
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Search,
  ArrowRight,
  Info,
  Calendar,
  CreditCard,
  Hash
} from 'lucide-react';
import { JournalTransaction, AccountEntry } from '../types/tax';
import { TrialBalanceResult, formatCOP } from '../services/taxEngine';
import { PUC_CATALOG } from '../data/pucCatalog';

interface AccountingLedgerProps {
  transactions: JournalTransaction[];
  trialBalance: TrialBalanceResult;
  onAddTransaction: (tx: JournalTransaction) => void;
  onNavigateToForms: () => void;
  companyName: string;
  regime: string;
}

export const AccountingLedger: React.FC<AccountingLedgerProps> = ({
  transactions,
  trialBalance,
  onAddTransaction,
  onNavigateToForms,
  companyName,
  regime
}) => {
  const [viewMode, setViewMode] = useState<'journal' | 'balance'>('journal');
  const [filterQuery, setFilterQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Transaction Form State
  const [newConcept, setNewConcept] = useState('');
  const [newDoc, setNewDoc] = useState('');
  const [newThirdParty, setNewThirdParty] = useState('');
  const [newNit, setNewNit] = useState('');
  const [newEntries, setNewEntries] = useState<AccountEntry[]>([
    { code: '4135', name: 'Comercio al por mayor y menor', debit: 0, credit: 10000000 },
    { code: '2408', name: 'IVA Generado 19%', debit: 0, credit: 1900000 },
    { code: '135515', name: 'Anticipo Retefuente 2.5%', debit: 250000, credit: 0 },
    { code: '1110', name: 'Bancos Nacionales', debit: 11650000, credit: 0 }
  ]);

  const handleEntryChange = (index: number, field: keyof AccountEntry, value: any) => {
    const updated = [...newEntries];
    if (field === 'code') {
      const match = PUC_CATALOG.find((p) => p.code === value);
      updated[index] = {
        ...updated[index],
        code: value,
        name: match ? match.name : updated[index].name
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
    }
    setNewEntries(updated);
  };

  const addEntryRow = () => {
    setNewEntries([
      ...newEntries,
      { code: '1105', name: 'Caja General', debit: 0, credit: 0 }
    ]);
  };

  const removeEntryRow = (index: number) => {
    if (newEntries.length <= 2) return;
    setNewEntries(newEntries.filter((_, i) => i !== index));
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const sumDebits = newEntries.reduce((s, e) => s + (Number(e.debit) || 0), 0);
    const sumCredits = newEntries.reduce((s, e) => s + (Number(e.credit) || 0), 0);

    if (Math.abs(sumDebits - sumCredits) > 1) {
      alert(`Partida doble desbalanceada: Débitos ($${sumDebits}) ≠ Créditos ($${sumCredits}). Por favor corrige antes de registrar.`);
      return;
    }

    const tx: JournalTransaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      docNumber: newDoc || 'ASIENTO-01',
      concept: newConcept || 'Movimiento contable registrado por aprendiz',
      thirdParty: newThirdParty || 'Tercero General SAS',
      nit: newNit || '900.000.000-1',
      entries: newEntries.map((entry) => ({
        ...entry,
        debit: Number(entry.debit) || 0,
        credit: Number(entry.credit) || 0
      }))
    };

    onAddTransaction(tx);
    setShowAddModal(false);
    setNewConcept('');
    setNewDoc('');
    setNewThirdParty('');
  };

  const filteredBalances = trialBalance.balances.filter((b) =>
    b.code.toLowerCase().includes(filterQuery.toLowerCase()) ||
    b.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredTransactions = transactions.filter((t) =>
    t.concept.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.docNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.thirdParty.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.entries.some((e) => e.code.includes(filterQuery))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification & Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-800">
              Movimientos Contables de la Empresa
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-300 font-mono">
              {regime}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Empresa activa: <strong className="text-slate-700">{companyName}</strong>. Todos los formularios de la DIAN se liquidan en tiempo real a partir de estos registros.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Balanced Status Badge */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              trialBalance.isBalanced
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            {trialBalance.isBalanced ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sumas Iguales Cuadradas (Débitos = Créditos)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Descuadre contable: {formatCOP(trialBalance.difference)}</span>
              </>
            )}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Asiento Contable</span>
          </button>

          <button
            onClick={onNavigateToForms}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition shadow-sm"
          >
            <span>Liquidar en DIAN</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Control Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-xs w-full sm:w-auto">
          <button
            onClick={() => setViewMode('journal')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-semibold transition ${
              viewMode === 'journal'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Libro Diario (Comprobantes {transactions.length})
          </button>
          <button
            onClick={() => setViewMode('balance')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-semibold transition ${
              viewMode === 'balance'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Balance de Comprobación (PUC {trialBalance.balances.length} Cuentas)
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cuenta PUC, tercero, factura..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* VIEW 1: JOURNAL TRANSACTIONS */}
      {viewMode === 'journal' && (
        <div className="space-y-4">
          {filteredTransactions.map((tx) => {
            const txDebits = tx.entries.reduce((s, e) => s + e.debit, 0);
            const txCredits = tx.entries.reduce((s, e) => s + e.credit, 0);
            return (
              <div
                key={tx.id}
                className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden hover:border-slate-300 transition"
              >
                {/* Transaction Header */}
                <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded font-mono">
                      {tx.docNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {tx.date}
                    </span>
                    <span className="font-semibold text-slate-800 text-sm">{tx.concept}</span>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="font-medium text-slate-500">Tercero:</span>
                    <strong className="text-slate-800">{tx.thirdParty}</strong>
                    <span className="text-slate-400 font-mono text-[11px]">(NIT: {tx.nit})</span>
                  </div>
                </div>

                {/* Entries Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[11px]">
                      <tr>
                        <th className="py-2 px-4 w-28">Código PUC</th>
                        <th className="py-2 px-4">Denominación de la Cuenta</th>
                        <th className="py-2 px-4">Detalle / Concepto Tributario</th>
                        <th className="py-2 px-4 text-right w-36">Débito ($)</th>
                        <th className="py-2 px-4 text-right w-36">Crédito ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      {tx.entries.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2 px-4 font-bold text-slate-800">{entry.code}</td>
                          <td className="py-2 px-4 font-sans font-medium text-slate-800">
                            {entry.name}
                          </td>
                          <td className="py-2 px-4 font-sans text-slate-500 text-[11px]">
                            {entry.description || '-'}
                          </td>
                          <td className="py-2 px-4 text-right text-emerald-700 font-semibold">
                            {entry.debit > 0 ? formatCOP(entry.debit) : '-'}
                          </td>
                          <td className="py-2 px-4 text-right text-indigo-700 font-semibold">
                            {entry.credit > 0 ? formatCOP(entry.credit) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200 text-slate-800 font-semibold text-xs">
                      <tr>
                        <td colSpan={3} className="py-2 px-4 text-right uppercase text-[11px] text-slate-500">
                          Sumas Iguales del Asiento:
                        </td>
                        <td className="py-2 px-4 text-right text-emerald-800 font-mono">
                          {formatCOP(txDebits)}
                        </td>
                        <td className="py-2 px-4 text-right text-indigo-800 font-mono">
                          {formatCOP(txCredits)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: TRIAL BALANCE */}
      {viewMode === 'balance' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Balance de Comprobación Consolidado (Libro Mayor)
              </h3>
              <p className="text-xs text-slate-500">
                Suma acumulada de saldos iniciales más movimientos débitos y créditos del período fiscal.
              </p>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Total cuentas con saldo: <strong>{filteredBalances.length}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 w-28">Código</th>
                  <th className="py-2.5 px-4">Nombre de la Cuenta</th>
                  <th className="py-2.5 px-4 text-center w-24">Naturaleza</th>
                  <th className="py-2.5 px-4 text-right w-36">Saldo Inicial</th>
                  <th className="py-2.5 px-4 text-right w-36">Débitos</th>
                  <th className="py-2.5 px-4 text-right w-36">Créditos</th>
                  <th className="py-2.5 px-4 text-right w-40">Saldo Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {filteredBalances.map((acc) => (
                  <tr key={acc.code} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{acc.code}</td>
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-800">{acc.name}</td>
                    <td className="py-2.5 px-4 text-center font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          acc.nature === 'DEBITO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {acc.nature}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-600">
                      {formatCOP(acc.initialBalance)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-emerald-700 font-medium">
                      {acc.debitTotal > 0 ? formatCOP(acc.debitTotal) : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right text-indigo-700 font-medium">
                      {acc.creditTotal > 0 ? formatCOP(acc.creditTotal) : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {formatCOP(acc.finalBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-xs text-slate-900">
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-right uppercase text-slate-600 font-sans">
                    Totales Verificados de Movimientos:
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-800 font-mono">
                    {formatCOP(trialBalance.totalDebits)}
                  </td>
                  <td className="py-3 px-4 text-right text-indigo-800 font-mono">
                    {formatCOP(trialBalance.totalCredits)}
                  </td>
                  <td className="py-3 px-4 text-right font-sans text-xs">
                    {trialBalance.isBalanced ? (
                      <span className="text-emerald-700">✓ CUADRADO</span>
                    ) : (
                      <span className="text-rose-700">DESCUADRE</span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add New Journal Entry */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Registrar Nuevo Movimiento Contable (Aprendiz SENA)
                </h3>
                <p className="text-xs text-slate-500">
                  Aplica la regla de partida doble. Al guardar, se recalcularán automáticamente los formularios de la DIAN.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Documento Soporte (FEV, DS, ND)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. FEV-1005 o DS-004"
                    value={newDoc}
                    onChange={(e) => setNewDoc(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tercero / Razón Social
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Soluciones Logísticas SAS"
                    value={newThirdParty}
                    onChange={(e) => setNewThirdParty(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIT / Cédula Tercero
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 901.223.334-5"
                    value={newNit}
                    onChange={(e) => setNewNit(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Concepto de la Operación Contable
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Compra de suministros gravados al 19% con retención en la fuente 2.5%"
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Entries list */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Líneas de Asiento (Cuentas PUC):
                  </span>
                  <button
                    type="button"
                    onClick={addEntryRow}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Agregar fila
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold text-[11px]">
                      <tr>
                        <th className="p-2 w-32">Código PUC</th>
                        <th className="p-2">Nombre Cuenta</th>
                        <th className="p-2 w-32 text-right">Débito ($)</th>
                        <th className="p-2 w-32 text-right">Crédito ($)</th>
                        <th className="p-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {newEntries.map((row, idx) => (
                        <tr key={idx} className="p-1">
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.code}
                              onChange={(e) => handleEntryChange(idx, 'code', e.target.value)}
                              placeholder="Ej 4135"
                              className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-xs"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => handleEntryChange(idx, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="number"
                              min="0"
                              value={row.debit || ''}
                              onChange={(e) =>
                                handleEntryChange(idx, 'debit', parseFloat(e.target.value) || 0)
                              }
                              placeholder="0"
                              className="w-full px-2 py-1 border border-slate-300 rounded text-right font-mono text-xs"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="number"
                              min="0"
                              value={row.credit || ''}
                              onChange={(e) =>
                                handleEntryChange(idx, 'credit', parseFloat(e.target.value) || 0)
                              }
                              placeholder="0"
                              className="w-full px-2 py-1 border border-slate-300 rounded text-right font-mono text-xs"
                            />
                          </td>
                          <td className="p-1.5 text-center">
                            {newEntries.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeEntryRow(idx)}
                                className="text-rose-500 hover:text-rose-700 font-bold"
                              >
                                ✕
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Live balance check for the new entry */}
                {(() => {
                  const d = newEntries.reduce((s, e) => s + (Number(e.debit) || 0), 0);
                  const c = newEntries.reduce((s, e) => s + (Number(e.credit) || 0), 0);
                  const balanced = Math.abs(d - c) <= 1;
                  return (
                    <div className="flex items-center justify-between text-xs px-2 pt-1 font-mono font-medium">
                      <span>Total Débitos: {formatCOP(d)}</span>
                      <span>Total Créditos: {formatCOP(c)}</span>
                      <span className={balanced ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {balanced ? '✓ Balanceado' : `Diferencia: ${formatCOP(Math.abs(d - c))}`}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Guardar y Recalcular DIAN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
