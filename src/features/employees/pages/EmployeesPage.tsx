import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { DataTable } from '@/shared/components/ui/DataTable';
import { Button } from '@/shared/ui/button';
import { Plus, MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import { useEmployeeStore, Employee, EmployeeStatus, ContractType } from '@/shared/store/mock-data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { toast } from 'sonner';

export function EmployeesPage() {
  const navigate = useNavigate();
  const employees = useEmployeeStore((state) => state.employees);
  const addEmployee = useEmployeeStore((state) => state.addEmployee);
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
  const deleteEmployee = useEmployeeStore((state) => state.deleteEmployee);
  
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newEmployee, setNewEmployee] = React.useState<Partial<Employee>>({
    firstName: '', lastName: '', email: '', phone: '',
    department: '', position: '', status: 'active',
    contractType: 'CDI', hireDate: new Date().toISOString().split('T')[0]
  });
  
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<Partial<Employee> & { id: string }>({
    id: '', firstName: '', lastName: '', email: '', phone: '',
    department: '', position: '', status: 'active',
    contractType: 'CDI', hireDate: new Date().toISOString().split('T')[0]
  });

  const handleAddEmployee = () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    addEmployee({
      firstName: newEmployee.firstName!,
      lastName: newEmployee.lastName!,
      email: newEmployee.email!,
      phone: newEmployee.phone || '',
      department: newEmployee.department || '',
      position: newEmployee.position || '',
      status: newEmployee.status as EmployeeStatus || 'active',
      contractType: newEmployee.contractType as ContractType || 'CDI',
      hireDate: newEmployee.hireDate || new Date().toISOString().split('T')[0],
      avatarUrl: `https://i.pravatar.cc/150?u=new-${Date.now()}`,
      systemRole: 'EMPLOYEE'
    });
    
    toast.success('Employé ajouté avec succès');
    setIsAddOpen(false);
    setNewEmployee({
      firstName: '', lastName: '', email: '', phone: '',
      department: '', position: '', status: 'active',
      contractType: 'CDI', hireDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditEmployee = () => {
    if (!editingEmployee.firstName || !editingEmployee.lastName || !editingEmployee.email) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    updateEmployee(editingEmployee.id, {
      firstName: editingEmployee.firstName,
      lastName: editingEmployee.lastName,
      email: editingEmployee.email,
      department: editingEmployee.department,
      position: editingEmployee.position,
    });
    
    toast.success('Employé modifié avec succès');
    setIsEditOpen(false);
  };

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'firstName',
      header: 'Employé',
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-3">
            <img src={employee.avatarUrl} alt={employee.firstName} className="h-10 w-10 rounded-full" />
            <div>
              <div className="font-medium text-foreground">{employee.firstName} {employee.lastName}</div>
              <div className="text-xs text-muted-foreground">{employee.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'position',
      header: 'Poste',
    },
    {
      accessorKey: 'department',
      header: 'Département',
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap = {
          active: { label: 'Actif', color: 'bg-green-100 text-green-700 hover:bg-green-100' },
          leave: { label: 'En congé', color: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
          absent: { label: 'Absent', color: 'bg-red-100 text-red-700 hover:bg-red-100' },
          inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
        };
        const s = statusMap[status];
        return <Badge className={s.color} variant="secondary">{s.label}</Badge>;
      }
    },
    {
      id: 'actions',
      accessorFn: () => null,
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/employees/${employee.id}`)}>
                <Eye className="mr-2 h-4 w-4" /> Voir profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setEditingEmployee({
                  id: employee.id,
                  firstName: employee.firstName,
                  lastName: employee.lastName,
                  email: employee.email,
                  department: employee.department,
                  position: employee.position,
                });
                setIsEditOpen(true);
              }}>
                <Edit className="mr-2 h-4 w-4" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => {
                if(confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
                  deleteEmployee(employee.id);
                  toast.success('Employé supprimé');
                }
              }}>
                <Trash className="mr-2 h-4 w-4" /> Désactiver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Employés</h1>
            <p className="text-muted-foreground mt-1">Gérez votre base de données de collaborateurs.</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B4591] hover:bg-[#163A79] text-white">
                <Plus className="mr-2 h-4 w-4" /> Ajouter un employé
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un employé</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom *</Label>
                    <Input value={newEmployee.firstName} onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input value={newEmployee.lastName} onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Département</Label>
                  <Input value={newEmployee.department} onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Poste</Label>
                  <Input value={newEmployee.position} onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
                <Button onClick={handleAddEmployee} className="bg-[#1B4591] hover:bg-[#163A79] text-white">Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Modifier l'employé</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom *</Label>
                    <Input value={editingEmployee.firstName} onChange={(e) => setEditingEmployee({...editingEmployee, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input value={editingEmployee.lastName} onChange={(e) => setEditingEmployee({...editingEmployee, lastName: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={editingEmployee.email} onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Département</Label>
                  <Input value={editingEmployee.department} onChange={(e) => setEditingEmployee({...editingEmployee, department: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Poste</Label>
                  <Input value={editingEmployee.position} onChange={(e) => setEditingEmployee({...editingEmployee, position: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
                <Button onClick={handleEditEmployee} className="bg-[#1B4591] hover:bg-[#163A79] text-white">Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <div className="bg-white dark:bg-card border rounded-xl p-4 shadow-sm">
          <DataTable 
            columns={columns} 
            data={employees} 
            filterColumn="firstName" 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
