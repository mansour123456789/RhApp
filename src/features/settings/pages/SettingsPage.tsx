import React from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore, Holiday } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Building, Clock, Save, Calendar, Trash2, Plus, Mail, MapPin, ShieldCheck, CreditCard, KeyRound } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { toast } from 'sonner';

export function SettingsPage() {
  const settings = useEmployeeStore((state) => state.settings);
  const updateSettings = useEmployeeStore((state) => state.updateSettings);
  const holidays = useEmployeeStore((state) => state.holidays);
  const addHoliday = useEmployeeStore((state) => state.addHoliday);
  const deleteHoliday = useEmployeeStore((state) => state.deleteHoliday);

  const [localSettings, setLocalSettings] = React.useState(settings);
  const [newHoliday, setNewHoliday] = React.useState<Partial<Holiday>>({ name: '', date: '' });

  const handleChange = (field: keyof typeof settings, value: string) => {
    setLocalSettings({ ...localSettings, [field]: value });
  };

  const handleSave = () => {
    updateSettings(localSettings);
    toast.success("Paramètres enregistrés avec succès !");
  };

  const handleAddHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast.error('Veuillez remplir le nom et la date du jour férié');
      return;
    }
    addHoliday({ name: newHoliday.name, date: newHoliday.date });
    setNewHoliday({ name: '', date: '' });
    toast.success('Jour férié ajouté');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Paramètres</h1>
            <p className="text-muted-foreground mt-1">Configurez les paramètres généraux de l'entreprise.</p>
          </div>
          <Button onClick={handleSave} className="bg-[#1B4591] hover:bg-[#163A79] text-white">
            <Save className="mr-2 h-4 w-4" /> Enregistrer les modifications
          </Button>
        </header>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-white dark:bg-sidebar border p-1 rounded-lg mb-6 shadow-sm">
            <TabsTrigger value="general" className="rounded-md">Général</TabsTrigger>
            <TabsTrigger value="horaires" className="rounded-md">Horaires & Temps</TabsTrigger>
            <TabsTrigger value="holidays" className="rounded-md">Jours Fériés</TabsTrigger>
            <TabsTrigger value="security" className="rounded-md">Sécurité & Accès</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Building className="h-5 w-5 text-[#1B4591]" /> Profil de l'Entreprise</CardTitle>
                  <CardDescription>Informations d'identification de base et coordonnées</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Raison Sociale</Label>
                    <Input 
                      id="companyName" 
                      value={localSettings.companyName} 
                      onChange={(e) => handleChange('companyName', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siret">SIRET / RC</Label>
                      <Input id="siret" defaultValue="123 456 789 00012" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tva">N° TVA Intracommunautaire</Label>
                      <Input id="tva" defaultValue="FR 12 345678900" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><MapPin className="h-5 w-5 text-[#1B4591]" /> Coordonnées</CardTitle>
                  <CardDescription>Adresse du siège social et contacts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse complète</Label>
                    <Input id="address" defaultValue="123 Avenue Mohammed V, Casablanca, Maroc" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email"><Mail className="h-4 w-4 inline mr-1 text-muted-foreground"/> Email de contact</Label>
                      <Input id="email" type="email" defaultValue="contact@entreprise.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" type="tel" defaultValue="+212 5 22 00 00 00" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><CreditCard className="h-5 w-5 text-[#1B4591]" /> Paramètres de Paie (Défaut)</CardTitle>
                <CardDescription>Devise et règles générales pour les bulletins</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Devise Principale</Label>
                    <Select defaultValue="MAD">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MAD">Dirham Marocain (MAD)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dollar Américain ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Format de date</Label>
                    <Select defaultValue="DD/MM/YYYY">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">JJ/MM/AAAA</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/JJ/AAAA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Banque (Domiciliation par défaut)</Label>
                    <Input defaultValue="Attijariwafa Bank" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="horaires" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Clock className="h-5 w-5 text-[#1B4591]" /> Horaires de travail par défaut</CardTitle>
                <CardDescription>Ces horaires servent de base pour le calcul des présences, retards et heures supplémentaires.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-semibold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Matin</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start">Heure d'entrée</Label>
                        <Input 
                          id="start" 
                          type="time" 
                          value={localSettings.workHoursStart} 
                          onChange={(e) => handleChange('workHoursStart', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pauseStart">Début de pause</Label>
                        <Input id="pauseStart" type="time" defaultValue="12:00" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-semibold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Après-midi</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pauseEnd">Fin de pause</Label>
                        <Input id="pauseEnd" type="time" defaultValue="14:00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end">Heure de sortie</Label>
                        <Input 
                          id="end" 
                          type="time" 
                          value={localSettings.workHoursEnd} 
                          onChange={(e) => handleChange('workHoursEnd', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holidays" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Calendar className="h-5 w-5 text-[#1B4591]" /> Calendrier des jours fériés</CardTitle>
                <CardDescription>Gérez les jours chômés payés pour toute l'entreprise. Ils ne seront pas comptabilisés comme absences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Ajouter un jour férié */}
                <div className="flex flex-col md:flex-row gap-4 items-end bg-blue-50/50 dark:bg-blue-950/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900">
                  <div className="flex-1 space-y-2 w-full">
                    <Label>Nom de l'événement</Label>
                    <Input 
                      placeholder="Ex: Fête du Travail" 
                      value={newHoliday.name}
                      onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <Label>Date</Label>
                    <Input 
                      type="date"
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddHoliday} className="bg-[#1B4591] hover:bg-[#163A79] text-white w-full md:w-auto h-10">
                    <Plus className="h-4 w-4 mr-2" /> Ajouter au calendrier
                  </Button>
                </div>

                {/* Liste des jours fériés */}
                <div className="space-y-3">
                  {holidays.length > 0 ? holidays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(holiday => (
                    <div key={holiday.id} className="flex justify-between items-center p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{holiday.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(holiday.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => deleteHoliday(holiday.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  )) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                      <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50" />
                      <p className="font-medium text-muted-foreground">Aucun jour férié configuré.</p>
                      <p className="text-sm text-muted-foreground">Ajoutez-en un via le formulaire ci-dessus.</p>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="h-5 w-5 text-[#1B4591]" /> Sécurité & Politique RH</CardTitle>
                <CardDescription>Paramètres de sécurité de la plateforme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-medium flex items-center gap-2"><KeyRound className="h-4 w-4" /> Authentification à Deux Facteurs (2FA)</h3>
                    <p className="text-sm text-muted-foreground mt-1">Exiger le 2FA pour tous les employés ayant accès au système.</p>
                  </div>
                  <Button variant="outline">Activer</Button>
                </div>
                <div className="p-4 border rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Expiration des mots de passe</h3>
                    <p className="text-sm text-muted-foreground mt-1">Forcer le changement de mot de passe tous les 90 jours.</p>
                  </div>
                  <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">Configurer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
