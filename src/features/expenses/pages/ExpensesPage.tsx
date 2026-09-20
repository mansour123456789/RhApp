import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore, Expense, ExpenseCategory } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Receipt, Wallet, Plane, Utensils, CheckCircle2, XCircle } from 'lucide-react';
import { DataTable } from '@/shared/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { toast } from 'sonner';

export function ExpensesPage() {
  const expenses = useEmployeeStore((state) => state.expenses);
  const employees = useEmployeeStore((state) => state.employees);
  const getEmployeeById = useEmployeeStore((state) => state.getEmployeeById);
  const updateExpenseStatus = useEmployeeStore((state) => state.updateExpenseStatus);
  const addExpense = useEmployeeStore((state) => state.addExpense);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    employeeId: employees[0]?.id,
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: 'Transport',
    description: '',
  });

  const handleAdd = () => {
    if (!newExpense.employeeId || !newExpense.date || !newExpense.amount || !newExpense.description) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    addExpense({
      employeeId: newExpense.employeeId,
      date: newExpense.date,
      amount: Number(newExpense.amount),
      category: newExpense.category as ExpenseCategory,
      description: newExpense.description,
      status: 'pending'
    });
    
    toast.success('Note de frais soumise');
    setIsAddOpen(false);
    setNewExpense({ ...newExpense, amount: 0, description: '' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  const totalPending = expenses.filter(e => e.status === 'pending').reduce((acc, e) => acc + e.amount, 0);
  const totalApproved = expenses.filter(e => e.status === 'approved').reduce((acc, e) => acc + e.amount, 0);

  const columns: ColumnDef<Expense>[] = [
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
      accessorKey: 'category',
      header: 'Catégorie',
      cell: ({ row }) => {
        const icons = {
          Transport: <Plane className="h-4 w-4 mr-2 text-blue-500" />,
          Repas: <Utensils className="h-4 w-4 mr-2 text-orange-500" />,
          Hébergement: <Wallet className="h-4 w-4 mr-2 text-purple-500" />,
          Matériel: <Receipt className="h-4 w-4 mr-2 text-gray-500" />,
          Autre: <Receipt className="h-4 w-4 mr-2 text-gray-500" />
        };
        return (
          <div className="flex items-center">
            {icons[row.original.category as keyof typeof icons] || icons['Autre']}
            {row.original.category}
          </div>
        );
      }
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'amount',
      header: 'Montant',
      cell: ({ row }) => <span className="font-semibold text-foreground">{formatCurrency(row.original.amount)}</span>
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const statusMap = {
          pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
          approved: { label: 'Remboursée', color: 'bg-green-100 text-green-700' },
          rejected: { label: 'Refusée', color: 'bg-red-100 text-red-700' },
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
        const e = row.original;
        if (e.status !== 'pending') return <span className="text-muted-foreground text-sm">Traité</span>;
        
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => {
                updateExpenseStatus(e.id, 'approved');
                toast.success('Dépense approuvée');
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => {
                updateExpenseStatus(e.id, 'rejected');
                toast.error('Dépense refusée');
              }}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Notes de Frais</h1>
            <p className="text-muted-foreground mt-1">Gérez et remboursez les dépenses professionnelles de vos collaborateurs.</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B4591] hover:bg-[#163A79] text-white">
                <Plus className="mr-2 h-4 w-4" /> Nouvelle dépense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Soumettre une note de frais</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Employé *</Label>
                  <Select value={newExpense.employeeId} onValueChange={(v) => setNewExpense({...newExpense, employeeId: v})}>
                    <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                    <SelectContent>
                      {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input type="date" value={newExpense.date} onChange={(e) => setNewExpense({...newExpense, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Catégorie *</Label>
                    <Select value={newExpense.category} onValueChange={(v) => setNewExpense({...newExpense, category: v as ExpenseCategory})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Repas">Repas</SelectItem>
                        <SelectItem value="Hébergement">Hébergement</SelectItem>
                        <SelectItem value="Matériel">Matériel</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Montant (MAD) *</Label>
                  <Input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Input value={newExpense.description} onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} placeholder="Ex: Déjeuner client Dupont" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
                <Button onClick={handleAdd} className="bg-[#1B4591] hover:bg-[#163A79] text-white">Soumettre</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">À rembourser (En attente)</CardTitle>
              <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Receipt className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{formatCurrency(totalPending)}</div>
              <p className="text-xs text-yellow-600 mt-1">{expenses.filter(e => e.status === 'pending').length} demande(s)</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Remboursé</CardTitle>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{formatCurrency(totalApproved)}</div>
              <p className="text-xs text-green-600 mt-1">{expenses.filter(e => e.status === 'approved').length} demande(s)</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-card border rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 px-1">Dernières notes de frais</h2>
          <DataTable 
            columns={columns} 
            data={expenses} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
