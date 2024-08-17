import { Button } from "@/components/ui/button"

interface NoItemsProps {
  setOpen: (value: boolean) => void
  setOpenWarehouse?: (value: boolean) => void
}

export default function NoItems({ setOpen, setOpenWarehouse }: NoItemsProps) {
  return (
    <div
      className="flex flex-1 items-center justify-center h-full rounded-lg border border-dashed shadow-sm"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Hech qanday ma'lumot yo'q
        </h3>
        <p className="text-sm text-muted-foreground">
          Yangi ma'lumot qo'shganingizdan so'ng u ustida amallarni bajarishingiz mumkin.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => setOpen(true)} className="mt-4">Qo'shish</Button>
          {setOpenWarehouse &&
            <Button onClick={() => setOpenWarehouse(true)} variant={"outline"} className="mt-4">Sklad Qo'shish</Button>
          }
        </div>
      </div>
    </div>
  )
}
