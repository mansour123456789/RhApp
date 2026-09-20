import { type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

export const Overview: FC = () => {
  const data = [
    { name: 'Jan', total: 4500 },
    { name: 'Feb', total: 5200 },
    { name: 'Mar', total: 4800 },
    { name: 'Apr', total: 6100 },
    { name: 'May', total: 5900 },
    { name: 'Jun', total: 7200 },
  ];

  const max = Math.max(...data.map(d => d.total));

  return (
    <Card className="col-span-1 border">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="flex items-end justify-between h-[200px] gap-2 px-2">
          {data.map((d) => (
            <div key={d.name} className="flex flex-col items-center flex-1 gap-2">
              <div 
                className="w-full bg-primary rounded-t-sm transition-all hover:bg-primary/80" 
                style={{ height: `${(d.total / max) * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground uppercase font-medium">{d.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
