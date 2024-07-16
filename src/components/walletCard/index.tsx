import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatNumberComma } from "@/lib/utils";
import { Wallet } from "@/types/wallets";
import { Link } from "react-router-dom";

interface WalletCardProps {
  order: number;
  wallet: Wallet
}

export default function WalletCard({ wallet, order }: WalletCardProps) {
  return (
    <Link to={`/wallets/${wallet.id}`}>
      <Card className="relative w-[300px] h-fit pl-1 cursor-pointer">
        <span className="absolute -top-7 -left-5 leading-[80px] text-[80px] font-bold text-gray-600 bg-white">{order}</span>
        <CardHeader className="pb-2">
          <CardDescription className="capitalize">{wallet.name}</CardDescription>
          <CardTitle className="text-4xl">{wallet.type === "dollar" && "$"} {formatNumberComma(wallet.balance)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">+25% from last week</div>
        </CardContent>
        <CardFooter>
          <Progress value={25} aria-label="25% increase" />
        </CardFooter>
      </Card>
    </Link>
  )
}