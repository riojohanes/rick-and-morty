import clsx from 'clsx'

interface StatusBadgeProps {
  status: string
}

const statusColorMap: Record<string, string> = {
  Alive: 'badge--success',
  Dead: 'badge--danger',
  unknown: 'badge--neutral',
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const normalizedStatus = status || 'unknown'
  const colorClass = statusColorMap[normalizedStatus] ?? 'badge--neutral'

  return (
    <span className={clsx('badge', colorClass)}>
      {normalizedStatus}
    </span>
  )
}

