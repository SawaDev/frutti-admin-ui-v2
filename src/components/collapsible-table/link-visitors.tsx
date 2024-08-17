import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function LinksVisitors() {
  return (
    <>
      <TableRow className="hover:bg-inherit">
        <TableCell colSpan={4} className="w-80 p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Yaratilingan Sana</TableHead>
                <TableHead className="">Umumiy Summasi</TableHead>
                <TableHead>
                  <span className="sr-only">Harakatlar</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map(() => {
                return (
                  <TableRow className="group/row">
                    <TableCell>
                      date
                    </TableCell>
                    <TableCell>
                      u sum
                    </TableCell>
                    <TableCell>
                      t5465474
                    </TableCell>
                    <TableCell className="text-center sm:text-right">
                      fd
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableCell>
      </TableRow>
    </>
  );
}
