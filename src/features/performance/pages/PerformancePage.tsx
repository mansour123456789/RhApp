import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore, Evaluation, Objective, EvaluationStatus, ObjectiveStatus } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Target, Award, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { DataTable } from '@/shared/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Progress } from '@/shared/ui/progress';
import { toast } from 'sonner';

export function PerformancePage() {
  const employees = useEmployeeStore((state) => state.employees);
  const getEmployeeById = useEmployeeStore((state) => state.getEmployeeById);
  
  const evaluations = useEmployeeStore((state) => state.evaluations);
  const addEvaluation = useEmployeeStore((state) => state.addEvaluation);
  
  const objectives = useEmployeeStore((state) => state.objectives);
  const addObjective = useEmployeeStore((state) => state.addObjective);
  const updateObjectiveProgress = useEmployeeStore((state) => state.updateObjectiveProgress);

  const [isAddObjOpen, setIsAddObjOpen] = useState(false);
  const [newObj, setNewObj] = useState<Partial<Objective>>({
    employeeId: employees[0]?.id,
    title: '',
    progress: 0,
    deadline: new Date().toISOString().split('T')[0],
  });

  const [isAddEvalOpen, setIsAddEvalOpen] = useState(false);
  const [newEval, setNewEval] = useState<Partial<Evaluation>>({
    employeeId: employees[0]?.id,
    date: new Date().toISOString().split('T')[0],
    evaluator: 'Manager',
  });

  const handleAddObjective = () => {
    if (!newObj.employeeId || !newObj.title || !newObj.deadline) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    addObjective({
      employeeId: newObj.employeeId,
      title: newObj.title,
      progress: 0,
      deadline: newObj.deadline,
      status: 'on-track'
    });
    
    toast.success('Objectif ajouté');
    setIsAddObjOpen(false);
    setNewObj({ ...newObj, title: '' });
  };

  const handleAddEvaluation = () => {
    if (!newEval.employeeId || !newEval.date || !newEval.evaluator) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    addEvaluation({
      employeeId: newEval.employeeId,
      date: newEval.date,
      evaluator: newEval.evaluator,
      score: 0,
      feedback: '',
      status: 'scheduled'
    });
    
    toast.success('Évaluation programmée');
    setIsAddEvalOpen(false);
  };

  const evalColumns: ColumnDef<Evaluation>[] = [
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
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString('fr-FR')
    },
    {
      accessorKey: 'evaluator',
      header: 'Évaluateur',
    },
    {
      accessorKey: 'score',
      header: 'Score',
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          {row.original.status === 'completed' ? `${row.original.score}/100` : '-'}
        </span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const statusMap = {
          'scheduled': { label: 'Programmée', color: 'bg-yellow-100 text-yellow-700' },
          'in-progress': { label: 'En cours', color: 'bg-blue-100 text-blue-700' },
          'completed': { label: 'Terminée', color: 'bg-green-100 text-green-700' },
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
        return (
          <Button variant="outline" size="sm" className="h-8">
            Détails
          </Button>
        );
      }
    }
  ];

  const objColumns: ColumnDef<Objective>[] = [
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
      header: 'Objectif',
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>
    },
    {
      accessorKey: 'deadline',
      header: 'Échéance',
      cell: ({ row }) => new Date(row.original.deadline).toLocaleDateString('fr-FR')
    },
    {
      accessorKey: 'progress',
      header: 'Progression',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.original.progress} className="w-[60px] h-2" />
          <span className="text-xs font-medium w-8">{row.original.progress}%</span>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const statusMap = {
          'on-track': { label: 'Dans les temps', color: 'bg-blue-100 text-blue-700' },
          'at-risk': { label: 'À risque', color: 'bg-red-100 text-red-700' },
          'completed': { label: 'Atteint', color: 'bg-green-100 text-green-700' },
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
        const o = row.original;
        if (o.status === 'completed') return <span className="text-muted-foreground text-sm">Validé</span>;
        
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-green-200 text-green-700 hover:bg-green-50"
            onClick={() => {
              updateObjectiveProgress(o.id, 100, 'completed');
              toast.success('Objectif atteint !');
            }}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> Marquer atteint
          </Button>
        );
      }
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Évaluations & Performance</h1>
            <p className="text-muted-foreground mt-1">Suivez les objectifs (OKR) et gérez les campagnes d'évaluation.</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddEvalOpen} onOpenChange={setIsAddEvalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-[#1B4591] text-[#1B4591] hover:bg-blue-50">
                  <Award className="mr-2 h-4 w-4" /> Prog. évaluation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Programmer une évaluation</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Employé *</Label>
                    <Select value={newEval.employeeId} onValueChange={(v) => setNewEval({...newEval, employeeId: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date prévue *</Label>
                    <Input type="date" value={newEval.date} onChange={(e) => setNewEval({...newEval, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Évaluateur *</Label>
                    <Input value={newEval.evaluator} onChange={(e) => setNewEval({...newEval, evaluator: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddEvalOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddEvaluation} className="bg-[#1B4591] text-white">Programmer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddObjOpen} onOpenChange={setIsAddObjOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1B4591] hover:bg-[#163A79] text-white">
                  <Plus className="mr-2 h-4 w-4" /> Nouvel Objectif
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Définir un nouvel objectif</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Employé *</Label>
                    <Select value={newObj.employeeId} onValueChange={(v) => setNewObj({...newObj, employeeId: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Titre de l'objectif *</Label>
                    <Input value={newObj.title} onChange={(e) => setNewObj({...newObj, title: e.target.value})} placeholder="Ex: Lancer le module X" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date d'échéance *</Label>
                    <Input type="date" value={newObj.deadline} onChange={(e) => setNewObj({...newObj, deadline: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddObjOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddObjective} className="bg-[#1B4591] text-white">Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Objectifs Atteints</CardTitle>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{objectives.filter(o => o.status === 'completed').length}</div>
              <p className="text-xs text-muted-foreground mt-1">Sur {objectives.length} objectifs totaux</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Objectifs à Risque</CardTitle>
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{objectives.filter(o => o.status === 'at-risk').length}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Éval. Programmées</CardTitle>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{evaluations.filter(e => e.status === 'scheduled').length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-card border rounded-xl p-4 shadow-sm">
          <Tabs defaultValue="objectives" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="objectives" className="data-[state=active]:bg-[#1B4591] data-[state=active]:text-white">Objectifs (OKR)</TabsTrigger>
              <TabsTrigger value="evaluations" className="data-[state=active]:bg-[#1B4591] data-[state=active]:text-white">Évaluations</TabsTrigger>
            </TabsList>
            <TabsContent value="objectives">
              <DataTable columns={objColumns} data={objectives} />
            </TabsContent>
            <TabsContent value="evaluations">
              <DataTable columns={evalColumns} data={evaluations} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
