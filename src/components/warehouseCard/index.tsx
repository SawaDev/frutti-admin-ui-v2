import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress"
import { Warehouse } from "@/types/warehouses";
import { Link } from "react-router-dom";

interface WarehouseCardProps {
  order: number;
  warehouse: Warehouse;
  link: string;
}

export default function WarehouseCard({
  warehouse,
  order,
  link
}: WarehouseCardProps) {
  return (
    <Link to={`/${link}/${warehouse.id}`}>
      <Card className="relative h-fit w-[300px] cursor-pointer pl-1">
        <span className="absolute -left-5 -top-7 bg-white text-[80px] font-bold leading-[80px] text-gray-600">
          {order}
        </span>
        <CardHeader className="pb-2">
          <CardDescription className="capitalize">
            {warehouse.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Sklad ma'lumotlari
          </div>
        </CardContent>
        {/* <CardFooter>
          <Progress value={25} aria-label="25% increase" />
        </CardFooter> */}
      </Card>
    </Link>
  );
}
