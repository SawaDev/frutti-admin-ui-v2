import { useParams } from "react-router-dom"

import useUsers from "@/hooks/useUsers"
import { UserDetails } from "@/features/Users/user-details"

export default function EditUser() {
  const params = useParams()

  const { getSingleUserQuery } = useUsers()

  const { data, isLoading, error } = getSingleUserQuery(params.id)

  if (isLoading) {
    return <>Loading...</>
  }

  if (error) {
    return <>Error</>
  }

  return (
    <div className="max-w-7xl mx-auto my-12 grid flex-1 auto-rows-max gap-4">
      {data?.success && (
        <UserDetails data={data.data} />
      )}
    </div >
  )
}