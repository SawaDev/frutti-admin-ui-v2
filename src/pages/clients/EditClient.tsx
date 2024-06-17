import { useParams } from "react-router-dom"

import { ClientDetails } from "@/features/Clients/client-details"
import useClients from "@/hooks/useClients"

export default function EditClient() {
  const params = useParams()

  const { getSingleClientQuery } = useClients()

  const { data, isLoading, error } = getSingleClientQuery(params.id)

  if (isLoading) {
    return <>Loading...</>
  }

  if (error) {
    return <>Error</>
  }

  return (
    <div className="max-w-7xl mx-auto my-12 grid flex-1 auto-rows-max gap-4">
      {data?.success && (
        <ClientDetails data={data.data} />
      )}
    </div >
  )
}