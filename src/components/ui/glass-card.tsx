import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const GlassCard = ({ className, ...props }: ComponentProps<"div">) => (
  <Card className={cn("glass-card", className)} {...props} />
)

export { GlassCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
