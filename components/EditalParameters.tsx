import React, { useState } from 'react';
import { Save, Calendar, DollarSign, Target, Layers, AlertCircle } from 'lucide-react';

const EditalParameters: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  // Initial state based on the PDF "Edital de Emendas 2026"
  const [params, setParams] = useState({
    timeline: {
      registrationStart: '2025-11-03',
      registrationEnd: '2025-11-21',
      analysisEnd: '2026-01-16',
      votingStart: '2026-01-19',
      votingEnd: '2026-01-25',
      resultsDate: '2026-02-13'
    },
    budget: {
      maxProjectValue: 500000,
      minProjectValue: 200000, // Based on general federal rules mentioned
      healthAllocationPercentage: 50, // Constitutional requirement mentioned in PDF
      year: 2026
    },
    scoring: {
      score: 100, // Pontuação Máxima
      minScoreToPass: 70,
      weights: {
        history: 20,
        consistency: 30,
        mandateRelation: 10,
        socialImpact: 20,
        budget: 20
      }
    },
    areas: [
      'Educação',
      'Cidadania e Desenvolvimento Social',
      'Saúde',
      'Cultura e Esporte',
      'Empreendedorismo e Inovação',
      'Meio Ambiente',
      'Ações Afirmativas'
    ]
  });

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Parâmetros atualizados com sucesso!');
    }, 1000);
  };

  const handleChange = (section: keyof typeof params, field: string, value: any) => {
    setParams(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parâmetros do Edital</h2>
          <p className="text-gray-500">Configuração das regras, prazos e critérios de avaliação do ciclo 2026.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium disabled:opacity-70"
        >
          <Save size={18} />
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Timeline Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-800 border-b border-gray-100 pb-2">
            <Calendar className="text-blue-600" size={20} />
            <h3 className="font-bold text-lg">Cronograma Oficial</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Início das Inscrições</label>
              <input 
                type="date" 
                value={params.timeline.registrationStart}
                onChange={(e) => handleChange('timeline', 'registrationStart', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fim das Inscrições</label>
              <input 
                type="date" 
                value={params.timeline.registrationEnd}
                onChange={(e) => handleChange('timeline', 'registrationEnd', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="md:col-span-2 py-2">
               <hr className="border-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fim da Análise de Mérito</label>
              <input 
                type="date" 
                value={params.timeline.analysisEnd}
                onChange={(e) => handleChange('timeline', 'analysisEnd', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Divulgação de Resultados</label>
              <input 
                type="date" 
                value={params.timeline.resultsDate}
                onChange={(e) => handleChange('timeline', 'resultsDate', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 bg-yellow-50 p-3 rounded-md flex items-start gap-2 text-sm text-yellow-800 mt-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p>O sistema bloqueará novas submissões automaticamente após as 23h59 da data final de inscrições.</p>
            </div>
          </div>
        </div>

        {/* Budget Rules Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-800 border-b border-gray-100 pb-2">
            <DollarSign className="text-green-600" size={20} />
            <h3 className="font-bold text-lg">Regras Orçamentárias</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Máximo por Projeto</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">R$</span>
                  <input 
                    type="number" 
                    value={params.budget.maxProjectValue}
                    onChange={(e) => handleChange('budget', 'maxProjectValue', Number(e.target.value))}
                    className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano do Orçamento</label>
                <input 
                  type="number" 
                  value={params.budget.year}
                  readOnly
                  className="w-full p-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destinação Obrigatória para Saúde</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={params.budget.healthAllocationPercentage}
                  onChange={(e) => handleChange('budget', 'healthAllocationPercentage', Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <span className="font-bold text-gray-900 w-12">{params.budget.healthAllocationPercentage}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Conforme Art. 166, §9º da Constituição Federal.</p>
            </div>
          </div>
        </div>

        {/* Scoring Criteria Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-800 border-b border-gray-100 pb-2">
            <Target className="text-purple-600" size={20} />
            <h3 className="font-bold text-lg">Critérios de Avaliação (Mérito)</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="font-semibold text-gray-700">Pontuação Máxima</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={params.scoring.score}
                  onChange={(e) => handleChange('scoring', 'score', Number(e.target.value))}
                  className="w-16 p-1 text-center border border-gray-300 rounded focus:outline-none font-bold text-blue-600"
                />
                <span className="text-gray-500 text-sm">pontos</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="font-semibold text-gray-700">Nota de Corte (Classificação)</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={params.scoring.minScoreToPass}
                  onChange={(e) => handleChange('scoring', 'minScoreToPass', Number(e.target.value))}
                  className="w-16 p-1 text-center border border-gray-300 rounded focus:outline-none font-bold text-blue-600"
                />
                <span className="text-gray-500 text-sm">pontos</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Distribuição de Pesos (Total: {params.scoring.score})</p>
              
              {Object.entries(params.scoring.weights).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {key === 'mandateRelation' ? 'Relação c/ Mandato' : 
                     key === 'socialImpact' ? 'Impacto Social' : 
                     key === 'budget' ? 'Orçamento' : 
                     key === 'history' ? 'Histórico' : 'Consistência'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${(val as number / params.scoring.score) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono w-8 text-right">{val as number}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thematic Areas Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-800 border-b border-gray-100 pb-2">
            <Layers className="text-orange-600" size={20} />
            <h3 className="font-bold text-lg">Áreas Temáticas</h3>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {params.areas.map((area, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
                <span className="text-sm text-gray-700 font-medium">{area}</span>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-400 text-sm font-medium transition-colors">
              + Adicionar Nova Área
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditalParameters;