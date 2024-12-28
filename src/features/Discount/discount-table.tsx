import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumberComma } from "@/lib/utils";

interface DiscountTableProps {
  data: any[];
  onDelete: (id: number) => void;
}

const DiscountTable = ({ data, onDelete }: DiscountTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Klient</TableHead>
          <TableHead>Turi</TableHead>
          <TableHead>Chegirma qiymati</TableHead>
          <TableHead>Chegirmadan oldingi balans</TableHead>
          <TableHead>Chegirmadan keyingi balans</TableHead>
          <TableHead>Chegirma summasi</TableHead>
          <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
          <TableHead>
            <span className="sr-only">Harakatlar</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((discount, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{discount.client?.name}</TableCell>
            <TableCell>
              {discount.type === "percentage" ? (
                <Badge variant={"success"}>Foiz</Badge>
              ) : (
                <Badge variant={"secondary"}>Summa</Badge>
              )}
            </TableCell>
            <TableCell>{formatNumberComma(discount.value)}</TableCell>
            <TableCell>{formatNumberComma(discount.balance_before)}</TableCell>
            <TableCell>{formatNumberComma(discount.balance_after)}</TableCell>
            <TableCell>
              {formatNumberComma(
                (discount.balance_after ?? 0) - (discount.balance_before ?? 0)
              )}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {format(discount.created_at, "dd-MM-yyyy HH:mm")}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="focus:bg-red-100 focus:text-red-800"
                    onClick={() => onDelete(discount.id)}
                  >
                    O'chirish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DiscountTable; 