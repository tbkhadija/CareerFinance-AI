import Layout from '../../components/Layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/UI/Card'
import Button from '../../components/UI/Button'

export default function CoachingCarrierePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-6xl">🎯</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">
            Coaching Carrière
          </h1>
          <p className="text-lg text-gray-600">
            Obtenez un plan de carrière personnalisé et des scripts de négociation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vos objectifs professionnels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectif professionnel
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Ex: Devenir chef de projet dans les 2 prochaines années"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compétences clés
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: JavaScript, React, Node.js, Leadership"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secteur d'activité
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Technologie, Finance, Santé"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Button className="w-full">
                Générer mon plan de carrière
              </Button>
              <Button variant="outline" className="w-full">
                Script de négociation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}