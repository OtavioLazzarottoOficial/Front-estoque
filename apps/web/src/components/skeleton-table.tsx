import { Skeleton } from "@workspace/ui/components/skeleton"

interface Props {
  length: number
}

export function SkeletonTable({ length }: Props) {
  return (
    <div className="flex w-full flex-col gap-2">
      {Array.from({ length }).map((_, index) => (
        <div className="flex gap-4" key={index}>
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}
