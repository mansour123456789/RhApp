import React, { useState, useRef } from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore, HRDocument, DocumentCategory } from '@/shared/store/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, FileText, Download, Trash2, FolderOpen, Search, File } from 'lucide-react';
import { DataTable } from '@/shared/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { toast } from 'sonner';

export function DocumentsPage() {
  const documents = useEmployeeStore((state) => state.documents);
  const employees = useEmployeeStore((state) => state.employees);
  const getEmployeeById = useEmployeeStore((state) => state.getEmployeeById);
  const addDocument = useEmployeeStore((state) => state.addDocument);
  const deleteDocument = useEmployeeStore((state) => state.deleteDocument);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDoc, setNewDoc] = useState<Partial<HRDocument>>({
    employeeId: employees[0]?.id,
    name: '',
    category: 'Contrat',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (!newDoc.employeeId || !newDoc.name || !newDoc.category) {
      toast.error('Veuillez remplir tous les champs et sélectionner un fichier');
      return;
    }
    
    addDocument({
      employeeId: newDoc.employeeId,
      name: newDoc.name,
      category: newDoc.category as DocumentCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      url: '#',
      size: `${(Math.random() * 4 + 0.1).toFixed(1)} MB` // fake size
    });
    
    toast.success('Document ajouté au coffre-fort');
    setIsOpen(false);
    setNewDoc({ ...newDoc, name: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDoc({ ...newDoc, name: e.target.files[0].name });
    }
  };

  const columns: ColumnDef<HRDocument>[] = [
    {
      accessorKey: 'name',
      header: 'Nom du fichier',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <File className="h-4 w-4 text-blue-500" />
          <span className="font-medium text-[#1B4591] dark:text-blue-400 hover:underline cursor-pointer">
            {row.original.name}
          </span>
        </div>
      )
    },
    {
      id: 'employee',
      accessorFn: (row) => row.employeeId,
      header: 'Employé concerné',
      cell: ({ row }) => {
        const emp = getEmployeeById(row.original.employeeId);
        if (!emp) return 'Entreprise';
        return (
          <div className="flex items-center gap-3">
            <img src={emp.avatarUrl} alt={emp.firstName} className="h-6 w-6 rounded-full" />
            <span className="text-sm">{emp.firstName} {emp.lastName}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'category',
      header: 'Catégorie',
    },
    {
      accessorKey: 'uploadDate',
      header: 'Date d\'ajout',
      cell: ({ row }) => new Date(row.original.uploadDate).toLocaleDateString('fr-FR')
    },
    {
      accessorKey: 'size',
      header: 'Taille',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.size}</span>
    },
    {
      id: 'actions',
      accessorFn: () => null,
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => toast.info(`Téléchargement de ${row.original.name}...`)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
              onClick={() => {
                deleteDocument(row.original.id);
                toast.success('Document supprimé');
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const filteredDocs = documents.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Documents & GED</h1>
            <p className="text-muted-foreground mt-1">Coffre-fort numérique RH centralisé pour tous vos documents.</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B4591] hover:bg-[#163A79] text-white">
                <Plus className="mr-2 h-4 w-4" /> Uploader un document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter au coffre-fort</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Fichier *</Label>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                  <div 
                    className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FolderOpen className="h-8 w-8 text-muted-foreground mb-2" />
                    {newDoc.name ? (
                      <span className="text-sm font-medium text-blue-600">{newDoc.name}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Cliquez pour sélectionner un fichier</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Lié à l'employé *</Label>
                  <Select value={newDoc.employeeId} onValueChange={(v) => setNewDoc({...newDoc, employeeId: v})}>
                    <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                    <SelectContent>
                      {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Catégorie *</Label>
                  <Select value={newDoc.category} onValueChange={(v) => setNewDoc({...newDoc, category: v as DocumentCategory})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Contrat">Contrat</SelectItem>
                      <SelectItem value="Avenant">Avenant</SelectItem>
                      <SelectItem value="Certificat">Certificat</SelectItem>
                      <SelectItem value="Bulletin de paie">Bulletin de paie</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
                <Button onClick={handleUpload} className="bg-[#1B4591] text-white">Importer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{documents.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contrats Actifs</CardTitle>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{documents.filter(d => d.category === 'Contrat').length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 px-1">
            <h2 className="text-lg font-semibold">Répertoire des fichiers</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un document..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <DataTable columns={columns} data={filteredDocs} />
        </div>
      </div>
    </DashboardLayout>
  );
}
