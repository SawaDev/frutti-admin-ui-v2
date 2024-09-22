import { useParams } from "react-router-dom"

import useMen from "@/hooks/useMen"
import { ManDetails } from "@/features/Men/man-details"

export default function EditMan() {
  const params = useParams()

  const { getSingleManQuery } = useMen()

  const { data, isLoading, error } = getSingleManQuery(params.id)

  if (isLoading) {
    return <>Loading...</>
  }

  if (error) {
    return <>Error</>
  }

  return (
    <div className="max-w-7xl mx-auto my-12 grid flex-1 auto-rows-max gap-4">
      {data?.success && (
        <ManDetails data={data.data} />
      )}
    </div>
  )
}