import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  Compass,
  Sparkles,
  Users,
  Mail,
  RefreshCw,
  Camera,
  Layers,
  Save
} from 'lucide-react';
import { WildlifeSpecies, ProblemInvestigation, ProblemCategory, IUCNStatus } from '../types';

export const AdminPage: React.FC = () => {
  const {
    species,
    problems,
    moderationReports,
    newsletterSubscribers,
    addSpecies,
    updateSpecies,
    deleteSpecies,
    addProblem,
    updateProblem,
    deleteProblem,
    resolveReport,
    resetToInitialData,
    navigateTo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'wildlife' | 'problems' | 'moderation' | 'subscribers'>('wildlife');

  // Species Editor Modal
  const [editingSpecies, setEditingSpecies] = useState<Partial<WildlifeSpecies> | null>(null);
  const [isSpeciesNew, setIsSpeciesNew] = useState(false);

  // Problem Editor Modal
  const [editingProblem, setEditingProblem] = useState<Partial<ProblemInvestigation> | null>(null);
  const [isProblemNew, setIsProblemNew] = useState(false);

  // Action status notification
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Wildlife Handlers
  const handleOpenNewSpecies = () => {
    setIsSpeciesNew(true);
    setEditingSpecies({
      commonName: '',
      scientificName: '',
      slug: '',
      vernacularNames: [{ language: 'Hindi', name: '' }],
      taxonomy: {
        kingdom: 'Animalia',
        phylum: 'Chordata',
        class: 'Mammalia',
        order: '',
        family: '',
        genus: ''
      },
      iucnStatus: 'Vulnerable',
      iucnTrend: 'Decreasing',
      distributionSummary: '',
      biomes: ['Western Ghats'],
      habitatAndEcosystem: '',
      physicalDescription: '',
      dietAndFeeding: '',
      behaviorAndSocialStructure: '',
      reproductionAndLifecycle: '',
      ecologicalRole: '',
      threatsAndConservation: '',
      scientificallyDefensibleFacts: ['Field verified by scientific literature.'],
      primaryImageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      references: [],
      relatedProblemIds: [],
      isDraft: false,
      weeklyFeatured: false
    });
  };

  const handleSaveSpecies = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecies || !editingSpecies.commonName || !editingSpecies.scientificName) return;

    const slug = editingSpecies.slug || editingSpecies.commonName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (isSpeciesNew) {
      addSpecies({
        ...editingSpecies,
        slug
      } as any);
      showFeedback(`Created new species entry: "${editingSpecies.commonName}"`);
    } else if (editingSpecies.id) {
      updateSpecies(editingSpecies.id, editingSpecies);
      showFeedback(`Updated species: "${editingSpecies.commonName}"`);
    }
    setEditingSpecies(null);
  };

  // Problem Handlers
  const handleOpenNewProblem = () => {
    setIsProblemNew(true);
    setEditingProblem({
      title: '',
      subtitle: '',
      slug: '',
      category: 'Infrastructure & Transport',
      status: 'Proposed Pilot',
      coverImageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Field site context in rural India',
      imageCredit: 'Field Investigation Team',
      readingTimeMinutes: 12,
      author: {
        name: 'Divyankar Yadav',
        role: 'Founder & Student Researcher',
        affiliation: 'Vanya & Prayas'
      },
      problemStatement: '',
      executiveSummary: '',
      whyItMatters: {
        affectedPopulations: '',
        humanitarianImpact: '',
        ecologicalEconomicCost: ''
      },
      evidenceAndContext: {
        statistics: [{ label: 'Primary Indicator', value: '1,000+', citation: 'National Registry' }],
        contextNarrative: '',
        caseStudies: []
      },
      rootCauseAnalysis: {
        visibleSymptoms: ['Symptom 1'],
        structuralUnderlyingDrivers: ['Root cause 1'],
        institutionalGaps: ['Gap 1']
      },
      existingApproaches: [],
      proposedSolution: '',
      solutionArchitecture: {
        components: [
          {
            name: 'Primary Module',
            description: 'Core hardware or logistical component',
            technicalOrOperationalMethod: 'Standard procedure',
            leadStakeholders: 'Implementing agency'
          }
        ]
      },
      implementationBlueprint: [
        {
          phase: 'Phase 1: Pilot Grounding',
          timeline: 'Months 1–3',
          keyDeliverables: ['Baseline evaluation'],
          milestones: 'Initial validation'
        }
      ],
      resourcesAndCosts: {
        estimatedCostRange: 'INR 15–25 Lakhs',
        costBreakdown: [{ item: 'Hardware / Setup', costEst: 'INR 10,00,000', rationale: 'Procurement' }],
        fundingAndSustainability: 'Government & CSR grants'
      },
      risksAndLimitations: [
        { risk: 'Monsoon flooding', severity: 'Medium', mitigationStrategy: 'Elevated casing' }
      ],
      pilotProgram: {
        proposedLocation: 'District Pilot Sector',
        durationMonths: 6,
        targetCohort: 'Rural pilot cohort',
        methodology: 'Controlled field testing'
      },
      evaluationMetrics: [
        { indicator: 'Success Metric', baseline: '100', targetSuccessMetric: '< 10', verificationMethod: 'Field logs' }
      ],
      scalingStrategy: 'Expand across state sectors in year 2.',
      references: [],
      isDraft: false,
      weeklyFeatured: false
    });
  };

  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem || !editingProblem.title) return;

    const slug = editingProblem.slug || editingProblem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (isProblemNew) {
      addProblem({
        ...editingProblem,
        slug
      } as any);
      showFeedback(`Created new problem dossier: "${editingProblem.title}"`);
    } else if (editingProblem.id) {
      updateProblem(editingProblem.id, editingProblem);
      showFeedback(`Updated problem dossier: "${editingProblem.title}"`);
    }
    setEditingProblem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#F1EFE8]">
      {/* Masthead */}
      <div className="bg-[#131513] text-[#F1EFE8] p-6 sm:p-8 rounded-lg border border-[#B5A16A]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5A8A6C] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] font-bold">
              Owner &amp; Editorial Command Suite
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0C0B] border border-[#30322E] text-[#5A8A6C]">
              OWNER SESSION ACTIVE
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#F1EFE8]">
            Divyankar Yadav · Editorial Suite
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A59C] max-w-xl">
            Logged in as <strong>Divyankar Yadav</strong> (<span className="text-[#B5A16A]">divyankyadav232@gmail.com</span>). You have full authorization to draft, publish, edit, or clear monographs and research dossiers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to clean factory baseline?')) {
                resetToInitialData();
                showFeedback('Dataset restored to clean baseline.');
              }
            }}
            className="px-3.5 py-2 bg-[#181B18] hover:bg-[#202420] border border-[#30322E] text-[#A5A59C] hover:text-[#F1EFE8] rounded text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
            title="Reset to default initial content"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Baseline</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#30322E] overflow-x-auto text-sm font-medium">
        <button
          onClick={() => setActiveTab('wildlife')}
          className={`py-3 px-5 border-b-2 font-serif text-base transition flex items-center gap-2 ${
            activeTab === 'wildlife'
              ? 'border-[#B5A16A] text-[#B5A16A] font-bold'
              : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Wildlife Monographs ({species.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('problems')}
          className={`py-3 px-5 border-b-2 font-serif text-base transition flex items-center gap-2 ${
            activeTab === 'problems'
              ? 'border-[#5A8A6C] text-[#5A8A6C] font-bold'
              : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Problem Dossiers ({problems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`py-3 px-5 border-b-2 font-serif text-base transition flex items-center gap-2 ${
            activeTab === 'moderation'
              ? 'border-rose-400 text-rose-400 font-bold'
              : 'border-transparent text-[#A5A59C] hover:text-rose-400'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Moderation ({moderationReports.filter(r => r.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`py-3 px-5 border-b-2 font-serif text-base transition flex items-center gap-2 ${
            activeTab === 'subscribers'
              ? 'border-[#B5A16A] text-[#B5A16A] font-bold'
              : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Subscribers ({newsletterSubscribers.length})</span>
        </button>
      </div>

      {/* TAB 1: Wildlife Manager */}
      {activeTab === 'wildlife' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-[#1E2320]">
              Wildlife Species Catalog
            </h2>
            <button
              onClick={handleOpenNewSpecies}
              className="px-4 py-2 bg-[#1A3328] hover:bg-[#234234] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Species</span>
            </button>
          </div>

          <div className="bg-white border border-[#EAE4DC] rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs divide-y divide-[#EAE4DC]">
              <thead className="bg-[#FAF8F5] text-[#1A3328] font-semibold">
                <tr>
                  <th className="p-3.5">Species Name</th>
                  <th className="p-3.5">Class / Order</th>
                  <th className="p-3.5">IUCN Red List</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4DC]">
                {species.map((sp) => (
                  <tr key={sp.id} className="hover:bg-[#FAF8F5] transition">
                    <td className="p-3.5">
                      <div className="font-semibold text-sm text-[#1E2320]">{sp.commonName}</div>
                      <div className="text-[11px] italic text-[#525D56]">{sp.scientificName}</div>
                    </td>
                    <td className="p-3.5 text-[#525D56]">
                      {sp.taxonomy.class} / {sp.taxonomy.order}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sp.iucnStatus === 'Critically Endangered' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sp.iucnStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${sp.isDraft ? 'bg-gray-100 text-gray-700' : 'bg-emerald-100 text-emerald-800'}`}>
                        {sp.isDraft ? 'Draft' : 'Published'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => navigateTo('species-detail', sp.slug)}
                        className="p-1.5 text-gray-500 hover:text-[#1A3328]"
                        title="View Live"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsSpeciesNew(false);
                          setEditingSpecies(sp);
                        }}
                        className="p-1.5 text-gray-500 hover:text-blue-700"
                        title="Edit Entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${sp.commonName}?`)) {
                            deleteSpecies(sp.id);
                            showFeedback(`Deleted ${sp.commonName}`);
                          }
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Problems Manager */}
      {activeTab === 'problems' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-[#1E2320]">
              Problem Investigations Dossiers
            </h2>
            <button
              onClick={handleOpenNewProblem}
              className="px-4 py-2 bg-[#B85D36] hover:bg-[#A34F2C] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Draft New Investigation</span>
            </button>
          </div>

          <div className="bg-white border border-[#EAE4DC] rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs divide-y divide-[#EAE4DC]">
              <thead className="bg-[#FAF8F5] text-[#1A3328] font-semibold">
                <tr>
                  <th className="p-3.5">Investigation Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Readiness</th>
                  <th className="p-3.5">Reading Time</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4DC]">
                {problems.map((prob) => (
                  <tr key={prob.id} className="hover:bg-[#FAF8F5] transition">
                    <td className="p-3.5 max-w-xs">
                      <div className="font-semibold text-sm text-[#1E2320] line-clamp-1">{prob.title}</div>
                      <div className="text-[11px] text-[#525D56] line-clamp-1">{prob.subtitle}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#F3EFEA] text-[#B85D36] font-medium">
                        {prob.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#525D56] font-mono">
                      {prob.status}
                    </td>
                    <td className="p-3.5 text-[#8B9D93] font-mono">
                      {prob.readingTimeMinutes} min
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => navigateTo('problem-detail', prob.slug)}
                        className="p-1.5 text-gray-500 hover:text-[#1A3328]"
                        title="View Live"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsProblemNew(false);
                          setEditingProblem(prob);
                        }}
                        className="p-1.5 text-gray-500 hover:text-blue-700"
                        title="Edit Dossier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${prob.title}?`)) {
                            deleteProblem(prob.id);
                            showFeedback(`Deleted ${prob.title}`);
                          }
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Moderation Reports */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1E2320]">
            Community Reports &amp; Moderation
          </h2>

          <div className="bg-white border border-[#EAE4DC] rounded-2xl p-6 shadow-xs space-y-4">
            {moderationReports.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#8B9D93]">
                Zero reports pending. The community is abiding by scientific guidelines.
              </div>
            ) : (
              moderationReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border border-[#EAE4DC] rounded-xl text-xs space-y-2 bg-[#FAF8F5]"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-red-900">
                      Report: "{report.postTitle}"
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${report.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-[#525D56]">
                    <strong>Flagged Reason:</strong> {report.reason}
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[11px] text-[#8B9D93]">
                      Reported {new Date(report.reportedAt).toLocaleDateString('en-IN')}
                    </span>
                    {report.status === 'pending' && (
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            resolveReport(report.id, 'dismiss');
                            showFeedback('Report dismissed. Post preserved.');
                          }}
                          className="px-3 py-1 bg-white border border-[#EAE4DC] text-[#2C332E] hover:bg-gray-50 rounded font-medium"
                        >
                          Dismiss Flag
                        </button>
                        <button
                          onClick={() => {
                            resolveReport(report.id, 'remove');
                            showFeedback('Flagged post permanently removed.');
                          }}
                          className="px-3 py-1 bg-red-800 text-white hover:bg-red-900 rounded font-medium"
                        >
                          Remove Flagged Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Newsletter Subscribers */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-[#1E2320]">
              Registered Sunday Newsletter Readers ({newsletterSubscribers.length})
            </h2>
            <button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," +
                  ["Email,Topics,SubscribedAt"].concat(
                    newsletterSubscribers.map(s => `${s.email},"${s.topics.join(';')}",${s.subscribedAt}`)
                  ).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-3.5 py-1.5 bg-[#1A3328] hover:bg-[#234234] text-white rounded-lg text-xs font-semibold transition"
            >
              Export CSV
            </button>
          </div>

          <div className="bg-white border border-[#EAE4DC] rounded-2xl overflow-hidden shadow-xs">
            {newsletterSubscribers.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8B9D93]">
                No subscribers logged yet. Use the newsletter box in the footer to test subscription.
              </div>
            ) : (
              <table className="w-full text-left text-xs divide-y divide-[#EAE4DC]">
                <thead className="bg-[#FAF8F5] text-[#1A3328] font-semibold">
                  <tr>
                    <th className="p-3.5">Email Address</th>
                    <th className="p-3.5">Selected Interests</th>
                    <th className="p-3.5">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4DC]">
                  {newsletterSubscribers.map((sub, i) => (
                    <tr key={i} className="hover:bg-[#FAF8F5]">
                      <td className="p-3.5 font-medium text-[#1E2320]">{sub.email}</td>
                      <td className="p-3.5 text-[#525D56]">{sub.topics.join(', ')}</td>
                      <td className="p-3.5 text-[#8B9D93] font-mono">
                        {new Date(sub.subscribedAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Species Edit/Create Modal */}
      {editingSpecies && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-[#EAE4DC] pb-4">
              <h3 className="font-serif text-2xl font-bold text-[#1A3328]">
                {isSpeciesNew ? 'Create New Wildlife Monograph' : `Edit: ${editingSpecies.commonName}`}
              </h3>
              <button onClick={() => setEditingSpecies(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleSaveSpecies} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E2320] mb-1">Common English Name</label>
                  <input
                    type="text"
                    value={editingSpecies.commonName || ''}
                    onChange={(e) => setEditingSpecies({ ...editingSpecies, commonName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E2320] mb-1">Scientific Binomial</label>
                  <input
                    type="text"
                    value={editingSpecies.scientificName || ''}
                    onChange={(e) => setEditingSpecies({ ...editingSpecies, scientificName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl italic"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E2320] mb-1">Class</label>
                  <input
                    type="text"
                    value={editingSpecies.taxonomy?.class || ''}
                    onChange={(e) =>
                      setEditingSpecies({
                        ...editingSpecies,
                        taxonomy: { ...(editingSpecies.taxonomy as any), class: e.target.value }
                      })
                    }
                    className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E2320] mb-1">Order</label>
                  <input
                    type="text"
                    value={editingSpecies.taxonomy?.order || ''}
                    onChange={(e) =>
                      setEditingSpecies({
                        ...editingSpecies,
                        taxonomy: { ...(editingSpecies.taxonomy as any), order: e.target.value }
                      })
                    }
                    className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E2320] mb-1">IUCN Status</label>
                  <select
                    value={editingSpecies.iucnStatus || 'Vulnerable'}
                    onChange={(e) => setEditingSpecies({ ...editingSpecies, iucnStatus: e.target.value as IUCNStatus })}
                    className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                  >
                    <option value="Critically Endangered">Critically Endangered</option>
                    <option value="Endangered">Endangered</option>
                    <option value="Vulnerable">Vulnerable</option>
                    <option value="Near Threatened">Near Threatened</option>
                    <option value="Least Concern">Least Concern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1E2320] mb-1">Primary Image URL</label>
                <input
                  type="url"
                  value={editingSpecies.primaryImageUrl || ''}
                  onChange={(e) => setEditingSpecies({ ...editingSpecies, primaryImageUrl: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E2320] mb-1">Physical Description</label>
                <textarea
                  value={editingSpecies.physicalDescription || ''}
                  onChange={(e) => setEditingSpecies({ ...editingSpecies, physicalDescription: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E2320] mb-1">Geographic Distribution &amp; Habitat</label>
                <textarea
                  value={editingSpecies.distributionSummary || ''}
                  onChange={(e) => setEditingSpecies({ ...editingSpecies, distributionSummary: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSpecies.isDraft || false}
                    onChange={(e) => setEditingSpecies({ ...editingSpecies, isDraft: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-semibold text-[#1E2320]">Save as Draft (Hide from public catalog)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#EAE4DC] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSpecies(null)}
                  className="px-4 py-2 border border-[#EAE4DC] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A3328] text-white rounded-lg font-semibold"
                >
                  Save Species Monograph
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Problem Edit/Create Modal */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-[#EAE4DC] pb-4">
              <h3 className="font-serif text-2xl font-bold text-[#1A3328]">
                {isProblemNew ? 'Draft New Problem Investigation' : `Edit: ${editingProblem.title}`}
              </h3>
              <button onClick={() => setEditingProblem(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleSaveProblem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1E2320] mb-1">Investigation Title</label>
                <input
                  type="text"
                  value={editingProblem.title || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, title: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E2320] mb-1">Subtitle / Engineering Scope</label>
                <input
                  type="text"
                  value={editingProblem.subtitle || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, subtitle: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E2320] mb-1">Category</label>
                  <select
                    value={editingProblem.category || 'Infrastructure & Transport'}
                    onChange={(e) => setEditingProblem({ ...editingProblem, category: e.target.value as ProblemCategory })}
                    className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                  >
                    <option value="Infrastructure & Transport">Infrastructure & Transport</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Agriculture & Food">Agriculture & Food</option>
                    <option value="Environment & Climate">Environment & Climate</option>
                    <option value="Healthcare & Epidemiology">Healthcare & Epidemiology</option>
                    <option value="Wildlife & Biodiversity">Wildlife & Biodiversity</option>
                    <option value="Energy & Clean Tech">Energy & Clean Tech</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1E2320] mb-1">Investigation Stage</label>
                  <select
                    value={editingProblem.status || 'Proposed Pilot'}
                    onChange={(e) => setEditingProblem({ ...editingProblem, status: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                  >
                    <option value="Proposed Pilot">Proposed Pilot</option>
                    <option value="Field Trial Blueprint">Field Trial Blueprint</option>
                    <option value="Policy Brief">Policy Brief</option>
                    <option value="Under Investigation">Under Investigation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1E2320] mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={editingProblem.coverImageUrl || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, coverImageUrl: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E2320] mb-1">Precise Problem Statement</label>
                <textarea
                  value={editingProblem.problemStatement || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, problemStatement: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E2320] mb-1">Executive Summary</label>
                <textarea
                  value={editingProblem.executiveSummary || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, executiveSummary: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E2320] mb-1">Proposed Solution &amp; Technical Method</label>
                <textarea
                  value={editingProblem.proposedSolution || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, proposedSolution: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 bg-white border border-[#EAE4DC] rounded-xl"
                  required
                />
              </div>

              <div className="pt-4 border-t border-[#EAE4DC] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProblem(null)}
                  className="px-4 py-2 border border-[#EAE4DC] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B85D36] text-white rounded-lg font-semibold"
                >
                  Save Problem Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
