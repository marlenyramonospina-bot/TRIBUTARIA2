import React, { useState } from 'react';
import { WORKSHOP_QUESTIONS } from '../data/defaultData';
import { WorkshopQuestion } from '../types/tax';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const TaxWorkshop: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  const handleSelect = (questionId: string, optionId: string) => {
    if (submittedQuestions[questionId]) return; // lock once checked
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId
    });
  };

  const handleVerify = (questionId: string) => {
    if (!selectedAnswers[questionId]) return;
    setSubmittedQuestions({
      ...submittedQuestions,
      [questionId]: true
    });
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmittedQuestions({});
  };

  const totalQuestions = WORKSHOP_QUESTIONS.length;
  const verifiedCount = Object.keys(submittedQuestions).length;
  const correctCount = WORKSHOP_QUESTIONS.filter((q) => {
    const selected = selectedAnswers[q.id];
    const opt = q.options.find((o) => o.id === selected);
    return submittedQuestions[q.id] && opt?.isCorrect;
  }).length;

  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Workshop Header & Score Dashboard */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-800">
              Taller Evaluativo SENA - Casos de Liquidación Fiscal
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pon a prueba tus conocimientos en Retefuente, IVA, Renta PJ e Impuesto al Patrimonio según la normatividad colombiana vigente.
          </p>
        </div>

        {/* Score Card */}
        <div className="flex items-center space-x-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Progreso Taller</div>
            <div className="text-xs font-semibold text-slate-700">
              {verifiedCount} de {totalQuestions} casos verificados
            </div>
          </div>

          <div className="border-l border-slate-300 pl-4">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Puntuación</div>
            <div className="text-lg font-black text-emerald-700 font-mono">
              {correctCount} / {totalQuestions} ({scorePercent}%)
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
            title="Reiniciar taller"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {WORKSHOP_QUESTIONS.map((q, idx) => {
          const isSubmitted = submittedQuestions[q.id];
          const selectedOption = selectedAnswers[q.id];
          const chosenOptObj = q.options.find((o) => o.id === selectedOption);

          return (
            <div
              key={q.id}
              className={`bg-white rounded-xl shadow-xs border transition overflow-hidden ${
                isSubmitted
                  ? chosenOptObj?.isCorrect
                    ? 'border-emerald-300 ring-1 ring-emerald-200'
                    : 'border-rose-300 ring-1 ring-rose-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded font-mono">
                    Formulario {q.taxForm}
                  </span>
                  <h3 className="font-bold text-sm text-slate-800">{q.title}</h3>
                </div>

                {isSubmitted && (
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1 ${
                      chosenOptObj?.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {chosenOptObj?.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcto
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrecto
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Scenario & Clues */}
              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-700 leading-relaxed text-sm bg-slate-50/60 p-3.5 rounded-lg border border-slate-200/80">
                  {q.scenario}
                </p>

                {/* Data Clues Pill Matrix */}
                <div className="flex flex-wrap gap-2">
                  {q.dataClues.map((clue, cIdx) => (
                    <span
                      key={cIdx}
                      className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-200"
                    >
                      <strong className="text-slate-900">{clue.label}:</strong> {clue.value}
                    </span>
                  ))}
                </div>

                {/* The Prompt Question */}
                <p className="font-bold text-slate-900 text-sm pt-1">{q.question}</p>

                {/* Options */}
                <div className="space-y-2 pt-1">
                  {q.options.map((option) => {
                    const isSelected = selectedOption === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleSelect(q.id, option.id)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-start space-x-3 ${
                          isSelected
                            ? isSubmitted
                              ? option.isCorrect
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                                : 'bg-rose-50 border-rose-400 text-rose-950'
                              : 'bg-slate-100 border-slate-400 text-slate-900'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 font-mono ${
                            isSelected
                              ? 'bg-slate-800 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {option.id}
                        </span>
                        <div className="flex-1">
                          <span>{option.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action button: Verify answer */}
                {!isSubmitted ? (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleVerify(q.id)}
                      disabled={!selectedOption}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      Verificar Respuesta
                    </button>
                  </div>
                ) : (
                  /* Feedback explanation */
                  <div
                    className={`mt-3 p-3.5 rounded-lg border text-xs leading-relaxed ${
                      chosenOptObj?.isCorrect
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                        : 'bg-rose-50/80 border-rose-300 text-rose-900'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      <HelpCircle className="w-4 h-4 shrink-0" />
                      <span>Sustento Jurídico y Explicación Pedagógica:</span>
                    </div>
                    <p>{chosenOptObj?.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Final badge banner if all completed */}
      {verifiedCount === totalQuestions && (
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Award className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                ¡Taller de Formación Tributaria Completado!
              </h3>
              <p className="text-xs text-emerald-100">
                Has analizado todos los casos prácticos. Puntuación final: {scorePercent}% ({correctCount} de {totalQuestions} correctas).
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-lg text-xs font-bold transition shadow-sm"
          >
            Realizar Taller Nuevamente
          </button>
        </div>
      )}
    </div>
  );
};
