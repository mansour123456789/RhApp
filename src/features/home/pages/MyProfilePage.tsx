import React from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Mail, Phone, Building, Briefcase, Calendar, ChevronLeft, ChevronRight, Laptop, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function MyProfilePage() {
  const currentUser = useEmployeeStore(state => state.currentUser);
  const pointages = useEmployeeStore(state => state.getPointagesByEmployee(currentUser?.id || ''));
  const leaveRequests = useEmployeeStore(state => state.getLeaveRequestsByEmployee(currentUser?.id || ''));
  const holidays = useEmployeeStore(state => state.holidays);
  const workSchedules = useEmployeeStore(state => state.getWorkSchedulesByEmployee(currentUser?.id || ''));

  const [currentDate, setCurrentDate] = React.useState(new Date('2026-07-01')); // Align with mock data

  if (!currentUser) return null;

  const totalLeavesTaken = leaveRequests.filter(r => r.status === 'approved').reduce((acc, req) => {
    const days = Math.ceil((new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / (1000 * 3600 * 24));
    return acc + (days > 0 ? days : 1);
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Mon Profil</h1>
          <p className="text-muted-foreground mt-1">Vos informations personnelles et professionnelles.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card Profil Principal */}
          <Card className="md:col-span-1 border-none shadow-sm">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg bg-slate-100">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.firstName} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-[#1B4591] flex items-center justify-center text-white text-3xl font-bold">
                    {currentUser.firstName.charAt(0)}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold">{currentUser.firstName} {currentUser.lastName}</h2>
              <p className="text-[#1B4591] font-medium mt-1">{currentUser.position}</p>
              
              <div className="mt-4 flex gap-2">
                <Badge className={
                  currentUser.status === 'active' ? 'bg-green-100 text-green-700' :
                  currentUser.status === 'leave' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                } variant="secondary">
                  {currentUser.status === 'active' ? 'Actif' : currentUser.status === 'leave' ? 'En congé' : 'Absent'}
                </Badge>
                <Badge variant="outline">{currentUser.contractType}</Badge>
              </div>

              <div className="w-full mt-6 space-y-3 text-sm text-left">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4" /> <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4" /> <span>{currentUser.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Building className="h-4 w-4" /> <span>{currentUser.department}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Infos secondaires */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Informations RH</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date d'embauche</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#1B4591]" />
                    {new Date(currentUser.hireDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ancienneté</p>
                  <p className="font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#1B4591]" />
                    {Math.floor((new Date().getTime() - new Date(currentUser.hireDate).getTime()) / (1000 * 3600 * 24 * 365))} ans
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Solde Congés Restants</p>
                  <p className="font-medium text-lg text-[#1B4591]">
                    {25 - totalLeavesTaken} jours
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pointages ce mois</p>
                  <p className="font-medium text-lg text-[#1B4591]">
                    {pointages.length} jours
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Derniers Pointages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pointages.slice(0, 3).map(p => (
                    <div key={p.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div className="font-medium">
                        {new Date(p.date).toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-muted-foreground">In: {p.checkIn || '--:--'}</span>
                        <span className="text-muted-foreground">Out: {p.checkOut || '--:--'}</span>
                      </div>
                    </div>
                  ))}
                  {pointages.length === 0 && <p className="text-muted-foreground text-sm">Aucun pointage récent.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Global Calendar */}
        <Card className="border-none shadow-sm mt-6">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div>
              <CardTitle className="text-lg">Mon Calendrier Global</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Méthode de travail, congés et pointages.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() - 1); setCurrentDate(d); }}><ChevronLeft className="h-4 w-4" /></Button>
              <h2 className="text-xl font-bold capitalize w-40 text-center">{currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
              <Button variant="outline" size="icon" onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() + 1); setCurrentDate(d); }}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                <div key={d} className="p-3 text-center text-sm font-semibold text-muted-foreground border-r last:border-r-0 bg-slate-50/50 dark:bg-card">
                  {d}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 bg-white dark:bg-sidebar">
              {(() => {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                let firstDay = new Date(year, month, 1).getDay();
                firstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

                const cells = [];
                for (let i = 0; i < firstDay; i++) {
                  cells.push(<div key={`empty-${i}`} className="min-h-[100px] p-2 border-b border-r bg-slate-50/30 dark:bg-slate-900/10"></div>);
                }

                for (let d = 1; d <= daysInMonth; d++) {
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                  
                  // Check status
                  let status = null;
                  const isHoliday = holidays.find(h => h.date === dateStr);
                  const isLeave = leaveRequests.find(lr => lr.status === 'approved' && dateStr >= lr.startDate && dateStr <= lr.endDate);
                  const ws = workSchedules.find(w => w.date === dateStr);
                  const pt = pointages.find(p => p.date === dateStr && p.status === 'present');

                  if (isHoliday) {
                    status = { type: 'holiday', label: isHoliday.name, color: 'bg-gray-100 text-gray-700 border-gray-200' };
                  } else if (isLeave) {
                    status = { type: 'leave', label: 'Congé', color: 'bg-red-100 text-red-700 border-red-200' };
                  } else if (ws) {
                    if (ws.mode === 'remote') status = { type: 'remote', label: 'Télétravail', color: 'bg-green-100 text-green-700 border-green-200' };
                    else status = { type: 'onsite', label: 'Présentiel', color: 'bg-blue-100 text-blue-700 border-blue-200' };
                  } else {
                    const dObj = new Date(year, month, d);
                    const isWeekend = dObj.getDay() === 0 || dObj.getDay() === 6;
                    if (!isWeekend) {
                      // Check recurring weekly schedule
                      if (currentUser && currentUser.weeklySchedule) {
                        const mapDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dObj.getDay()] as keyof typeof currentUser.weeklySchedule;
                        const recurringMode = currentUser.weeklySchedule[mapDay];
                        if (recurringMode === 'remote') {
                          status = { type: 'remote', label: 'Télétravail', color: 'bg-green-100 text-green-700 border-green-200' };
                        } else {
                          status = { type: 'onsite', label: 'Présentiel', color: 'bg-blue-100 text-blue-700 border-blue-200' };
                        }
                      } else {
                        // Default to onsite
                        status = { type: 'onsite', label: 'Présentiel', color: 'bg-blue-100 text-blue-700 border-blue-200' };
                      }
                    }
                  }

                  cells.push(
                    <div key={d} className="min-h-[100px] p-2 border-b border-r relative flex flex-col items-center hover:bg-slate-50/50 transition-colors">
                      <span className="text-sm font-medium text-foreground mb-1">
                        {d}
                      </span>
                      {status && (
                        <div className={`w-full text-center text-xs font-medium py-1 rounded border ${status.color}`}>
                          <div className="flex items-center justify-center gap-1">
                            {status.type === 'remote' && <Laptop className="h-3 w-3" />}
                            {status.type === 'onsite' && <Building className="h-3 w-3" />}
                            {status.label}
                          </div>
                        </div>
                      )}
                      {pt && (
                        <div className="absolute top-2 right-2 text-green-600" title="Pointage effectué">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                }
                
                // fill remaining cells to complete the grid row
                while (cells.length % 7 !== 0) {
                  cells.push(<div key={`empty-end-${cells.length}`} className="min-h-[100px] p-2 border-b border-r bg-slate-50/30 dark:bg-slate-900/10"></div>);
                }

                return cells;
              })()}
            </div>
            
            <div className="p-4 flex gap-4 text-xs text-muted-foreground border-t">
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></span> Présentiel</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></span> Télétravail</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></span> Congé</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300"></span> Férié</div>
              <div className="flex items-center gap-1 ml-auto"><CheckCircle2 className="h-4 w-4 text-green-600" /> Pointage effectué</div>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
