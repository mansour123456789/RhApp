import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore, WorkMode, WorkSchedule } from '@/shared/store/mock-data';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Edit2, Laptop, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

export function PlanningPage() {
  const currentUser = useEmployeeStore(state => state.currentUser);
  const employees = useEmployeeStore((state) => state.employees);
  const workSchedules = useEmployeeStore((state) => state.workSchedules);
  const leaveRequests = useEmployeeStore((state) => state.leaveRequests);
  const holidays = useEmployeeStore((state) => state.holidays);
  const addWorkSchedule = useEmployeeStore((state) => state.addWorkSchedule);
  const updateWorkSchedule = useEmployeeStore((state) => state.updateWorkSchedule);

  const [currentWeekStart, setCurrentWeekStart] = useState(new Date('2026-07-27')); // Lundi 27 Juillet 2026
  
  const [selectedCell, setSelectedCell] = useState<{empId: string, date: string} | null>(null);
  const [editMode, setEditMode] = useState<WorkMode>('onsite');
  const [editDescription, setEditDescription] = useState('');

  if (currentUser?.systemRole !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  // Générer les 5 jours de la semaine (Lundi - Vendredi)
  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return {
      dateObj: d,
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('fr-FR', { weekday: 'long' }),
      dateFormatted: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    };
  });

  const nextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };

  const prevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };

  const getStatusForDay = (empId: string, dateStr: string) => {
    // 1. Check holidays
    const isHoliday = holidays.find(h => h.date === dateStr);
    if (isHoliday) return { type: 'holiday', label: isHoliday.name, color: 'bg-gray-100 text-gray-700 border-gray-200' };

    // 2. Check approved leaves
    const isLeave = leaveRequests.find(lr => 
      lr.employeeId === empId && 
      lr.status === 'approved' && 
      dateStr >= lr.startDate && 
      dateStr <= lr.endDate
    );
    if (isLeave) return { type: 'leave', label: 'Congé', color: 'bg-red-100 text-red-700 border-red-200' };

    // 3. Check work schedule
    const schedule = workSchedules.find(ws => ws.employeeId === empId && ws.date === dateStr);
    if (schedule) {
      if (schedule.mode === 'remote') {
        return { type: 'remote', label: 'Télétravail', color: 'bg-green-100 text-green-700 border-green-200', schedule };
      }
      return { type: 'onsite', label: 'Présentiel', color: 'bg-blue-100 text-blue-700 border-blue-200', schedule };
    }

    // Default to onsite
    return { type: 'onsite', label: 'Présentiel', color: 'bg-blue-100 text-blue-700 border-blue-200' };
  };

  const handleCellClick = (empId: string, dateStr: string, status: any) => {
    if (status.type === 'holiday' || status.type === 'leave') return; // Cannot edit holidays or leaves from here
    
    setSelectedCell({ empId, date: dateStr });
    setEditMode(status.schedule?.mode || 'onsite');
    setEditDescription(status.schedule?.description || '');
  };

  const handleSaveSchedule = () => {
    if (!selectedCell) return;
    
    const existing = workSchedules.find(ws => ws.employeeId === selectedCell.empId && ws.date === selectedCell.date);
    
    if (existing) {
      updateWorkSchedule(existing.id, { mode: editMode, description: editDescription });
    } else {
      addWorkSchedule({
        employeeId: selectedCell.empId,
        date: selectedCell.date,
        mode: editMode,
        description: editDescription
      });
    }
    
    toast.success('Planning mis à jour');
    setSelectedCell(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 flex flex-col h-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Planning d'équipe</h1>
            <p className="text-muted-foreground mt-1">Gérez le télétravail et le présentiel de vos collaborateurs.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-card border rounded-lg p-1 shadow-sm">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium px-4 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {weekDays[0].dateFormatted} - {weekDays[4].dateFormatted}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <Card className="border-none shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <div className="min-w-[800px]">
              {/* En-tête des jours */}
              <div className="grid grid-cols-6 border-b bg-slate-50 dark:bg-slate-900/50">
                <div className="p-4 font-medium text-muted-foreground border-r">Collaborateur</div>
                {weekDays.map((d, i) => (
                  <div key={i} className="p-4 text-center border-r last:border-r-0">
                    <div className="font-semibold text-foreground capitalize">{d.dayName}</div>
                    <div className="text-xs text-muted-foreground">{d.dateFormatted}</div>
                  </div>
                ))}
              </div>
              
              {/* Lignes du planning */}
              <div className="divide-y pb-24">
                {employees.map(emp => (
                  <div key={emp.id} className="grid grid-cols-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <div className="p-4 flex items-center gap-3 border-r bg-white dark:bg-card z-10 sticky left-0">
                      {emp.avatarUrl ? (
                         <img src={emp.avatarUrl} alt={emp.firstName} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-[#1B4591] text-white flex items-center justify-center font-bold text-xs">
                          {emp.firstName.charAt(0)}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="text-sm font-medium leading-none truncate">{emp.firstName} {emp.lastName}</div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">{emp.position}</div>
                      </div>
                    </div>
                    
                    {weekDays.map((d, i) => {
                      const status = getStatusForDay(emp.id, d.dateStr);
                      const canEdit = status.type === 'remote' || status.type === 'onsite';
                      
                      return (
                        <div 
                          key={i} 
                          onClick={() => handleCellClick(emp.id, d.dateStr, status)}
                          className={`p-2 border-r last:border-r-0 flex flex-col justify-center ${canEdit ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800' : 'cursor-not-allowed opacity-80'}`}
                        >
                          <div className={`w-full flex flex-col items-center justify-center text-xs font-medium py-2 rounded border ${status.color}`}>
                            <div className="flex items-center gap-1">
                              {status.type === 'remote' && <Laptop className="h-3 w-3" />}
                              {status.type === 'onsite' && <Building className="h-3 w-3" />}
                              {status.label}
                            </div>
                            {status.schedule?.description && (
                              <div className="text-[10px] opacity-80 font-normal mt-1 truncate w-full px-1 text-center">
                                {status.schedule.description}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Dialog Edition Méthode de travail */}
        <Dialog open={!!selectedCell} onOpenChange={(open) => !open && setSelectedCell(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la méthode de travail</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Mode de travail</Label>
                <Select value={editMode} onValueChange={(val: WorkMode) => setEditMode(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">🏢 Présentiel (Bureau)</SelectItem>
                    <SelectItem value="remote">💻 Télétravail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description / Motif (Optionnel)</Label>
                <Input 
                  placeholder="Ex: Réunion client, Focus day..." 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedCell(null)}>Annuler</Button>
              <Button onClick={handleSaveSchedule} className="bg-[#1B4591] hover:bg-[#163A79] text-white">
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}
