import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Clock, Play, Square, Calendar as CalendarIcon, Activity, CheckCircle, XCircle } from 'lucide-react';
import { DataTable } from '@/shared/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import { toast } from 'sonner';

export function PointagePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const pointages = useEmployeeStore((state) => state.pointages);
  const employees = useEmployeeStore((state) => state.employees);
  const addPointage = useEmployeeStore((state) => state.addPointage);
  const updatePointage = useEmployeeStore((state) => state.updatePointage);
  const getWorkSchedulesByEmployee = useEmployeeStore(state => state.getWorkSchedulesByEmployee);
  
  const currentUser = useEmployeeStore(state => state.currentUser);
  const CURRENT_USER_ID = currentUser?.id || 'EMP-001'; 
  const isAdmin = currentUser?.systemRole === 'ADMIN';

  const todayDateStr = '2026-07-28';
  
  const myPointages = pointages.filter(p => p.employeeId === CURRENT_USER_ID).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const myPointageToday = myPointages.find(p => p.date === todayDateStr);
  
  const isCheckedIn = myPointageToday !== undefined && myPointageToday.checkOut === null;
  const hasCompletedDay = myPointageToday !== undefined && myPointageToday.checkOut !== null;

  const workSchedules = getWorkSchedulesByEmployee(CURRENT_USER_ID);
  const todaySchedule = workSchedules.find(ws => ws.date === todayDateStr);
  
  let isRemote = false;
  if (todaySchedule) {
    isRemote = todaySchedule.mode === 'remote';
  } else if (currentUser && currentUser.weeklySchedule) {
    const dayOfWeek = new Date(todayDateStr).getDay(); // 0 = Sunday, 1 = Monday...
    const mapDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek] as keyof typeof currentUser.weeklySchedule;
    isRemote = currentUser.weeklySchedule[mapDay] === 'remote';
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePointage = () => {
    const timeStr = currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    if (!myPointageToday) {
      addPointage({
        employeeId: CURRENT_USER_ID,
        date: todayDateStr,
        checkIn: timeStr,
        checkOut: null,
        status: 'present',
        source: 'app'
      });
      toast.success(`Entrée pointée à ${timeStr}`);
    } else if (isCheckedIn) {
      updatePointage(myPointageToday.id, timeStr);
      toast.success(`Sortie pointée à ${timeStr}`);
    }
  };

  // --- Données pour ADMIN ---
  const todayPointagesAdmin = employees.map(emp => {
    const p = pointages.find(p => p.employeeId === emp.id && p.date === todayDateStr);
    return {
      id: emp.id,
      employee: emp,
      pointage: p
    };
  });

  const columnsAdmin: ColumnDef<typeof todayPointagesAdmin[0]>[] = [
    {
      id: 'employee',
      accessorFn: (row) => `${row.employee.firstName} ${row.employee.lastName}`,
      header: 'Employé',
      cell: ({ row }) => {
        const emp = row.original.employee;
        return (
          <div className="flex items-center gap-3">
            <img src={emp.avatarUrl} alt={emp.firstName} className="h-8 w-8 rounded-full" />
            <span className="font-medium">{emp.firstName} {emp.lastName}</span>
          </div>
        );
      }
    },
    {
      id: 'status',
      accessorFn: (row) => row.pointage?.status,
      header: 'Statut du jour',
      cell: ({ row }) => {
        const p = row.original.pointage;
        if (!p) return <Badge variant="outline">Non pointé</Badge>;
        
        const statusMap = {
          present: { label: 'Présent', color: 'bg-green-100 text-green-700' },
          late: { label: 'En retard', color: 'bg-orange-100 text-orange-700' },
          absent: { label: 'Absent', color: 'bg-red-100 text-red-700' },
        };
        const s = statusMap[p.status];
        return <Badge className={s.color} variant="secondary">{s.label}</Badge>;
      }
    },
    {
      id: 'checkIn',
      accessorFn: (row) => row.pointage?.checkIn,
      header: 'Heure d\'entrée',
      cell: ({ row }) => row.original.pointage?.checkIn || '-'
    },
    {
      id: 'checkOut',
      accessorFn: (row) => row.pointage?.checkOut,
      header: 'Heure de sortie',
      cell: ({ row }) => row.original.pointage?.checkOut || '-'
    },
  ];

  // --- Données pour EMPLOYEE ---
  const columnsEmployee: ColumnDef<typeof myPointages[0]>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const statusMap = {
          present: { label: 'Présent', color: 'bg-green-100 text-green-700' },
          late: { label: 'En retard', color: 'bg-orange-100 text-orange-700' },
          absent: { label: 'Absent', color: 'bg-red-100 text-red-700' },
        };
        const s = statusMap[row.original.status];
        return <Badge className={s.color} variant="secondary">{s.label}</Badge>;
      }
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => row.original.source === 'machine' ? (
        <Badge variant="outline">Machine</Badge>
      ) : row.original.source === 'app' ? (
        <Badge variant="outline">Application</Badge>
      ) : (
        <Badge variant="outline">N/A</Badge>
      )
    },
    {
      accessorKey: 'checkIn',
      header: 'Entrée',
      cell: ({ row }) => row.original.checkIn || '-'
    },
    {
      accessorKey: 'checkOut',
      header: 'Sortie',
      cell: ({ row }) => row.original.checkOut || '-'
    },
  ];

  // Stats for employee
  const currentMonthPointages = myPointages.filter(p => p.date.startsWith('2026-07'));
  const daysPresent = currentMonthPointages.filter(p => p.status === 'present').length;
  const daysLate = currentMonthPointages.filter(p => p.status === 'late').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Pointage</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Gérez le temps de présence de vos collaborateurs." : "Gérez vos présences et consultez votre historique."}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Widget Horloge */}
          <Card className="border-none shadow-sm md:col-span-1">
            <CardContent className="p-0 h-full flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed w-full h-full">
                <div className="h-40 w-40 rounded-full border-4 flex items-center justify-center mb-8 relative bg-white dark:bg-card shadow-sm border-[#1B4591]/20">
                  <div className="text-3xl font-bold tracking-wider text-[#1B4591] dark:text-white">
                    {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="absolute -bottom-3 bg-[#1B4591] text-white text-xs px-3 py-1 rounded-full font-medium">
                    {currentTime.toLocaleTimeString('fr-FR', { second: '2-digit' })}s
                  </div>
                </div>

                {!isRemote ? (
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-2">
                      <CalendarIcon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg text-[#1B4591] dark:text-blue-400">Présentiel aujourd'hui</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Vous êtes en mode présentiel. Votre pointage sera synchronisé automatiquement depuis la badgeuse (API).
                    </p>
                    <Button disabled className="mt-4 w-64 bg-slate-200 text-slate-500">Pointage désactivé (App)</Button>
                  </div>
                ) : hasCompletedDay ? (
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg text-green-600">Journée terminée</h3>
                    <p className="text-muted-foreground text-sm">Vous avez effectué tous vos pointages pour aujourd'hui.</p>
                  </div>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={handlePointage}
                    className={`w-64 h-14 text-lg font-semibold rounded-xl transition-all shadow-md hover:shadow-lg ${
                      isCheckedIn 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-[#1B4591] hover:bg-[#163A79] text-white'
                    }`}
                  >
                    {isCheckedIn ? (
                      <><Square className="mr-2 h-5 w-5 fill-current" /> Pointer la sortie</>
                    ) : (
                      <><Play className="mr-2 h-5 w-5 fill-current" /> Pointer l'entrée</>
                    )}
                  </Button>
                )}
                
                {isRemote && !hasCompletedDay && (
                  <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {isCheckedIn ? 'N\'oubliez pas de pointer en partant' : 'Prêt à commencer votre journée en télétravail ?'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {isAdmin ? (
            /* Tableau du jour pour ADMIN */
            <Card className="md:col-span-2 border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Présences d'aujourd'hui</CardTitle>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="mr-2 h-4 w-4" /> 28 Juillet 2026
                </Button>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={columnsAdmin} 
                  data={todayPointagesAdmin}
                />
              </CardContent>
            </Card>
          ) : (
            /* Stats + Historique pour EMPLOYEE */
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-none shadow-sm bg-green-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Jours Présents (Juillet)</p>
                        <h3 className="text-3xl font-bold text-green-700">{daysPresent}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-orange-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
                        <Activity className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Retards (Juillet)</p>
                        <h3 className="text-3xl font-bold text-orange-700">{daysLate}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Mon Historique de Pointages</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={columnsEmployee} 
                    data={myPointages}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
