import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore } from '@/shared/store/mock-data';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, Mail, Phone, Calendar, Briefcase, Clock, FileText } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { DataTable } from '@/shared/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Pointage, LeaveRequest, WorkMode } from '@/shared/store/mock-data';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';

export function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getEmployeeById = useEmployeeStore((state) => state.getEmployeeById);
  const getPointagesByEmployee = useEmployeeStore((state) => state.getPointagesByEmployee);
  const getLeaveRequestsByEmployee = useEmployeeStore((state) => state.getLeaveRequestsByEmployee);
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
  
  const employee = id ? getEmployeeById(id) : undefined;
  const pointages = id ? getPointagesByEmployee(id) : [];
  const leaveRequests = id ? getLeaveRequestsByEmployee(id) : [];

  const [weeklySchedule, setWeeklySchedule] = React.useState({
    monday: employee?.weeklySchedule?.monday || 'onsite',
    tuesday: employee?.weeklySchedule?.tuesday || 'onsite',
    wednesday: employee?.weeklySchedule?.wednesday || 'onsite',
    thursday: employee?.weeklySchedule?.thursday || 'onsite',
    friday: employee?.weeklySchedule?.friday || 'onsite',
  });

  const [adminData, setAdminData] = React.useState({
    cin: employee?.cin || '',
    cnssNumber: employee?.cnssNumber || '',
    category: employee?.category || '',
    echelon: employee?.echelon || 1,
    baseSalary: employee?.baseSalary || 0,
    regime: employee?.regime || 'Mensuel',
  });

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold">Employé introuvable</h2>
          <Button onClick={() => navigate('/employees')}>Retour à la liste</Button>
        </div>
      </DashboardLayout>
    );
  }

  const statusMap = {
    active: { label: 'Actif', color: 'bg-green-100 text-green-700 hover:bg-green-100' },
    leave: { label: 'En congé', color: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
    absent: { label: 'Absent', color: 'bg-red-100 text-red-700 hover:bg-red-100' },
    inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
  };

  const handleSaveSchedule = () => {
    if (employee) {
      updateEmployee(employee.id, { weeklySchedule });
      toast.success('Méthode de travail récurrente mise à jour');
    }
  };

  const handleSaveAdmin = () => {
    if (employee) {
      updateEmployee(employee.id, { 
        cin: adminData.cin,
        cnssNumber: adminData.cnssNumber,
        category: adminData.category,
        echelon: Number(adminData.echelon),
        baseSalary: Number(adminData.baseSalary),
        regime: adminData.regime
      });
      toast.success('Données administratives et paie mises à jour');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/employees')} className="pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux employés
        </Button>

        {/* En-tête profil */}
        <div className="bg-white dark:bg-card border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
          <img src={employee.avatarUrl} alt={employee.firstName} className="h-24 w-24 rounded-full border-4 border-white shadow-sm" />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h1>
              <Badge className={statusMap[employee.status].color} variant="secondary">
                {statusMap[employee.status].label}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mt-1">{employee.position} — {employee.department}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {employee.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {employee.phone}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Message</Button>
            <Button className="bg-[#1B4591] hover:bg-[#163A79]">Modifier</Button>
          </div>
        </div>

        {/* Onglets d'informations */}
        <Tabs defaultValue="infos" className="w-full">
          <TabsList className="bg-white dark:bg-sidebar border p-1 rounded-lg">
            <TabsTrigger value="infos" className="rounded-md">Informations</TabsTrigger>
            <TabsTrigger value="admin" className="rounded-md">Administratif & Paie</TabsTrigger>
            <TabsTrigger value="pointage" className="rounded-md">Pointage</TabsTrigger>
            <TabsTrigger value="conges" className="rounded-md">Congés</TabsTrigger>
            <TabsTrigger value="method" className="rounded-md">Méthode de travail</TabsTrigger>
          </TabsList>
          
          <TabsContent value="infos" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Détails Contrat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div className="text-muted-foreground">Type de contrat</div>
                    <div className="font-medium">{employee.contractType}</div>
                    
                    <div className="text-muted-foreground">Date d'embauche</div>
                    <div className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                    </div>
                    
                    <div className="text-muted-foreground">Département</div>
                    <div className="font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      {employee.department}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Horaire & Présence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div className="text-muted-foreground">Horaires normaux</div>
                    <div className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      08:00 - 17:00
                    </div>
                    
                    <div className="text-muted-foreground">Jours de travail</div>
                    <div className="font-medium">Lun - Ven</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="pointage" className="mt-4">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Historique de pointage</CardTitle>
              </CardHeader>
              <CardContent>
                {pointages.length > 0 ? (
                  <div className="space-y-4">
                    {pointages.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="font-medium">{new Date(p.date).toLocaleDateString('fr-FR')}</div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Entrée: {p.checkIn || '-'}</span>
                          <span>Sortie: {p.checkOut || '-'}</span>
                        </div>
                        <Badge variant="secondary" className={
                          p.status === 'present' ? 'bg-green-100 text-green-700' :
                          p.status === 'late' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }>
                          {p.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    Aucun pointage trouvé pour cet employé.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="conges" className="mt-4">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Historique des congés</CardTitle>
              </CardHeader>
              <CardContent>
                {leaveRequests.length > 0 ? (
                  <div className="space-y-4">
                    {leaveRequests.map(lr => (
                      <div key={lr.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{lr.type === 'Annual' ? 'Congé annuel' : lr.type === 'Sick' ? 'Congé maladie' : 'Congé familial'}</div>
                          <div className="text-xs text-muted-foreground">{new Date(lr.startDate).toLocaleDateString('fr-FR')} au {new Date(lr.endDate).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <Badge variant="secondary" className={
                          lr.status === 'approved' ? 'bg-green-100 text-green-700' :
                          lr.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }>
                          {lr.status === 'approved' ? 'Approuvé' : lr.status === 'pending' ? 'En attente' : 'Refusé'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    Aucune demande de congé trouvée.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="method" className="mt-4">
            <Card className="border-none shadow-sm max-w-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Méthode de travail hebdomadaire (Par défaut)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Définissez le rythme de travail récurrent de cet employé. Ce planning sera appliqué automatiquement s'il n'y a pas d'exceptions dans le calendrier global.
                </p>
                <div className="space-y-4">
                  {Object.entries(weeklySchedule).map(([day, mode]) => (
                    <div key={day} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <Label className="capitalize font-medium">{
                        day === 'monday' ? 'Lundi' :
                        day === 'tuesday' ? 'Mardi' :
                        day === 'wednesday' ? 'Mercredi' :
                        day === 'thursday' ? 'Jeudi' : 'Vendredi'
                      }</Label>
                      <Select 
                        value={mode} 
                        onValueChange={(val: WorkMode) => setWeeklySchedule(prev => ({ ...prev, [day]: val }))}
                      >
                        <SelectTrigger className="w-40 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onsite">🏢 Présentiel</SelectItem>
                          <SelectItem value="remote">💻 Télétravail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveSchedule} className="bg-[#1B4591] hover:bg-[#163A79]">
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="admin" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Identification Fiscale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>CIN (Carte d'Identité Nationale)</Label>
                    <Input value={adminData.cin} onChange={(e) => setAdminData({...adminData, cin: e.target.value})} placeholder="ex: AB123456" />
                  </div>
                  <div className="space-y-2">
                    <Label>N° CNSS (Sécurité Sociale)</Label>
                    <Input value={adminData.cnssNumber} onChange={(e) => setAdminData({...adminData, cnssNumber: e.target.value})} placeholder="ex: 1702437508" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Catégorie (Cat.)</Label>
                      <Input value={adminData.category} onChange={(e) => setAdminData({...adminData, category: e.target.value})} placeholder="ex: 1" />
                    </div>
                    <div className="space-y-2">
                      <Label>Échelon</Label>
                      <Input type="number" value={adminData.echelon} onChange={(e) => setAdminData({...adminData, echelon: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-md text-sm">
                    Le titre <b>TITULAIRE</b> est appliqué par défaut pour le grade sur le bulletin.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Rémunération & Contrat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Salaire de base fixe (MAD)</Label>
                      <Input type="number" step="0.001" value={adminData.baseSalary} onChange={(e) => setAdminData({...adminData, baseSalary: Number(e.target.value)})} placeholder="ex: 15000" />
                      <p className="text-xs text-muted-foreground mt-1">Ce montant sera pré-rempli automatiquement lors de la génération de la paie.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Régime</Label>
                      <Select value={adminData.regime} onValueChange={(v) => setAdminData({...adminData, regime: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mensuel">Mensuel</SelectItem>
                          <SelectItem value="Horaire">Horaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveAdmin} className="bg-[#1B4591] hover:bg-[#163A79]">
                      Sauvegarder les informations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
