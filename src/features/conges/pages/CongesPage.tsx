import React from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore, LeaveRequest, LeaveType, LeaveStatus } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Umbrella, HeartPulse, Stethoscope, FileText } from 'lucide-react';
import { DataTable } from '@/shared/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { toast } from 'sonner';

export function CongesPage() {
  const leaveRequests = useEmployeeStore((state) => state.leaveRequests);
  const employees = useEmployeeStore((state) => state.employees);
  const getEmployeeById = useEmployeeStore((state) => state.getEmployeeById);
  const addLeaveRequest = useEmployeeStore((state) => state.addLeaveRequest);
  const updateLeaveRequestStatus = useEmployeeStore((state) => state.updateLeaveRequestStatus);
  const currentUser = useEmployeeStore((state) => state.currentUser);
  const getLeaveRequestsByEmployee = useEmployeeStore((state) => state.getLeaveRequestsByEmployee);
  
  const isAdmin = currentUser?.systemRole === 'ADMIN';
  const myLeaves = currentUser ? getLeaveRequestsByEmployee(currentUser.id) : [];
  
  const calculateTakenDays = (type: string) => {
    return myLeaves
      .filter(r => r.type === type && (r.status === 'approved' || r.status === 'pending'))
      .reduce((acc, req) => {
        const days = Math.ceil((new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / (1000 * 3600 * 24));
        return acc + (days > 0 ? days : 1);
      }, 0);
  };

  const annualTaken = calculateTakenDays('Annual');
  const sickTaken = calculateTakenDays('Sick');
  const familyTaken = calculateTakenDays('Family');
  const unpaidTaken = calculateTakenDays('Unpaid');

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newRequest, setNewRequest] = React.useState<Partial<LeaveRequest>>({
    type: 'Annual',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    employeeId: isAdmin ? employees[0]?.id : currentUser?.id
  });

  const handleAddRequest = () => {
    if (!newRequest.employeeId || !newRequest.startDate || !newRequest.endDate) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    addLeaveRequest({
      employeeId: newRequest.employeeId,
      type: newRequest.type as LeaveType || 'Annual',
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      status: 'pending',
      reason: newRequest.reason || ''
    });
    
    toast.success('Demande de congé soumise avec succès');
    setIsAddOpen(false);
  };

  const columns: ColumnDef<LeaveRequest>[] = [
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
      accessorKey: 'type',
      header: 'Type de congé',
      cell: ({ row }) => {
        const typeMap = {
          Annual: 'Congé annuel',
          Sick: 'Congé maladie',
          Family: 'Congé familial',
          Unpaid: 'Sans solde'
        };
        return typeMap[row.original.type];
      }
    },
    {
      id: 'period',
      accessorFn: (row) => `${row.startDate} ${row.endDate}`,
      header: 'Période',
      cell: ({ row }) => {
        const r = row.original;
        return `${new Date(r.startDate).toLocaleDateString('fr-FR')} - ${new Date(r.endDate).toLocaleDateString('fr-FR')}`;
      }
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const statusMap = {
          pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
          approved: { label: 'Approuvé', color: 'bg-green-100 text-green-700' },
          rejected: { label: 'Refusé', color: 'bg-red-100 text-red-700' },
        };
        const s = statusMap[row.original.status];
        return <Badge className={s.color} variant="secondary">{s.label}</Badge>;
      }
    },
    ...(isAdmin ? [{
      id: 'actions',
      accessorFn: () => null,
      header: 'Actions',
      cell: ({ row }) => {
        const lr = row.original;
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" size="sm" 
              className="h-8 border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50"
              disabled={lr.status === 'approved'}
              onClick={() => {
                updateLeaveRequestStatus(lr.id, 'approved');
                toast.success('Demande approuvée');
              }}
            >
              Accepter
            </Button>
            <Button 
              variant="outline" size="sm" 
              className="h-8 border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50"
              disabled={lr.status === 'rejected'}
              onClick={() => {
                updateLeaveRequestStatus(lr.id, 'rejected');
                toast.error('Demande refusée');
              }}
            >
              Refuser
            </Button>
          </div>
        );
      }
    } as ColumnDef<LeaveRequest>] : [])
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Congés & Absences</h1>
            <p className="text-muted-foreground mt-1">Gérez les demandes de congés et consultez les soldes.</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B4591] hover:bg-[#163A79] text-white">
                <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nouvelle demande de congé</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {isAdmin && (
                  <div className="space-y-2">
                    <Label>Employé *</Label>
                    <Select value={newRequest.employeeId} onValueChange={(v) => setNewRequest({...newRequest, employeeId: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un employé" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(e => (
                          <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Type de congé *</Label>
                  <Select value={newRequest.type} onValueChange={(v) => setNewRequest({...newRequest, type: v as LeaveType})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Annual">Congé annuel</SelectItem>
                      <SelectItem value="Sick">Maladie</SelectItem>
                      <SelectItem value="Family">Congé familial</SelectItem>
                      <SelectItem value="Unpaid">Sans solde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de début *</Label>
                    <Input type="date" value={newRequest.startDate} onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de fin *</Label>
                    <Input type="date" value={newRequest.endDate} onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Motif</Label>
                  <Input value={newRequest.reason} onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})} placeholder="Facultatif" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
                <Button onClick={handleAddRequest} className="bg-[#1B4591] hover:bg-[#163A79] text-white">Soumettre</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        {/* Soldes de l'utilisateur */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Congé Annuel</CardTitle>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Umbrella className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{25 - annualTaken} j</div>
              <p className="text-xs text-muted-foreground mt-1">sur 25 acquis</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Maladie</CardTitle>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{sickTaken} j</div>
              <p className="text-xs text-muted-foreground mt-1">pris cette année</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Familial</CardTitle>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <HeartPulse className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{familyTaken} j</div>
              <p className="text-xs text-muted-foreground mt-1">pris cette année</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sans Solde</CardTitle>
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{unpaidTaken} j</div>
              <p className="text-xs text-muted-foreground mt-1">pris cette année</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-card border rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 px-1">{isAdmin ? "Demandes de l'équipe" : "Mon historique de congés"}</h2>
          <DataTable 
            columns={columns} 
            data={isAdmin ? leaveRequests : myLeaves} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
