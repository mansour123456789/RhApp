import React from 'react';
import { Employee, Payroll } from '@/shared/store/mock-data';

interface PayslipTemplateProps {
  payroll: Payroll;
  employee: Employee;
}

export const PayslipTemplate = React.forwardRef<HTMLDivElement, PayslipTemplateProps>(({ payroll, employee }, ref) => {
  const formatAmountStr = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(amount);
  };

  // Date parsing
  const issueDate = new Date(payroll.issueDate);
  const formattedIssueDate = issueDate.toLocaleDateString('fr-FR');
  
  const [year, month] = payroll.period.split('-');
  const periodDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  const periodStr = periodDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase();

  const montantBrutCnss = payroll.baseSalary + payroll.primePresence + payroll.primeTransport + payroll.primeEncouragement;
  const montantImposable = montantBrutCnss - payroll.cnssDeduction;

  return (
    <div ref={ref} className="bg-white text-black p-8 font-sans w-[800px] mx-auto text-sm leading-tight">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        {/* Company Box */}
        <div className="border-2 border-black p-3 w-[350px]">
          <div className="font-bold">STE BEFTEIC</div>
          <div className="font-bold">000 RES OMAR B1-6</div>
          <br />
          <div className="font-bold">C.P. 2010</div>
          <div className="font-bold">N° CNSS : 63557935</div>
        </div>

        {/* Title Right */}
        <div className="text-right flex flex-col items-center pr-4">
          <div className="italic font-bold text-sm mb-2">STE BEFTEIC</div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold uppercase tracking-wide">Bulletin de Paie</h1>
            <span className="text-xl font-bold">{formattedIssueDate}</span>
          </div>
          <div className="font-bold text-lg mt-1">SALAIRE {periodStr}</div>
        </div>
      </div>

      {/* Employee Info Block */}
      <div className="mb-6 space-y-2 text-sm font-semibold">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Matricule</span>
            <span className="w-12 text-center">{employee.id.replace('EMP-', '')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>N_cnss :</span>
            <span className="min-w-24">{employee.cnssNumber || '1702437508'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Cin</span>
            <span className="min-w-20">{employee.cin || '09185841'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Regime : Mensuel</span>
            <span>1</span>
          </div>
        </div>

        <div className="flex justify-between items-center pr-12">
          <div className="flex items-center gap-2">
            <span>Prénom-Nom</span>
            <span className="uppercase ml-2">{employee.firstName} {employee.lastName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Fonction</span>
            <span className="uppercase">{employee.position}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>Cat.: <span className="font-normal text-blue-600">{employee.category || '1'}</span></span>
            <span>Echelon : <span className="font-normal text-blue-600">{employee.echelon || '1'}</span></span>
            <span className="border border-black px-8 py-0.5 ml-2 italic text-center w-32">TITULAIRE</span>
          </div>
          <div className="flex items-center gap-8">
            <span>regime</span>
            <span>208</span>
            <span>Non Chef F.</span>
            <span>C</span>
            <span>0</span>
          </div>
        </div>

        <div className="flex gap-20 items-center pt-2">
          <div className="flex items-center gap-4">
            <span className="italic font-bold">Salaire de base</span>
            <span>{formatAmountStr(payroll.baseSalary)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="italic font-bold">Jours_trav :</span>
            <span>{payroll.workedDays.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-black w-full mb-2">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-black">
              <th className="border-r border-black p-1 w-12 text-center font-bold">Code</th>
              <th className="border-r border-black p-1 text-center font-bold">Rubrique</th>
              <th className="border-r border-black p-1 w-16 text-center font-bold">Nbr</th>
              <th className="border-r border-black p-1 w-28 text-center font-bold">Montant +</th>
              <th className="p-1 w-28 text-center font-bold">Montant -</th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">1</td>
              <td className="border-r border-black px-2">SALAIRE DE BASE</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right">{formatAmountStr(payroll.baseSalary)}</td>
              <td className="px-2 text-right"></td>
            </tr>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">9</td>
              <td className="border-r border-black px-2">PRIME DE PRESENCE</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right">{formatAmountStr(payroll.primePresence)}</td>
              <td className="px-2 text-right"></td>
            </tr>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">10</td>
              <td className="border-r border-black px-2">PRIME DE TRANSPORT</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right">{formatAmountStr(payroll.primeTransport)}</td>
              <td className="px-2 text-right"></td>
            </tr>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">21</td>
              <td className="border-r border-black px-2">PRIME D'ENCOURAGEMENT</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right">{formatAmountStr(payroll.primeEncouragement)}</td>
              <td className="px-2 text-right"></td>
            </tr>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">30</td>
              <td className="border-r border-black px-2">MONTANT BRUT CNSS</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right">{formatAmountStr(montantBrutCnss)}</td>
              <td className="px-2 text-right"></td>
            </tr>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">31</td>
              <td className="border-r border-black px-2">CNSS</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right"></td>
              <td className="px-2 text-right">{formatAmountStr(payroll.cnssDeduction)}</td>
            </tr>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">34</td>
              <td className="border-r border-black px-2">MONTANT IMPOSABLE</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right">{formatAmountStr(montantImposable)}</td>
              <td className="px-2 text-right"></td>
            </tr>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">35</td>
              <td className="border-r border-black px-2">IRPP</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right"></td>
              <td className="px-2 text-right">{formatAmountStr(payroll.irppDeduction)}</td>
            </tr>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">36</td>
              <td className="border-r border-black px-2">CSS</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right"></td>
              <td className="px-2 text-right">{formatAmountStr(payroll.cssDeduction)}</td>
            </tr>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">37</td>
              <td className="border-r border-black px-2">MONTANT NET</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right">{formatAmountStr(payroll.netSalary)}</td>
              <td className="px-2 text-right"></td>
            </tr>
            <tr className="h-6">
              <td className="border-r border-black px-2 text-right">45</td>
              <td className="border-r border-black px-2">NET A PAYER</td>
              <td className="border-r border-black px-2"></td>
              <td className="border-r border-black px-2 text-right">{formatAmountStr(payroll.netSalary)}</td>
              <td className="px-2 text-right"></td>
            </tr>
            {/* Fill empty space */}
            {Array.from({ length: 15 }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-6">
                <td className="border-r border-black px-2"></td>
                <td className="border-r border-black px-2"></td>
                <td className="border-r border-black px-2"></td>
                <td className="border-r border-black px-2"></td>
                <td className="px-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Details */}
      <div className="flex justify-between items-start mt-4 pl-4 pr-8 font-bold">
        <div className="flex items-center gap-4">
          <span>Solde Conge</span>
          <span>{payroll.congeBalance.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="border border-black flex flex-col items-center px-6 py-1">
          <span className="mb-1">Net_a_payer</span>
          <span className="text-lg">{formatAmountStr(payroll.netSalary)}</span>
        </div>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-center mt-12 px-16 font-bold text-lg mb-8">
        <div>L'EMPLOYEUR</div>
        <div>L'EMPLOYE</div>
      </div>
    </div>
  );
});

PayslipTemplate.displayName = 'PayslipTemplate';
