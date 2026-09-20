import React from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore, Candidate, CandidateStatus } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, MoreHorizontal, Mail, Calendar } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { toast } from 'sonner';

export function OnboardingPage() {
  const candidates = useEmployeeStore((state) => state.candidates);
  const addCandidate = useEmployeeStore((state) => state.addCandidate);

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newCandidate, setNewCandidate] = React.useState<Partial<Candidate>>({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    status: 'new',
    appliedDate: new Date().toISOString().split('T')[0]
  });

  const handleAddCandidate = () => {
    if (!newCandidate.firstName || !newCandidate.lastName || !newCandidate.email) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    addCandidate({
      firstName: newCandidate.firstName!,
      lastName: newCandidate.lastName!,
      email: newCandidate.email!,
      position: newCandidate.position || '',
      status: newCandidate.status as CandidateStatus || 'new',
      appliedDate: newCandidate.appliedDate || new Date().toISOString().split('T')[0]
    });
    
    toast.success('Candidat ajouté avec succès');
    setIsAddOpen(false);
    setNewCandidate({
      firstName: '', lastName: '', email: '', position: '', status: 'new', appliedDate: new Date().toISOString().split('T')[0]
    });
  };

  const columns: { id: CandidateStatus; title: string; color: string }[] = [
    { id: 'new', title: 'Nouveaux', color: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200' },
    { id: 'interview', title: 'Entretiens', color: 'bg-purple-50 dark:bg-purple-900/10 border-purple-200' },
    { id: 'hired', title: 'Embauchés (Onboarding)', color: 'bg-green-50 dark:bg-green-900/10 border-green-200' }
  ];

  const getCandidatesByStatus = (status: CandidateStatus) => {
    return candidates.filter(c => c.status === status);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Recrutement & Onboarding</h1>
            <p className="text-muted-foreground mt-1">Suivez les candidats et gérez l'intégration des nouveaux embauchés.</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B4591] hover:bg-[#163A79] text-white">
                <Plus className="mr-2 h-4 w-4" /> Ajouter un candidat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un candidat</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom *</Label>
                    <Input value={newCandidate.firstName} onChange={(e) => setNewCandidate({...newCandidate, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input value={newCandidate.lastName} onChange={(e) => setNewCandidate({...newCandidate, lastName: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={newCandidate.email} onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Poste visé</Label>
                  <Input value={newCandidate.position} onChange={(e) => setNewCandidate({...newCandidate, position: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select value={newCandidate.status} onValueChange={(v) => setNewCandidate({...newCandidate, status: v as CandidateStatus})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nouveau</SelectItem>
                      <SelectItem value="interview">Entretien</SelectItem>
                      <SelectItem value="offer">Offre</SelectItem>
                      <SelectItem value="hired">Embauché (Onboarding)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
                <Button onClick={handleAddCandidate} className="bg-[#1B4591] hover:bg-[#163A79] text-white">Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
          {columns.map(col => {
            const colsCandidates = getCandidatesByStatus(col.id);
            return (
              <div key={col.id} className={`min-w-[300px] w-[350px] rounded-xl border flex flex-col ${col.color}`}>
                <div className="p-4 border-b flex justify-between items-center bg-white/50 dark:bg-black/10 rounded-t-xl">
                  <h3 className="font-semibold text-foreground">{col.title}</h3>
                  <Badge variant="secondary" className="bg-white/80 dark:bg-black/20">{colsCandidates.length}</Badge>
                </div>
                
                <div className="p-4 flex-1 space-y-4 overflow-y-auto">
                  {colsCandidates.map(candidate => (
                    <Card key={candidate.id} className="cursor-pointer hover:shadow-md transition-shadow border-none shadow-sm">
                      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                        <div>
                          <CardTitle className="text-base">{candidate.firstName} {candidate.lastName}</CardTitle>
                          <div className="text-sm font-medium text-[#1B4591] dark:text-blue-400 mt-1">{candidate.position}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                          <Mail className="h-3 w-3" /> {candidate.email}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                          <Calendar className="h-3 w-3" /> {new Date(candidate.appliedDate).toLocaleDateString('fr-FR')}
                        </div>
                      </CardContent>
                      {col.id === 'hired' && (
                        <CardFooter className="p-4 pt-0">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-md p-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-green-600">Progression Onboarding</span>
                              <span>3/5 tâches</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 w-[60%] rounded-full" />
                            </div>
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
