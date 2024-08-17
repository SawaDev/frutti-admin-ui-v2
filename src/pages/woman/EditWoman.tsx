import { useParams } from "react-router-dom"

import useWomen from "@/hooks/useWomen"
import { WomanDetails } from "@/features/Women/woman-details"

export default function EditWoman() {
  const params = useParams()

  const { getSingleWomanQuery } = useWomen()

  const { data, isLoading, error } = getSingleWomanQuery(params.id)

  if (isLoading) {
    return <>Loading...</>
  }

  if (error) {
    return <>Error</>
  }

  return (
    <div className="max-w-7xl mx-auto my-12 grid flex-1 auto-rows-max gap-4">
      {data?.success && (
        <WomanDetails data={data.data} />
      )}
    </div >
  )
}