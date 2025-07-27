'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3, MapPin, Users, Briefcase, Download, Share2 } from 'lucide-react'

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface Trend {
  title: string;
  detail: string;
}

interface Etape {
  numero: number;
  contenu: string;
}

interface SalaryData {
  jobTitle: string;
  experienceYears: string;
  location: string;
  salaireActuel: number;
  moyenne: number;
  minimum: number;
  maximum: number;
  percentile: number;
  recommandations: Recommendation[];
  tendances: Trend[];
  etapes: Etape[];
}

interface SalaryAnalysisResultProps {
  data: SalaryData
  onClose: () => void
}

export default function SalaryAnalysisResult({ data, onClose }: SalaryAnalysisResultProps) {
  const [activeTab, setActiveTab] = useState('comparaison')

  const ecartSalaire = data.salaireActuel - data.moyenne
  const ecartPourcentage = (ecartSalaire / data.moyenne) * 100

  const benchmarkData = [
    { entreprise: 'Entreprises similaires', salaire: data.moyenne, type: 'moyenne' },
    { entreprise: 'Top 25%', salaire: data.maximum * 0.8, type: 'top' },
    { entreprise: 'Votre salaire', salaire: data.salaireActuel, type: 'current' }
  ]

 

  const tabs = [
    { id: 'comparaison', label: 'Comparaison', icon: BarChart3 },
    { id: 'marche', label: 'Marché', icon: TrendingUp },
    { id: 'conseils', label: 'Conseils', icon: Briefcase }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'comparaison':
        return (
          <div className="space-y-6">
            {/* Résumé principal */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Votre Position Salariale</h3>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  ecartPourcentage >= 0 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {ecartPourcentage >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{ecartPourcentage >= 0 ? '+' : ''}{ecartPourcentage.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Votre salaire</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.salaireActuel.toLocaleString()} MAD</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Moyenne du marché</p>
                  <p className="text-2xl font-bold text-blue-600">{data.moyenne.toLocaleString()} MAD</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Écart</p>
                  <p className={`text-2xl font-bold ${ecartSalaire >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {ecartSalaire >= 0 ? '+' : ''}{ecartSalaire.toLocaleString()} MAD
                  </p>
                </div>
              </div>
            </div>

            {/* Graphique de comparaison */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Comparaison avec le Marché</h3>
              <div className="space-y-4">
                {benchmarkData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-32 text-sm text-gray-600 dark:text-gray-400">{item.entreprise}</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative">
                      <div 
                        className={`h-3 rounded-full ${
                          item.type === 'current' ? 'bg-purple-500' :
                          item.type === 'moyenne' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(item.salaire / data.maximum) * 100}%` }}
                      />
                    </div>
                    <div className="w-24 text-sm font-medium text-gray-900 dark:text-white text-right">
                      {item.salaire.toLocaleString()} MAD
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Percentile */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Votre Percentile</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Vous gagnez plus que <span className="font-semibold text-purple-600">{data.percentile}%</span> des professionnels dans votre domaine
                  </p>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-cyan-400 h-3 rounded-full"
                      style={{ width: `${data.percentile}%` }}
                    />
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-600">{data.percentile}%</div>
              </div>
            </div>
          </div>
        )

      case 'marche':
        return (
          <div className="space-y-6">
            {/* Informations du jobTitle */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Détails du jobTitle Analysé</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">jobTitle</p>
                    <p className="font-medium text-gray-900 dark:text-white">{data.jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expérience</p>
                    <p className="font-medium text-gray-900 dark:text-white">{data.experienceYears}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">localisation</p>
                    <p className="font-medium text-gray-900 dark:text-white">{data.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fourchette salariale */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fourchette Salariale du Marché</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">Minimum</p>
                  <p className="text-xl font-bold text-red-700 dark:text-red-300">{data.minimum.toLocaleString()} MAD</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Moyenne</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{data.moyenne.toLocaleString()} MAD</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Maximum</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">{data.maximum.toLocaleString()} MAD</p>
                </div>
              </div>
            </div>

          {/* Tendances du marché */}
<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Tendances du Marché
  </h3>
  <div className="space-y-4">
    {data.tendances.map((trend, index) => {
      // Détection du type pour définir l'icône/couleur
      const isCroissance = trend.title.toLowerCase().includes('croissance')
      const isDemande = trend.title.toLowerCase().includes('demande')

      const iconColor = isCroissance ? 'text-green-500' : isDemande ? 'text-blue-500' : 'text-gray-500'
      const bgColor = isCroissance ? 'bg-green-50 dark:bg-green-900/10' : isDemande ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-gray-100 dark:bg-gray-700'
      const borderColor = isCroissance ? 'border-green-300' : isDemande ? 'border-blue-300' : 'border-gray-300'

      return (
        <div
          key={index}
          className={`flex items-start space-x-3 p-4 border rounded-lg ${borderColor} ${bgColor}`}
        >
          <BarChart3 className={`h-5 w-5 mt-1 ${iconColor}`} />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {trend.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {trend.detail}
            </p>
          </div>
        </div>
      )
    })}
  </div>
</div>



          </div>
        )
      
      case 'conseils':
  return (
    <div className="space-y-6">
      {/* Bloc principal des recommandations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plan d'Action Personnalisé</h3>
        <div className="space-y-4">
          {data.recommandations.map((rec, index) => {
            const couleurPastille = rec.priority === 'high'
              ? 'bg-red-500'
              : rec.priority === 'medium'
              ? 'bg-yellow-500'
              : 'bg-green-500'

            const badgeStyle = rec.priority === 'high'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              : rec.priority === 'medium'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'

            const label = rec.priority === 'high'
              ? 'Priorité élevée'
              : rec.priority === 'medium'
              ? 'Priorité moyenne'
              : 'Priorité faible'

            return (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${couleurPastille}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${badgeStyle}`}>
                      {label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Prochaines étapes dynamiques */}
{data.etapes && data.etapes.length > 0 && (
  <div className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Prochaines Étapes</h3>
    <div className="space-y-3">
      {data.etapes.map((etape, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {etape.numero}
          </div>
          <p className="text-gray-700 dark:text-gray-300">{etape.contenu}</p>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-cyan-400 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Analyse Salariale</h2>
              <p className="opacity-90">{data.jobTitle} • {data.location}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
