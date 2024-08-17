import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import LinksVisitors from './link-visitors';
import useIngredients from '@/hooks/useIngredients';
import { formatNumberComma } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

const CollapsibleTable = () => {
  const { getAllIngredientTransactionsQuery } = useIngredients()

  const { data: transactions, isLoading: loadingTransactions } = getAllIngredientTransactionsQuery()

  return (
    <div>
      <Card className='m-6'>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-10'>
                  Yana
                </TableHead>
                <TableHead className="">Yaratilingan Sana</TableHead>
                <TableHead className="">Umumiy Summasi</TableHead>
                <TableHead>
                  <span className="sr-only">Harakatlar</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!loadingTransactions && transactions)
                ? transactions?.data.map((transaction) => {
                  return (
                    <Collapsible key={transaction.id} asChild>
                      <>
                        <TableRow key={transaction.id} className="group/row">
                          <TableCell>
                            <CollapsibleTrigger>
                              <div className="flex items-center space-x-1 [&[data-state=open]>svg.chevron]:rotate-180">
                                <p className="whitespace-nowrap text-sm text-muted-foreground">
                                  <PlusCircle />
                                </p>
                              </div>
                            </CollapsibleTrigger>
                          </TableCell>
                          <TableCell>
                            {transaction.created_at}
                          </TableCell>
                          <TableCell>
                            {formatNumberComma(transaction.totals.cost)}
                          </TableCell>
                          <TableCell className="text-center sm:text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 group-hover/row:ring-1 group-hover/row:ring-gray-200 group-hover/row:dark:ring-gray-700"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                >
                                  Edit Link
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                >
                                  Duplicate Link
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                >
                                  Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        <CollapsibleContent asChild>
                          <LinksVisitors/>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  )
                })
                : (
                  <TableRow>
                    <TableCell className="h-24 text-center">
                      Hech narsa yo'q.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default CollapsibleTable