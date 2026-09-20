import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Plus } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function CalendarPage() {
  const holidays = useEmployeeStore((state) => state.holidays);
  const addHoliday = useEmployeeStore((state) => state.addHoliday);
  const leaveRequests = useEmployeeStore((state) => state.leaveRequests);
  const getEmployeeById = useEmployeeStore((state) => state.getEmployeeById);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Juillet 2026 for mock data alignment
  const [isOpen, setIsOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const today = () => setCurrentDate(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  
  // Prepare events map
  const eventsByDay = new Map<number, any[]>();
  
  // Add holidays
  holidays.forEach(h => {
    const d = new Date(h.date);
    if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
      const day = d.getDate();
      if (!eventsByDay.has(day)) eventsByDay.set(day, []);
      eventsByDay.get(day)?.push({ type: 'holiday', title: h.name, id: h.id });
    }
  });

  // Add approved leaves
  leaveRequests.filter(lr => lr.status === 'approved').forEach(lr => {
    const start = new Date(lr.startDate);
    const end = new Date(lr.endDate);
    const emp = getEmployeeById(lr.employeeId);
    
    // Simple logic: if start and end are in the same month
    // For a real app, you'd iterate days between start and end
    if (start.getMonth() === currentDate.getMonth() && start.getFullYear() === currentDate.getFullYear()) {
      for (let d = start.getDate(); d <= Math.min(end.getDate(), daysInMonth); d++) {
        if (!eventsByDay.has(d)) eventsByDay.set(d, []);
        eventsByDay.get(d)?.push({ 
          type: 'leave', 
          title: `${emp?.firstName} (${lr.type})`,
          id: lr.id 
        });
      }
    }
  });

  const handleAddHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    addHoliday(newHoliday);
    toast.success('Jour férié ajouté');
    setIsOpen(false);
    setNewHoliday({ name: '', date: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 h-full flex flex-col">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Calendrier Global</h1>
            <p className="text-muted-foreground mt-1">Gérez les jours fériés et visualisez les congés de l'équipe.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={today}>Aujourd'hui</Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1B4591] hover:bg-[#163A79] text-white">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter Férié
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>Nouveau Jour Férié</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input value={newHoliday.name} onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})} placeholder="Ex: Fête de l'Indépendance" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input type="date" value={newHoliday.date} onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddHoliday} className="bg-[#1B4591] text-white">Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Card className="border-none shadow-sm flex-1 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <h2 className="text-xl font-bold capitalize w-48 text-center">{monthName}</h2>
              <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></span> Jours Fériés</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></span> Congés</div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="grid grid-cols-7 h-full">
              {/* Header */}
              {DAYS.map(d => (
                <div key={d} className="p-3 text-center text-sm font-semibold text-muted-foreground border-b border-r bg-slate-50/50 dark:bg-card">
                  {d}
                </div>
              ))}
              
              {/* Padding for first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[120px] p-2 border-b border-r bg-slate-50/30"></div>
              ))}
              
              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
                const events = eventsByDay.get(day) || [];

                return (
                  <div key={day} className={`min-h-[120px] p-2 border-b border-r hover:bg-slate-50/50 transition-colors ${isToday ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-[#1B4591] text-white' : 'text-foreground'}`}>
                        {day}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {events.map((evt, idx) => (
                        <div 
                          key={`${evt.id}-${idx}`} 
                          className={`text-xs px-2 py-1 rounded truncate shadow-sm border ${
                            evt.type === 'holiday' 
                              ? 'bg-red-50 border-red-100 text-red-700 font-medium' 
                              : 'bg-blue-50 border-blue-100 text-blue-700'
                          }`}
                          title={evt.title}
                        >
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
