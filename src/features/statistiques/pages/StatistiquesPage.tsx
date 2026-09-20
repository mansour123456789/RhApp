import React from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

export function StatistiquesPage() {
  // Mock data pour les graphiques
  const attendanceData = [
    { month: 'Jan', presents: 95, absents: 5 },
    { month: 'Fév', presents: 92, absents: 8 },
    { month: 'Mar', presents: 98, absents: 2 },
    { month: 'Avr', presents: 90, absents: 10 },
    { month: 'Mai', presents: 96, absents: 4 },
    { month: 'Juin', presents: 85, absents: 15 },
    { month: 'Juil', presents: 70, absents: 30 },
  ];

  const leaveReasonData = [
    { name: 'Congé Annuel', value: 65, color: '#3b82f6' },
    { name: 'Maladie', value: 20, color: '#ef4444' },
    { name: 'Maternité/Paternité', value: 10, color: '#f59e0b' },
    { name: 'Sans Solde', value: 5, color: '#64748b' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Statistiques & Reporting</h1>
          <p className="text-muted-foreground mt-1">Analysez les tendances RH de votre entreprise.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Taux de présence vs absence */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Taux de Présence par Mois</CardTitle>
              <CardDescription>Évolution des présences sur l'année en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="presents" name="Présents (%)" stackId="a" fill="#1B4591" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="absents" name="Absents/Congés (%)" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Répartition des congés */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Répartition des Motifs d'Absence</CardTitle>
              <CardDescription>Analyse des types de congés pris cette année</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="h-[300px] w-full flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveReasonData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {leaveReasonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {leaveReasonData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    {entry.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trend des retards */}
          <Card className="border-none shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle>Évolution des Retards</CardTitle>
              <CardDescription>Nombre d'incidents de pointage par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData.map((d, i) => ({ month: d.month, retards: [12, 18, 5, 8, 14, 19, 22][i] }))} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="retards" name="Nb Retards" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
