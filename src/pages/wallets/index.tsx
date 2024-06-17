import { Card, CardContent } from "@/components/ui/card"
import WalletCard from "@/components/walletCard"
import AddWallet from "@/features/Wallets/add-wallet"
import { PlusCircleIcon } from "lucide-react"
import { useState } from "react"

const Wallets = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-row flex-wrap gap-10 mt-[100px] justify-center">
      {Array.from({ length: 3 }).map((_, index) => (
        <WalletCard order={index + 1} />
      ))}
      <Card
        onClick={() => setOpen(true)}
        className="relative w-[300px] min-h-[180px] flex items-center justify-center cursor-pointer hover:bg-gray-200/10">
        <CardContent className="flex flex-col items-center gap-3">
          <PlusCircleIcon />
          <p>Yangi Hamyon Qo'shish</p>
        </CardContent>
      </Card>
      <AddWallet open={open} setOpen={setOpen} />
    </div>
  )
}

export default Wallets