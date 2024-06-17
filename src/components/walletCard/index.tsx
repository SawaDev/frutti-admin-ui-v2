import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface WalletCardProps {
  order: number;
}

export default function WalletCard({ order }: WalletCardProps) {
  return (
    <Card className="relative w-[300px] h-fit pl-1">
      <span className="absolute -top-7 -left-5 leading-[80px] text-[80px] font-bold text-gray-600 bg-white">{order}</span>
      <CardHeader className="pb-2">
        <CardDescription>This Week</CardDescription>
        <CardTitle className="text-4xl">$1,329</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">+25% from last week</div>
      </CardContent>
      <CardFooter>
        <Progress value={25} aria-label="25% increase" />
      </CardFooter>
    </Card>
  )
}