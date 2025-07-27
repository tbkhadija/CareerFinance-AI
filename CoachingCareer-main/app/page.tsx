'use client'

import { useState, useRef } from 'react'
import { useAuth } from '../lib/useAuth'
import { useRouter } from 'next/navigation'
import BulletinAnalysisResult from '../components/Results/BulletinAnalysisResult'
import type { BulletinData } from '../components/Results/BulletinAnalysisResult'
import SalaryAnalysisResult from '../components/Results/SalaryAnalysisResult'
import CareerCoachingResult from '../components/Results/CareerCoachingResult'

export default function Home() {
  const [uploading, setUploading] = useState(false)
const [statusMessage, setStatusMessage] = useState('')
const fileInputRef = useRef<HTMLInputElement>(null)
const [resultData, setResultData] = useState<any>(null)

  const [activeTab, setActiveTab] = useState('bulletin-paie')
  const { login, isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  // États pour les résultats
  const [showBulletinResult, setShowBulletinResult] = useState(false)
  const [showSalaryResult, setShowSalaryResult] = useState(false)
  const [showCareerResult, setShowCareerResult] = useState(false)

  // États pour les données des formulaires
 
const [bulletinData, setBulletinData] = useState<BulletinData>({
  fileName: '',
  resume: {
    salaireBrut: 0,
    salaireNet: 0,
    cotisations: 0,
    impots: 0,
  },
  details: {
    salaireBase: 0,
    primes: 0,
    heuresSupp: 0,
    cotisations: {
      CNSS: 0,
      AMO: 0,
      RetraiteComplementaire: 0,
      AssuranceChomage: 0
    },
    impots: {
      IR: 0
    },
    netAPayer: 0
  },
  anomalies: [],
  recommandations: []
})




  const [salaryFormData, setSalaryFormData] = useState({
    poste: '',
    experience: '',
    localisation: '',
    salaireActuel: 0
  })

  const [careerFormData, setCareerFormData] = useState({
    objectif: '',
    competences: '',
    secteur: ''
  })

  const handleQuickLogin = () => {
    login({
      name: 'Demo User',
      email: 'demo@example.com',
      isLoggedIn: true
    })
    router.push('/dashboard')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  setUploading(true)
  setStatusMessage('Analyse en cours...')

  try {
    const response = await fetch('http://localhost:8000/api/documents/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('Erreur serveur')

    const data = await response.json()
    setResultData(data)
    setStatusMessage('Analyse terminée ✅')
    // ⬇️ Ici on met à jour bulletinData à partir des vraies données API
setBulletinData({
  fileName: data.fileName || 'Document analysé',
  resume: {
    salaireBrut: data.resume?.salaireBrut || 0,
    salaireNet: data.resume?.salaireNet || 0,
    cotisations: data.resume?.cotisations || 0,
    impots: data.resume?.impots || 0,
  },
  details: {
    salaireBase: data.details?.salaireBase || 0,
    primes: data.details?.primes || 0,
    heuresSupp: data.details?.heuresSupp || 0,
    cotisations: {
      CNSS: data.details?.cotisations?.CNSS || 0,
      AMO: data.details?.cotisations?.AMO || 0,
      RetraiteComplementaire: data.details?.cotisations?.RetraiteComplementaire || 0,
      AssuranceChomage: data.details?.cotisations?.AssuranceChomage || 0,
    },
    impots: {
      IR: data.details?.impots?.IR || 0,
    },
    netAPayer: data.details?.netAPayer || 0
  },
  anomalies: data.anomalies || [],
  recommandations: data.recommandations || []
})



// Et on affiche le composant stylisé
setShowBulletinResult(true)
  } catch (err: any) {
    setStatusMessage('Erreur : ' + err.message)
  } finally {
    setUploading(false)
  }
}


  // Fonctions de gestion des soumissions
  const handleBulletinAnalysis = () => {
    // Simulation de données d'analyse de bulletin
    
   
const mockBulletinData = {
  fileName: 'bulletin_juillet_2025.pdf',
  resume: {
    salaireBrut: 25000,
    salaireNet: 18500,
    cotisations: 4500,
    impots: 2000
  },
  details: {
    salaireBase: 20000,
    primes: 3000,
    heuresSupp: 1500,
    cotisations: {
      CNSS: 1500,
      AMO: 1200,
      RetraiteComplementaire: 1000,
      AssuranceChomage: 800
    },
    impots: {
      IR: 2000
    },
    netAPayer: 18500
  },
  anomalies: [
    {
      type: 'Cotisation',
      title: 'Cotisation excessive',
      description: 'La cotisation retraite semble plus élevée que la moyenne.',
      impact: 'Réduit le salaire net.'
    }
  ],
  recommandations: [
    'Vérifiez votre taux de cotisation avec l’URSSAF.',
    'Discutez avec votre employeur des options d’optimisation fiscale.'
  ]
}


    setBulletinData(mockBulletinData)
    setShowBulletinResult(true)
  }

  const handleSalaryAnalysis = async () => {
  try {
    const payload = {
      jobTitle: salaryFormData.poste,
      location: salaryFormData.localisation,
      experienceYears: parseInt(salaryFormData.experience), // "2 ans" → 2
      currentSalary: salaryFormData.salaireActuel
    }

    const response = await fetch("http://localhost:8000/api/salary/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erreur serveur:", response.status, errorText)
      throw new Error("Erreur serveur")
    }

    const data = await response.json()

    // Affiche le résultat
    console.log("📦 Données reçues de l'API :", data)  // 👈 ICI
    setResultData(data)
    setShowSalaryResult(true)
  } catch (err: any) {
    console.error("Erreur analyse salariale :", err.message)
  }
}



  const handleCareerCoaching = () => {
    // Simulation de données de coaching carrière
    const mockCareerData = {
      objectif: careerFormData.objectif || 'Évoluer vers un poste de management',
      competences: careerFormData.competences ? careerFormData.competences.split(',').map(c => c.trim()) : ['JavaScript', 'React', 'Node.js'],
      secteur: careerFormData.secteur || 'Technologie',
      planCarriere: {
        etapes: [
          {
            titre: 'Senior Developer',
            duree: '6-12 mois',
            description: 'Renforcer vos compétences techniques et prendre plus de responsabilités',
            competencesRequises: ['Leadership technique', 'Mentoring', 'Architecture'],
            salaireEstime: 28000
          },
          {
            titre: 'Team Lead',
            duree: '1-2 ans',
            description: 'Diriger une équipe de développeurs et gérer des projets',
            competencesRequises: ['Management', 'Communication', 'Planification'],
            salaireEstime: 35000
          },
          {
            titre: 'Engineering Manager',
            duree: '2-3 ans',
            description: 'Gérer plusieurs équipes et définir la stratégie technique',
            competencesRequises: ['Strategic thinking', 'Budget management', 'Hiring'],
            salaireEstime: 45000
          }
        ]
      },
      scriptNegociation: {
        points: [
          'Mes réalisations et contributions à l\'équipe',
          'Mon engagement dans la formation continue',
          'Ma capacité à prendre des initiatives',
          'Les résultats mesurables de mon travail'
        ],
        arguments: [
          'J\'ai mené avec succès 3 projets majeurs cette année',
          'J\'ai formé 2 nouveaux développeurs juniors',
          'J\'ai proposé et implémenté des améliorations qui ont réduit les bugs de 30%',
          'Je souhaite évoluer vers plus de responsabilités managériales'
        ]
      }
    }
    setShowCareerResult(true)
  }

  const tabs = [
    { id: 'bulletin-paie', label: 'Bulletin de Paie / contrat' },
    { id: 'analyse-salariale', label: 'Analyse Salariale' },
    { id: 'coaching-carriere', label: 'Coaching Carrière' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bulletin-paie':
  return (
    <div className="space-y-6">
      <div
        className="relative border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-400 transition-all duration-300 group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-blue-600 text-lg font-semibold mb-2">
            Déposez votre bulletin de paie ou contrat ici
          </div>
          <div className="text-gray-500 text-sm">
            Formats acceptés : PDF, JPG, PNG • Taille max : 10MB
          </div>
        </div>
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full bg-gradient-to-r from-purple-500 to-cyan-400 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        {uploading ? 'Analyse en cours...' : 'Analyser mon bulletin ou contrat'}
      </button>

      {statusMessage && <div className="text-center text-sm text-gray-600">{statusMessage}</div>}

      {resultData && null}

    </div>
  )

      case 'analyse-salariale':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Intitulé du poste</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Développeur Full-Stack"
                  value={salaryFormData.poste}
                  onChange={(e) => setSalaryFormData({...salaryFormData, poste: e.target.value})}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Années d'expérience</span>
                </label>
                <select
                  value={salaryFormData.experience}
                  onChange={(e) => setSalaryFormData({...salaryFormData, experience: e.target.value})}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md text-gray-900 dark:text-white"
                >
                  <option>Sélectionnez</option>
                  <option>0-2 ans</option>
                  <option>3-5 ans</option>
                  <option>5-10 ans</option>
                  <option>10+ ans</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Localisation</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Casa, Rabat, Tanger..."
                  value={salaryFormData.localisation}
                  onChange={(e) => setSalaryFormData({...salaryFormData, localisation: e.target.value})}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Salaire actuel (MAD/mois)</span>
                </label>
                <input
                  type="number"
                  placeholder="Ex : 15 000"
                  value={salaryFormData.salaireActuel || ''}
                  onChange={(e) => setSalaryFormData({...salaryFormData, salaireActuel: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <button
              onClick={handleSalaryAnalysis}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-400 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 transform"
            >
              <span className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Analyser mon positionnement</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        )

      case 'coaching-carriere':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Objectif professionnel</span>
              </label>
              <textarea
                placeholder="Décrivez votre objectif de carrière..."
                rows={3}
                value={careerFormData.objectif}
                onChange={(e) => setCareerFormData({...careerFormData, objectif: e.target.value})}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span>Compétences clés</span>
              </label>
              <input
                type="text"
                placeholder="Ex : JavaScript, Python, React..."
                value={careerFormData.competences}
                onChange={(e) => setCareerFormData({...careerFormData, competences: e.target.value})}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Secteur d'activité</span>
              </label>
              <select
                value={careerFormData.secteur}
                onChange={(e) => setCareerFormData({...careerFormData, secteur: e.target.value})}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md text-gray-900 dark:text-white"
              >
                <option>Sélectionnez...</option>
                <option>Technologie</option>
                <option>Finance</option>
                <option>Santé</option>
                <option>Éducation</option>
                <option>Commerce</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleCareerCoaching}
                className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 transform"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Générer mon plan de carrière</span>
                </span>
              </button>
              <button
                onClick={handleCareerCoaching}
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 transform"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Script de négociation</span>
                </span>
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-6 pb-6 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-2xl mb-6 shadow-lg animate-float animate-glow">
            <span className="text-white font-bold text-2xl">CF</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent mb-4">
            CareerFinance AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Votre assistant intelligent pour optimiser votre carrière et comprendre vos finances
          </p>
          <div className="mt-6 flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
            </div>
            {!isLoading && !isLoggedIn && (
              <button
                onClick={handleQuickLogin}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:shadow-xl hover:shadow-green-500/25 hover:scale-105 transition-all duration-300"
              >
                🚀 Connexion rapide (Demo)
              </button>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div>
            {/* Navigation Tabs */}
            <div className="flex space-x-2 mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-xl shadow-purple-500/25'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Composants de résultats */}
      {showBulletinResult && (
        <BulletinAnalysisResult
          data={bulletinData}
          onClose={() => setShowBulletinResult(false)}
        />
      )}

      {showSalaryResult && resultData && (
  <SalaryAnalysisResult
    data={resultData}
    onClose={() => setShowSalaryResult(false)}
  />
)}


      {showCareerResult && (
        <CareerCoachingResult
          data={{
            objectif: careerFormData.objectif || 'Évoluer vers un poste de management',
            competences: careerFormData.competences ? careerFormData.competences.split(',').map(c => c.trim()) : ['JavaScript', 'React', 'Node.js'],
            secteur: careerFormData.secteur || 'Technologie',
            planCarriere: {
              etapes: [
                {
                  titre: 'Senior Developer',
                  duree: '6-12 mois',
                  description: 'Renforcer vos compétences techniques et prendre plus de responsabilités',
                  competencesRequises: ['Leadership technique', 'Mentoring', 'Architecture'],
                  salaireEstime: 28000
                },
                {
                  titre: 'Team Lead',
                  duree: '1-2 ans',
                  description: 'Diriger une équipe de développeurs et gérer des projets',
                  competencesRequises: ['Management', 'Communication', 'Planification'],
                  salaireEstime: 35000
                },
                {
                  titre: 'Engineering Manager',
                  duree: '2-3 ans',
                  description: 'Gérer plusieurs équipes et définir la stratégie technique',
                  competencesRequises: ['Strategic thinking', 'Budget management', 'Hiring'],
                  salaireEstime: 45000
                }
              ]
            },
            scriptNegociation: {
              points: [
                'Mes réalisations et contributions à l\'équipe',
                'Mon engagement dans la formation continue',
                'Ma capacité à prendre des initiatives',
                'Les résultats mesurables de mon travail'
              ],
              arguments: [
                'J\'ai mené avec succès 3 projets majeurs cette année',
                'J\'ai formé 2 nouveaux développeurs juniors',
                'J\'ai proposé et implémenté des améliorations qui ont réduit les bugs de 30%',
                'Je souhaite évoluer vers plus de responsabilités managériales'
              ]
            }
          }}
          onClose={() => setShowCareerResult(false)}
        />
      )}
    </div>
  )
}