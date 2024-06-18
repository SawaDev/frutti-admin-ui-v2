import { useParams } from "react-router-dom"

import useWallets from "@/hooks/useWallets"
import WalletDetails from "@/features/Wallets/wallet-details"

export default function EditWallet() {
  const params = useParams()

  const { getSingleWalletQuery } = useWallets()

  const { data, isLoading, error } = getSingleWalletQuery(params.id)

  if (isLoading) {
    return <>Loading...</>
  }

  if (error) {
    return <>Error</>
  }

  return (
    <div className="max-w-7xl mx-auto my-12 grid flex-1 auto-rows-max gap-4">
      {data?.success && (
        <WalletDetails data={data.data} />
      )}
    </div>
  )
}