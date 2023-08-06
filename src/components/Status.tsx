import { cn } from '@/lib/utils'

const Status = ({ status }: { status: 'green' | 'yellow' | 'red' }) => {
  return (
    <span
      className={cn(
        'inline-block m-1 h-2 w-2 rounded-full',
        status === 'green' && 'bg-green-500',
        status === 'yellow' && 'bg-yellow-500',
        status === 'red' && 'bg-red-500'
      )}
    />
  )
}

export default Status
