import React, { useState, useMemo } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Treemap } from 'recharts';
import { LayoutDashboard, List, FileText, Settings, Search, Filter, PlusCircle, Users, Wallet, Sparkles, Bot } from 'lucide-react';
import { Project, ProjectStatus, EvaluationCriteria } from './types';
import { initialProjects } from './data';
import ProjectCard from './components/ProjectCard';
import ProjectDetails from './components/ProjectDetails';
import EditalParameters from './components/EditalParameters';
import Assistant from './components/Assistant';

const STATUS_COLORS: Record<string, string> = {
  [ProjectStatus.APPROVED]: '#10B981', // Verde
  [ProjectStatus.REJECTED]: '#EF4444', // Vermelho
  [ProjectStatus.PENDING]: '#9CA3AF',  // Cinza
  [ProjectStatus.UNDER_REVIEW]: '#3B82F6' // Azul
};

const CustomizedTreemapContent = (props: any) => {
  const { root, depth, x, y, width, height, index, name, value } = props;
  
  // Define cor baseada no status (que é o 'name' do nó folha)
  const color = STATUS_COLORS[name as string] || '#CBD5E1';

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {/* Mostra texto apenas se o retângulo for grande o suficiente */}
      {width > 40 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={11}
          fontWeight="bold"
          style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.4)' }}
        >
          {name === ProjectStatus.APPROVED ? 'APROV' : 
           name === ProjectStatus.REJECTED ? 'REPROV' : 
           name === ProjectStatus.PENDING ? 'PEND' : name}
        </text>
      )}
      {width > 40 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 12}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
          style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.4)' }}
        >
          {value}
        </text>
      )}
    </g>
  );
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [municipalityFilter, setMunicipalityFilter] = useState<string>('all');
  const [evaluatorFilter, setEvaluatorFilter] = useState<string>('all');
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Helper para determinar o avaliador efetivo
  const getEffectiveEvaluator = (p: Project) => {
    // Regra: Projetos sem análise (Pendentes) ou sem avaliador definido são da Tabata Amaral
    if (p.status === ProjectStatus.PENDING || !p.evaluator) {
      return 'Tabata Amaral';
    }
    return p.evaluator;
  };

  // Dashboard Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const approved = projects.filter(p => p.status === ProjectStatus.APPROVED).length;
    const totalBudget = projects.reduce((acc, curr) => acc + curr.requestedValue, 0);
    const avgScore = projects.filter(p => p.score).reduce((acc, curr) => acc + (curr.score || 0), 0) / (projects.filter(p => p.score).length || 1);

    const themeData = projects.reduce((acc, curr) => {
      acc[curr.theme] = (acc[curr.theme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(themeData).map(key => ({ name: key, count: themeData[key] }));
    
    const statusData = [
        { name: 'Classificado', value: approved, color: STATUS_COLORS[ProjectStatus.APPROVED] },
        { name: 'Pendente', value: projects.filter(p => p.status === ProjectStatus.PENDING).length, color: STATUS_COLORS[ProjectStatus.PENDING] },
        { name: 'Desclassificado', value: projects.filter(p => p.status === ProjectStatus.REJECTED).length, color: STATUS_COLORS[ProjectStatus.REJECTED] },
    ];

    // Treemap Data: Hierarquia Analista -> Status
    // Estrutura: { name: 'Analista', children: [ { name: 'Aprovado', size: 10 }, { name: 'Reprovado', size: 5 } ] }
    
    const groupedData: Record<string, Record<string, number>> = {};

    projects.forEach(p => {
      const evaluator = getEffectiveEvaluator(p);
      const status = p.status;

      if (!groupedData[evaluator]) {
        groupedData[evaluator] = {};
      }
      if (!groupedData[evaluator][status]) {
        groupedData[evaluator][status] = 0;
      }
      groupedData[evaluator][status]++;
    });

    const treemapData = Object.keys(groupedData).map(evaluator => ({
      name: evaluator,
      children: Object.keys(groupedData[evaluator]).map(status => ({
        name: status,
        size: groupedData[evaluator][status]
      }))
    }));

    return { total, approved, totalBudget, avgScore, chartData, statusData, treemapData };
  }, [projects]);

  // Unique Municipalities list for filter
  const municipalities = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.municipality))).sort();
  }, [projects]);

  // Unique Evaluators list for filter
  const evaluators = useMemo(() => {
    return Array.from(new Set(projects.map(p => getEffectiveEvaluator(p)))).sort();
  }, [projects]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesMunicipality = municipalityFilter === 'all' || p.municipality === municipalityFilter;
    
    const effectiveEvaluator = getEffectiveEvaluator(p);
    const matchesEvaluator = evaluatorFilter === 'all' || effectiveEvaluator === evaluatorFilter;
    
    return matchesSearch && matchesStatus && matchesMunicipality && matchesEvaluator;
  });

  const handleOpenEvaluation = (project: Project) => {
    navigate(`/projetos/${project.id}`);
  };

  const handleSaveEvaluation = (id: string, evaluation: EvaluationCriteria, status: ProjectStatus, score: number, feedback: string) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { 
        ...p, 
        evaluation, 
        status, 
        score, 
        feedback,
        evaluator: 'Tabata Amaral' // Assinatura do analista chefe ao salvar
      } : p
    ));
  };

  const handleAutoAnalyzeAll = () => {
    setIsAnalyzingAll(true);
    
    setTimeout(() => {
      setProjects(prev => prev.map(p => {
        
        // 1. Lógica para projetos PENDENTES (Análise completa IA)
        if (p.status === ProjectStatus.PENDING) {
          const budgetOk = p.requestedValue >= 200000 && p.requestedValue <= 500000;
          const descFactor = Math.min(p.description.length / 5, 20); 
          
          const evaluation: EvaluationCriteria = {
            history: 15,
            consistency: Math.floor(10 + descFactor),
            mandateRelation: p.theme.includes('Educação') || p.theme.includes('Inovação') ? 10 : 7,
            socialImpact: 15,
            budget: budgetOk ? 20 : 5
          };

          const totalScore = Object.values(evaluation).reduce((a, b) => a + b, 0);
          const status = totalScore >= 70 ? ProjectStatus.APPROVED : ProjectStatus.REJECTED;

          return {
            ...p,
            evaluation,
            score: totalScore,
            status,
            evaluator: 'IA (Tabata)',
            feedback: `ANÁLISE AUTOMÁTICA:\n- Orçamento: ${budgetOk ? 'Adequado' : 'Inadequado'}.\n- Aderência ao Mandato: ${evaluation.mandateRelation}/10.\nRequer validação técnica humana.`
          };
        } 
        
        return p;
      }));
      
      setIsAnalyzingAll(false);
    }, 2500);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">Gestor de<br/><span className="text-blue-400">Emendas 2026</span></h1>
          <p className="text-xs text-slate-400 mt-2">Dep. Tabata Amaral</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/projetos" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname.includes('/projetos') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <List size={20} />
            Lista de Projetos
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-800 text-xs font-semibold text-slate-500 uppercase px-4">Configurações</div>
          <Link to="/parametros" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/parametros' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Settings size={20} />
            Parâmetros do Edital
          </Link>
        </nav>
        <div className="p-4 bg-slate-950 text-xs text-slate-500">
          v1.0.1 - Edital 2026
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {location.pathname === '/' ? 'Visão Geral' : 
             location.pathname.includes('/projetos') ? 'Gestão de Projetos' : 
             'Parâmetros do Edital'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Ciclo 2026 Ativo
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-right hidden sm:block">
                <span className="block font-bold text-gray-700">Tabata Amaral</span>
                <span className="block text-xs text-gray-500">Analista Chefe</span>
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border-2 border-slate-300">
                TA
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><FileText size={24} /></div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
                    <p className="text-sm text-gray-500 mt-1">Projetos submetidos</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600"><Users size={24} /></div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Classificados</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.approved}</h3>
                    <p className="text-sm text-gray-500 mt-1">Aptos ao voto popular</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Wallet size={24} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(stats.totalBudget)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Demanda orçamentária</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Filter size={24} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.avgScore.toFixed(1)}</h3>
                    <p className="text-sm text-gray-500 mt-1">Média de pontuação</p>
                  </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Bar Chart */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Projetos por Área Temática</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.chartData} layout="vertical" margin={{ left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Status da Análise</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.statusData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {stats.statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Treemap - Projects by Evaluator & Status */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 xl:col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Produtividade dos Analistas</h3>
                    <p className="text-xs text-gray-500 mb-4">Volume de projetos por analista e status</p>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                          data={stats.treemapData}
                          dataKey="size"
                          ratio={4 / 3}
                          stroke="#fff"
                          fill="#8884d8"
                          content={<CustomizedTreemapContent />}
                        >
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                // O payload no treemap aninhado do Recharts às vezes vem diferente
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white p-2 border border-gray-200 shadow-lg rounded-lg text-xs">
                                    <p className="font-bold">{data.root ? data.root.name : data.name}</p>
                                    <p className="text-gray-600">{data.name}: {data.value} projetos</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </Treemap>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            } />

            <Route path="/projetos" element={
              <div className="space-y-6">
                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Buscar por projeto, entidade ou município..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    
                    {/* Botão AI Analysis */}
                    <button 
                      onClick={handleAutoAnalyzeAll}
                      disabled={isAnalyzingAll}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition flex items-center gap-2 shadow-sm shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isAnalyzingAll ? (
                        <>Processando...</>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          Tabata AI: Revisão Geral
                        </>
                      )}
                    </button>

                    <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Filter size={18} />
                      Filtrar:
                    </div>
                    
                    <select 
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[150px]"
                      value={municipalityFilter}
                      onChange={(e) => setMunicipalityFilter(e.target.value)}
                    >
                      <option value="all">Todos os Municípios</option>
                      {municipalities.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>

                    <select 
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Todos os Status</option>
                      <option value={ProjectStatus.PENDING}>Pendentes</option>
                      <option value={ProjectStatus.UNDER_REVIEW}>Em Análise</option>
                      <option value={ProjectStatus.APPROVED}>Classificados</option>
                      <option value={ProjectStatus.REJECTED}>Desclassificados</option>
                    </select>

                    <select 
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[150px]"
                      value={evaluatorFilter}
                      onChange={(e) => setEvaluatorFilter(e.target.value)}
                    >
                      <option value="all">Todos os Analistas</option>
                      {evaluators.map(ev => (
                        <option key={ev} value={ev}>{ev}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => handleOpenEvaluation(project)} 
                    />
                  ))}
                </div>
                
                {filteredProjects.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    Nenhum projeto encontrado com os filtros atuais.
                  </div>
                )}
              </div>
            } />
            
            <Route path="/projetos/:projectId" element={
              <ProjectDetails projects={projects} onSave={handleSaveEvaluation} />
            } />

            <Route path="/parametros" element={<EditalParameters />} />
          </Routes>
        </div>
      </main>

      {/* Assistant */}
      <Assistant />
    </div>
  );
};

export default App;