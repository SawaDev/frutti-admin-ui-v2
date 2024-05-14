import { ChevronLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

import usePosts from "@/hooks/usePosts"
import { Button } from "@/components/ui/button"
import { PostDetails } from "@/features/Posts/post-details"

export default function EditPost() {
  const navigate = useNavigate()
  const params = useParams()

  const { getSinglePostQuery } = usePosts()

  const { data, isLoading, error } = getSinglePostQuery(params.id)

  if (isLoading) {
    return <>Loading...</>
  }

  if (error) {
    return <>Error</>
  }

  return (
    <div className="max-w-7xl mx-auto my-12 grid flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate(-1)} variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Post Boshqaruvchisi
        </h1>
      </div>
      {data?.success && (
        <PostDetails data={data.data} />
      )}
    </div >
  )
}