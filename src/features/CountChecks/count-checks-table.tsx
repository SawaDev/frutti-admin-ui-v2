// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { formatNumberComma } from "@/lib/utils";
// import { MoreHorizontal } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import useMonthlyPayments from "./useCountChecks";
// import { GetCountChecksResponse } from "./count-checks.type";

// interface MonthlyPaymentsTableType {
//   data: GetCountChecksResponse | undefined;
// }

// const CollapsedRows: React.FC<{
//   data: GetCountChecksResponse["data"][0]["count_checks"][0];
// }> = ({ data }) => {
//   return (
//     <TableRow className="p-0" key={data.id}>
//       <TableCell className="p-2 px-4">{data.man_before.name}</TableCell>
//       <TableCell className="p-2 px-4">
//         {formatNumberComma(data.amount)}
//       </TableCell>
//     </TableRow>
//   );
// };

// const MonthlyPaymentsTable: React.FC<MonthlyPaymentsTableType> = ({ data }) => {
//   const [deleteModal, setDeleteModal] = useState<string | null>(null);

//   const { deleteMonthlyPaymentMutation } = useMonthlyPayments();

//   const deleteMonthlyPayment = deleteMonthlyPaymentMutation();

//   const handleDelete = () => {
//     deleteMonthlyPayment.mutateAsync(deleteModal).then(() => {
//       setDeleteModal(null);
//     });
//   };

//   return (
//     <div className="max-h-[70vh] overflow-auto rounded-md border">
//       <Table id="table-main" className="min-w-full">
//         <TableHeader>
//           <TableRow className="sticky top-0 z-[2] bg-white">
//             <TableHead>Sana</TableHead>
//             <TableHead>Umumiy Summasi</TableHead>
//             <TableHead>
//               <span className="sr-only">Harakatlar</span>
//             </TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data?.data ? (
//             data.data.map((date, dateIndex) => (
//               <Collapsible key={dateIndex} asChild>
//                 <>
//                   <CollapsibleTrigger asChild>
//                     <TableRow className="p-0">
//                       <TableCell className="p-2 px-4">{date.date}</TableCell>
//                       <TableCell className="p-2 px-4">
//                         {formatNumberComma(date.total_amount ?? null)}
//                       </TableCell>
//                       <TableCell className="w-16">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button
//                               aria-haspopup="true"
//                               size="icon"
//                               variant="ghost"
//                             >
//                               <MoreHorizontal className="h-4 w-4" />
//                               <span className="sr-only">Menu</span>
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
//                             <DropdownMenuItem
//                               className="focus:bg-red-100 focus:text-red-800"
//                               onClick={() => setDeleteModal(date.date)}
//                             >
//                               O'chirish
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   </CollapsibleTrigger>
//                   <CollapsibleContent asChild>
//                     {data?.data[dateIndex]?.payments &&
//                       data?.data[dateIndex]?.payments?.length && (
//                         <TableRow className="hover:bg-inherit">
//                           <TableCell className="p-0 pl-6" colSpan={99}>
//                             <Table>
//                               <TableHeader>
//                                 <TableRow>
//                                   <TableHead>Ism</TableHead>
//                                   <TableHead>Summa</TableHead>
//                                 </TableRow>
//                               </TableHeader>
//                               <TableBody>
//                                 {data?.data[dateIndex]?.payments?.map(
//                                   (payment, paymentIndex) => {
//                                     return (
//                                       <CollapsedRows
//                                         data={payment}
//                                         key={paymentIndex}
//                                       />
//                                     );
//                                   },
//                                 )}
//                               </TableBody>
//                             </Table>
//                           </TableCell>
//                         </TableRow>
//                       )}
//                   </CollapsibleContent>
//                 </>
//               </Collapsible>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={99} className="h-24 text-center">
//                 Hech narsa yo'q.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//         {!!deleteModal && (
//           <Dialog
//             open={deleteModal ? true : false}
//             onOpenChange={() => setDeleteModal(null)}
//           >
//             <DialogContent>
//               <DialogTitle>Oylik to'lovni o'chirish</DialogTitle>
//               <DialogDescription>
//                 Oylik to'lovni o'chirganingizdan so'ng uni qayta tiklab bo'lmaydi
//               </DialogDescription>
//               <DialogFooter>
//                 <Button
//                   variant={"outline"}
//                   onClick={() => setDeleteModal(null)}
//                 >
//                   Bekor qilish
//                 </Button>
//                 <Button variant={"destructive"} onClick={handleDelete}>
//                   O'chirish
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         )}
//       </Table>
//     </div>
//   );
// };

// export default MonthlyPaymentsTable;
