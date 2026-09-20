import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { Users, UserCheck, CalendarOff, Clock } from 'lucide-react';
import { useEmployeeStore } from '@/shared/store/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export const DashboardPage: FC = () => {
  const employees = useEmployeeStore((state) => state.employees);
  const leaveRequests = useEmployeeStore((state) => state.leaveRequests);
  const updateLeaveRequestStatus = useEmployeeStore((state) => state.updateLeaveRequestStatus);
  const getEmployeeById = useEmployeeStore((state) => state.getEmployeeById);
  
  const pendingRequests = leaveRequests.filter(r => r.status === 'pending');
  
  const totalEmployees = employees.length;
  const presentEmployees = employees.filter(e => e.status === 'active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'leave').length;
  const absentEmployees = employees.filter(e => e.status === 'absent').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Tableau de bord RH</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de l'activité de vos collaborateurs aujourd'hui.</p>
        </header>
        
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Employés</CardTitle>
              <div className="h-10 w-10 bg-[#1B4591]/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-[#1B4591]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">+2 depuis le mois dernier</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Présents Aujourd'hui</CardTitle>
              <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{presentEmployees}</div>
              <p className="text-xs text-green-600 font-medium mt-1">Taux de présence: {Math.round((presentEmployees / totalEmployees) * 100)}%</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Congé</CardTitle>
              <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                <CalendarOff className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{onLeaveEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">Dont 1 retour prévu demain</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Absents / Retards</CardTitle>
              <div className="h-10 w-10 bg-red-500/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{absentEmployees}</div>
              <p className="text-xs text-red-600 font-medium mt-1">À justifier</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Widgets */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Assiduité de la semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { day: 'Lun', presents: Math.round(totalEmployees * 0.95), absents: Math.round(totalEmployees * 0.05) },
                    { day: 'Mar', presents: Math.round(totalEmployees * 0.98), absents: Math.round(totalEmployees * 0.02) },
                    { day: 'Mer', presents: Math.round(totalEmployees * 0.90), absents: Math.round(totalEmployees * 0.10) },
                    { day: 'Jeu', presents: presentEmployees, absents: onLeaveEmployees + absentEmployees },
                    { day: 'Ven', presents: 0, absents: 0 },
                  ]} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="presents" name="Présents" stackId="a" fill="#1B4591" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="absents" name="Absents/Congés" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Demandes en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {pendingRequests.length > 0 ? pendingRequests.map((req) => {
                  const emp = getEmployeeById(req.employeeId);
                  if (!emp) return null;
                  
                  return (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatarUrl} alt={emp.firstName} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-muted-foreground">
                            {req.type === 'Annual' ? 'Congé annuel' : req.type === 'Sick' ? 'Maladie' : 'Autre'} 
                            ({Math.ceil((new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / (1000 * 3600 * 24))}j)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                          onClick={() => {
                            updateLeaveRequestStatus(req.id, 'approved');
                            toast.success('Demande approuvée');
                          }}
                        >
                          ✓
                        </button>
                        <button 
                          className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                          onClick={() => {
                            updateLeaveRequestStatus(req.id, 'rejected');
                            toast.error('Demande refusée');
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Aucune demande en attente
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
