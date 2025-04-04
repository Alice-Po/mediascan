import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const InformationAnalytics = () => {
  const [activeTab, setActiveTab] = useState('bulleInfo');

  // Données d'exemple
  const politicalData = [
    { name: 'Gauche', value: 30 },
    { name: 'Centre-gauche', value: 15 },
    { name: 'Centre', value: 20 },
    { name: 'Centre-droit', value: 25 },
    { name: 'Droite', value: 10 },
  ];

  const typeData = [
    { name: 'Mainstream', value: 65 },
    { name: 'Alternatif', value: 35 },
  ];

  const structureData = [
    { name: 'Institutionnel', value: 55 },
    { name: 'Indépendant', value: 45 },
  ];

  const scopeData = [
    { name: 'Généraliste', value: 60 },
    { name: 'Spécialisé', value: 40 },
  ];

  const radarData = [
    { subject: 'Politique', A: 65, fullMark: 100 },
    { subject: 'Économie', A: 85, fullMark: 100 },
    { subject: 'Culture', A: 25, fullMark: 100 },
    { subject: 'Sciences', A: 40, fullMark: 100 },
    { subject: 'International', A: 55, fullMark: 100 },
    { subject: 'Sport', A: 15, fullMark: 100 },
  ];

  const evolutionData = [
    { name: 'Jan', gauche: 30, centre: 40, droite: 30 },
    { name: 'Fév', gauche: 25, centre: 45, droite: 30 },
    { name: 'Mar', gauche: 20, centre: 45, droite: 35 },
    { name: 'Avr', gauche: 35, centre: 40, droite: 25 },
    { name: 'Mai', gauche: 40, centre: 35, droite: 25 },
    { name: 'Juin', gauche: 35, centre: 40, droite: 25 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Éléments personnalisés pour la visualisation "Bulle Info"
  const BulleInfo = () => (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-center">Votre bulle d'information</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-center">Orientation politique</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={politicalData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {politicalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-center">Type de médias</h4>
          <div className="flex flex-col gap-2">
            <div className="flex-1">
              <h5 className="text-md font-medium mb-1">Mainstream vs Alternatif</h5>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-blue-600 h-6 rounded-full text-white text-xs flex items-center justify-center"
                  style={{ width: `${typeData[0].value}%` }}
                >
                  {typeData[0].name} {typeData[0].value}%
                </div>
              </div>
            </div>
            <div className="flex-1 mt-4">
              <h5 className="text-md font-medium mb-1">Institutionnel vs Indépendant</h5>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-green-600 h-6 rounded-full text-white text-xs flex items-center justify-center"
                  style={{ width: `${structureData[0].value}%` }}
                >
                  {structureData[0].name} {structureData[0].value}%
                </div>
              </div>
            </div>
            <div className="flex-1 mt-4">
              <h5 className="text-md font-medium mb-1">Généraliste vs Spécialisé</h5>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-yellow-600 h-6 rounded-full text-white text-xs flex items-center justify-center"
                  style={{ width: `${scopeData[0].value}%` }}
                >
                  {scopeData[0].name} {scopeData[0].value}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Éléments personnalisés pour la visualisation "Radar des sujets"
  const RadarSujets = () => (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-center">Radar des sujets consultés</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Vous" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-4 p-4 bg-blue-50 rounded">
        <p className="font-semibold">Analyse:</p>
        <p>
          Vous consommez principalement des articles sur l'économie (85%) et la politique (65%).
          Votre intérêt pour la culture (25%) et le sport (15%) est beaucoup plus limité.
        </p>
        <p className="mt-2 font-medium text-blue-600">
          Suggestion: Diversifiez vos lectures avec plus de contenu culturel et scientifique pour un
          régime informationnel équilibré.
        </p>
      </div>
    </div>
  );

  // Éléments personnalisés pour la visualisation "Évolution mensuelle"
  const EvolutionMensuelle = () => (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-center">Évolution de votre consommation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={evolutionData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="gauche" stackId="a" fill="#0088FE" name="Gauche" />
          <Bar dataKey="centre" stackId="a" fill="#00C49F" name="Centre" />
          <Bar dataKey="droite" stackId="a" fill="#FF8042" name="Droite" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 p-4 bg-green-50 rounded">
        <p className="font-semibold">Tendance observée:</p>
        <p>
          Depuis janvier, vous avez progressivement augmenté votre consommation de sources de gauche
          (+10%), tout en réduisant légèrement votre lecture de sources de droite (-5%).
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-4 bg-blue-600 text-white">
          <h2 className="text-2xl font-bold">Votre diététique informationnelle</h2>
          <p className="opacity-90">Découvrez vos habitudes de consommation d'information</p>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-2 px-4 font-medium ${
              activeTab === 'bulleInfo'
                ? 'bg-blue-50 border-b-2 border-blue-600'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('bulleInfo')}
          >
            Bulle d'information
          </button>
          <button
            className={`flex-1 py-2 px-4 font-medium ${
              activeTab === 'radarSujets'
                ? 'bg-blue-50 border-b-2 border-blue-600'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('radarSujets')}
          >
            Radar des sujets
          </button>
          <button
            className={`flex-1 py-2 px-4 font-medium ${
              activeTab === 'evolution'
                ? 'bg-blue-50 border-b-2 border-blue-600'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('evolution')}
          >
            Évolution mensuelle
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'bulleInfo' && <BulleInfo />}
          {activeTab === 'radarSujets' && <RadarSujets />}
          {activeTab === 'evolution' && <EvolutionMensuelle />}
        </div>

        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Votre score de diversité: 68/100</h3>
              <p className="text-sm text-gray-600">Basé sur 127 articles consultés ce mois-ci</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Améliorer mon score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationAnalytics;
