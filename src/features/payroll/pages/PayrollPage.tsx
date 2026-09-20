import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore, Payroll, PayrollStatus } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Banknote, Receipt, FileText, Download, CheckCircle2, Printer } from 'lucide-react';
import { DataTable } from '@/shared/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { toast } from 'sonner';
import { PayslipTemplate } from '../components/PayslipTemplate';

export function PayrollPage() {
  const payrolls = useEmployeeStore((state) => state.payrolls);
  const employees = useEmployeeStore((state) => state.employees);
  const getEmployeeById = useEmployeeStore((state) => state.getEmployeeById);
  const updatePayrollStatus = useEmployeeStore((state) => state.updatePayrollStatus);
  const generatePayroll = useEmployeeStore((state) => state.generatePayroll);

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [selectedPayroll, setSelectedPayroll] = React.useState<Payroll | null>(null);
  const payslipRef = React.useRef<HTMLDivElement>(null);

  const [newPayroll, setNewPayroll] = React.useState<Partial<Payroll>>({
    employeeId: employees[0]?.id,
    period: '2026-07',
    baseSalary: 2164.285,
    workedDays: 26,
  });

  const handleGenerate = () => {
    if (!newPayroll.employeeId || !newPayroll.period || !newPayroll.baseSalary) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    const base = Number(newPayroll.baseSalary);
    const workedDays = Number(newPayroll.workedDays || 26);
    
    // Calculs simulés pour coller au modèle
    const primePresence = 6.100;
    const primeTransport = 42.700;
    const primeEncouragement = 208.372;
    
    const cnssDeduction = 234.397;
    const irppDeduction = 376.958;
    const cssDeduction = 10.102;
    
    const net = base + primePresence + primeTransport + primeEncouragement - cnssDeduction - irppDeduction - cssDeduction;

    generatePayroll({
      employeeId: newPayroll.employeeId,
      period: newPayroll.period,
      workedDays: workedDays,
      baseSalary: base,
      primePresence,
      primeTransport,
      primeEncouragement,
      cnssDeduction,
      irppDeduction,
      cssDeduction,
      congeBalance: 8.43,
      netSalary: net,
      status: 'pending',
      issueDate: new Date().toISOString().split('T')[0]
    });
    
    toast.success('Fiche de paie détaillée générée');
    setIsAddOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  const totalNet = payrolls.reduce((acc, p) => acc + p.netSalary, 0);
  const totalBase = payrolls.reduce((acc, p) => acc + p.baseSalary, 0);
  const paidCount = payrolls.filter(p => p.status === 'paid').length;

  const columns: ColumnDef<Payroll>[] = [
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
      accessorKey: 'period',
      header: 'Période',
      cell: ({ row }) => {
        const [year, month] = row.original.period.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return <span className="capitalize">{date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>;
      }
    },
    {
      accessorKey: 'baseSalary',
      header: 'Salaire Base',
      cell: ({ row }) => formatCurrency(row.original.baseSalary)
    },
    {
      id: 'netSalary',
      accessorKey: 'netSalary',
      header: 'Net à payer',
      cell: ({ row }) => <span className="font-semibold text-foreground">{formatCurrency(row.original.netSalary)}</span>
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const statusMap = {
          pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
          paid: { label: 'Payé', color: 'bg-green-100 text-green-700' },
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
        const p = row.original;
        return (
          <div className="flex gap-2">
            {p.status === 'pending' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => {
                  updatePayrollStatus(p.id, 'paid');
                  toast.success('Paiement marqué comme effectué');
                }}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Payer
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => setSelectedPayroll(p)}
            >
              <FileText className="mr-2 h-4 w-4" /> Fiche
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
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Gestion de la Paie</h1>
            <p className="text-muted-foreground mt-1">Supervisez la masse salariale et générez les fiches de paie.</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B4591] hover:bg-[#163A79] text-white">
                <Plus className="mr-2 h-4 w-4" /> Générer les paies
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Générer une fiche de paie</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Employé *</Label>
                  <Select value={newPayroll.employeeId} onValueChange={(v) => {
                    const emp = getEmployeeById(v);
                    setNewPayroll({...newPayroll, employeeId: v, baseSalary: emp?.baseSalary || 5000}); // Auto-fill from Employee profile
                  }}>
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
                <div className="space-y-2">
                  <Label>Période *</Label>
                  <Input type="month" value={newPayroll.period} onChange={(e) => setNewPayroll({...newPayroll, period: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Jours Travaillés *</Label>
                  <Input type="number" step="0.5" value={newPayroll.workedDays} onChange={(e) => setNewPayroll({...newPayroll, workedDays: Number(e.target.value)})} />
                  <p className="text-xs text-muted-foreground">Calculé via l'historique de pointage</p>
                </div>
                <div className="space-y-2">
                  <Label>Salaire de base (MAD) *</Label>
                  <Input type="number" step="0.001" value={newPayroll.baseSalary} onChange={(e) => setNewPayroll({...newPayroll, baseSalary: Number(e.target.value)})} />
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-md border text-xs text-muted-foreground mt-2 space-y-1">
                  <p>Les primes (Présence, Transport, Encouragement) et les retenues (CNSS, IRPP, CSS) seront calculées automatiquement lors de la génération pour correspondre au format officiel.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
                <Button onClick={handleGenerate} className="bg-[#1B4591] hover:bg-[#163A79] text-white">Générer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Masse Salariale Nette</CardTitle>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Banknote className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{formatCurrency(totalNet)}</div>
              <p className="text-xs text-muted-foreground mt-1">Brut total: {formatCurrency(totalBase)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fiches générées</CardTitle>
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{payrolls.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Sur {employees.length} collaborateurs actifs</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paiements Effectués</CardTitle>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Receipt className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{paidCount}</div>
              <p className="text-xs text-green-600 font-medium mt-1">{(payrolls.length > 0 ? (paidCount / payrolls.length * 100).toFixed(0) : 0)}% de complétion</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-card border rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 px-1">Registres de paie - Juillet 2026</h2>
          <DataTable 
            columns={columns} 
            data={payrolls} 
          />
        </div>
      </div>

      <Dialog open={!!selectedPayroll} onOpenChange={(open) => !open && setSelectedPayroll(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between sticky top-0 bg-background z-10 pb-4 border-b">
            <DialogTitle>Visualisation du Bulletin</DialogTitle>
            <Button 
              className="mr-6 bg-[#1B4591] text-white hover:bg-[#163A79]"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" /> Imprimer le bulletin
            </Button>
          </DialogHeader>
          <div className="py-6 print:py-0 bg-slate-100 dark:bg-slate-900 flex justify-center overflow-x-auto print:bg-white">
            {selectedPayroll && (
              <div className="scale-90 origin-top sm:scale-100 print:scale-100">
                <PayslipTemplate 
                  ref={payslipRef}
                  payroll={selectedPayroll} 
                  employee={getEmployeeById(selectedPayroll.employeeId)!} 
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
