import { Card, CardContent } from "@/components/ui/card"
import WalletCard from "@/components/walletCard"
import AddExchange from "@/features/Wallets/add-exchange"
import AddWallet from "@/features/Wallets/add-wallet"
import useWallets from "@/hooks/useWallets"
import { ArrowRightLeft, PlusCircleIcon } from "lucide-react"
import { useState } from "react"

const Wallets = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [openExchange, setOpenExchange] = useState<boolean>(false)

  const { getAllWalletsQuery } = useWallets()

  const { data, isLoading, isError } = getAllWalletsQuery()

  if (isLoading) {
    return <>Loading...</>
  }

  if (isError) {
    return <>Error</>
  }

  return (
    <div className="flex flex-row flex-wrap gap-10 mt-[100px] justify-center sm:mx-[100px]">
      {data?.data.map((wallet, index) => (
        <WalletCard key={wallet.id} wallet={wallet} order={index + 1} />
      ))}
      <Card
        onClick={() => setOpenExchange(true)}
        className="relative w-[300px] min-h-[180px] flex items-center justify-center cursor-pointer hover:bg-gray-200/10">
        <CardContent className="flex flex-col items-center pt-4 text-center capitalize gap-3">
          <ArrowRightLeft />
          <p>Hamyonlar orasidagi pul o'tkazmasi</p>
        </CardContent>
      </Card>
      <Card
        onClick={() => setOpen(true)}
        className="relative w-[300px] min-h-[180px] flex items-center justify-center cursor-pointer hover:bg-gray-200/10">
        <CardContent className="flex flex-col items-center gap-3">
          <PlusCircleIcon />
          <p>Yangi Hamyon Qo'shish</p>
        </CardContent>
      </Card>
      <AddExchange open={openExchange} setOpen={setOpenExchange} />
      <AddWallet open={open} setOpen={setOpen} />
    </div>
  )
}

export default Wallets