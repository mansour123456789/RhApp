import React, { useMemo } from 'react';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useEmployeeStore, Employee } from '@/shared/store/mock-data';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

interface TreeNodeProps {
  employee: Employee;
  subordinates: Employee[];
  allEmployees: Employee[];
}

const EmployeeCard = ({ employee }: { employee: Employee }) => {
  return (
    <Card className="min-w-[220px] max-w-[250px] shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-[#1B4591]">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <img 
          src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=random`} 
          alt={employee.firstName} 
          className="w-16 h-16 rounded-full mb-3 shadow-sm"
        />
        <h3 className="font-bold text-[#1B4591] dark:text-blue-400">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="text-sm font-medium text-muted-foreground mt-1 mb-2">{employee.position}</p>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">{employee.department}</Badge>
      </CardContent>
    </Card>
  );
};

const TreeNode = ({ employee, subordinates, allEmployees }: TreeNodeProps) => {
  const hasChildren = subordinates.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div className="relative">
        <EmployeeCard employee={employee} />
      </div>

      {/* Children connector lines */}
      {hasChildren && (
        <>
          <div className="w-px h-6 bg-border"></div>
          <div className="flex justify-center relative">
            <div className="absolute top-0 w-[calc(100%-50%)] h-px bg-border"></div>
            {subordinates.map((sub, index) => {
              const subsOfSub = allEmployees.filter(e => e.managerId === sub.id);
              
              return (
                <div key={sub.id} className="flex flex-col items-center px-4 relative">
                  {/* Top connector for siblings */}
                  {subordinates.length > 1 && (
                    <div 
                      className={`absolute top-0 h-px bg-border ${
                        index === 0 ? 'right-0 w-1/2' : 
                        index === subordinates.length - 1 ? 'left-0 w-1/2' : 'w-full'
                      }`} 
                    />
                  )}
                  {/* Vertical connector to the sibling line */}
                  <div className="w-px h-6 bg-border"></div>
                  
                  {/* Recursion */}
                  <TreeNode 
                    employee={sub} 
                    subordinates={subsOfSub} 
                    allEmployees={allEmployees} 
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export function OrganizationChartPage() {
  const employees = useEmployeeStore(state => state.employees);

  const { rootEmployees, employeesMap } = useMemo(() => {
    // Top-level employees (no manager or manager not in list)
    const rootEmps = employees.filter(e => !e.managerId || !employees.some(m => m.id === e.managerId));
    
    // Create a map to quickly find subordinates
    const empMap = new Map<string, Employee[]>();
    employees.forEach(e => {
      if (e.managerId) {
        if (!empMap.has(e.managerId)) {
          empMap.set(e.managerId, []);
        }
        empMap.get(e.managerId)?.push(e);
      }
    });

    return { rootEmployees: rootEmps, employeesMap: empMap };
  }, [employees]);

  return (
    <DashboardLayout>
      <div className="space-y-6 h-full flex flex-col">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-[#1B4591] dark:text-white">Organigramme</h1>
          <p className="text-muted-foreground mt-1">Visualisez la hiérarchie et la structure de votre entreprise.</p>
        </header>

        <div className="flex-1 bg-slate-50/50 dark:bg-card border rounded-xl p-8 overflow-auto min-h-[600px] flex items-start justify-center">
          <div className="inline-flex flex-col items-center pt-8 pb-16">
            {rootEmployees.map(rootEmp => (
              <TreeNode 
                key={rootEmp.id} 
                employee={rootEmp} 
                subordinates={employeesMap.get(rootEmp.id) || []} 
                allEmployees={employees} 
              />
            ))}
            
            {rootEmployees.length === 0 && (
              <div className="text-muted-foreground italic p-8 text-center bg-white rounded-lg border">
                Aucun employé trouvé. Ajoutez des employés pour générer l'organigramme.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
