import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore, Training, TrainingStatus } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, BookOpen, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { DataTable } from '@/shared/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { toast } from 'sonner';

export function TrainingPage() {
  const trainings = useEmployeeStore((state) => state.trainings);
  const employees = useEmployeeStore((state) => state.employees);
  const getEmployeeById = useEmployeeStore((state) => state.getEmployeeById);
  const addTraining = useEmployeeStore((state) => state.addTraining);
  const updateTrainingStatus = useEmployeeStore((state) => state.updateTrainingStatus);

  const [isOpen, setIsOpen] = useState(false);
  const [newTraining, setNewTraining] = useState<Partial<Training>>({
    employeeId: employees[0]?.id,
    title: '',
    provider: '',
    date: new Date().toISOString().split('T')[0],
    durationHours: 0,
  });

  const handleAdd = () => {
    if (!newTraining.employeeId || !newTraining.title || !newTraining.provider || !newTraining.date || !newTraining.durationHours) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    addTraining({
      employeeId: newTraining.employeeId,
      title: newTraining.title,
      provider: newTraining.provider,
      date: newTraining.date,
      durationHours: Number(newTraining.durationHours),
      status: 'scheduled'
    });
    
    toast.success('Formation assignée avec succès');
    setIsOpen(false);
    setNewTraining({ ...newTraining, title: '', provider: '', durationHours: 0 });
  };

  const columns: ColumnDef<Training>[] = [
    {
      id: 'employee',
      accessorFn: (row) => row.employeeId,
      header: 'Employé',
      cell: ({ row }) => {
        const emp = getEmployeeById(row.original.employeeId);
        if (!emp) return '-';
        return (
          <div className="flex items-center gap-3">
            <img src={emp.avatarUrl} alt={emp.firstName} className="h-8 w-8 rounded-full" />
            <span className="font-medium">{emp.firstName} {emp.lastName}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'title',
      header: 'Titre de la formation',
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>
    },
    {
      accessorKey: 'provider',
      header: 'Organisme',
    },
    {
      accessorKey: 'date',
      header: 'Date Prévue',
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString('fr-FR')
    },
    {
      accessorKey: 'durationHours',
      header: 'Durée',
      cell: ({ row }) => <span>{row.original.durationHours}h</span>
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const statusMap = {
          'scheduled': { label: 'Programmée', color: 'bg-yellow-100 text-yellow-700' },
          'in-progress': { label: 'En cours', color: 'bg-blue-100 text-blue-700' },
          'completed': { label: 'Terminée', color: 'bg-green-100 text-green-700' },
          'cancelled': { label: 'Annulée', color: 'bg-red-100 text-red-700' },
        };
        const s = statusMap[row.original.status];
        return <Badge className={s.color} variant="secondary">{s.label}</Badge>;
      }
    },
    {
      id: 'actions',
      accessorFn: () => null,
      header: 'Actions',
      cell: ({ row }) => {
        const t = row.original;
        if (t.status === 'completed' || t.status === 'cancelled') return <span className="text-muted-foreground text-sm">Clôturée</span>;
        
        return (
          <div className="flex gap-2">
            {t.status === 'scheduled' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  updateTrainingStatus(t.id, 'in-progress');
                  toast.success('Formation démarrée');
                }}
              >
                Démarrer
              </Button>
            )}
            {t.status === 'in-progress' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => {
                  updateTrainingStatus(t.id, 'completed');
                  toast.success('Formation terminée');
                }}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Valider
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  const totalHours = trainings.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.durationHours, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Formation & Développement</h1>
            <p className="text-muted-foreground mt-1">Gérez le plan de développement des compétences de vos équipes.</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B4591] hover:bg-[#163A79] text-white">
                <Plus className="mr-2 h-4 w-4" /> Assigner une formation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Assigner une formation</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Employé *</Label>
                  <Select value={newTraining.employeeId} onValueChange={(v) => setNewTraining({...newTraining, employeeId: v})}>
                    <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                    <SelectContent>
                      {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Intitulé de la formation *</Label>
                  <Input value={newTraining.title} onChange={(e) => setNewTraining({...newTraining, title: e.target.value})} placeholder="Ex: React Avancé" />
                </div>
                <div className="space-y-2">
                  <Label>Organisme / Plateforme *</Label>
                  <Input value={newTraining.provider} onChange={(e) => setNewTraining({...newTraining, provider: e.target.value})} placeholder="Ex: Udemy, Coursera..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date prévue *</Label>
                    <Input type="date" value={newTraining.date} onChange={(e) => setNewTraining({...newTraining, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Durée (heures) *</Label>
                    <Input type="number" value={newTraining.durationHours} onChange={(e) => setNewTraining({...newTraining, durationHours: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
                <Button onClick={handleAdd} className="bg-[#1B4591] text-white">Assigner</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Formations Programmées</CardTitle>
              <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{trainings.filter(t => t.status === 'scheduled').length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Formations Complétées</CardTitle>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{trainings.filter(t => t.status === 'completed').length}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Heures de formation (Total)</CardTitle>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalHours}h</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-card border rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 px-1">Plan de formation actuel</h2>
          <DataTable columns={columns} data={trainings} />
        </div>
      </div>
    </DashboardLayout>
  );
}
