
import React, { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GrowthMetricsProps {
  title: string;
  value: string;
  change: number;
  description: string;
  icon?: ReactNode;
}

const GrowthMetrics: React.FC<GrowthMetricsProps> = ({
  title,
  value,
  change,
  description,
  icon
}) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
            {Math.abs(change)}%
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default GrowthMetrics;
