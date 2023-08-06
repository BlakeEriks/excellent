import { chain, sum } from 'lodash'
import { StarIcon } from 'lucide-react'
import Status from './components/Status'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card'
import { HabitHeader } from './hook/habitData'
import { formatTime } from './util/time'

type HabitCardProps = HabitHeader & {
  data: (number | boolean | Date)[]
  goal: number | boolean | Date
}
type HabitCardData = {
  average?: number | string
  sum?: number
  goalLabel?: string
  goalStatus?: boolean
}

const now = new Date()

const HabitCard = ({ label, icon, datatype, data, goal }: HabitCardProps) => {
  if (!data?.length) return null

  const cardData: HabitCardData = {}

  switch (datatype) {
    case 'boolean':
    case 'number':
      cardData.average = parseFloat(sum(data).toFixed(1))
      console.log(((goal as number) * 31) / now.getDate())
      cardData.goalStatus = ((goal as number) * now.getDate()) / 31 <= cardData.average
      cardData.goalLabel = `${goal}`
      break
    case 'time': {
      const avgInMs = chain(data)
        .compact()
        .meanBy(date => (date as Date).getTime())
        .value()
      cardData.average = formatTime(new Date(avgInMs))
      cardData.goalStatus = avgInMs <= (goal as Date).getTime()
      cardData.goalLabel = formatTime(goal as Date)
      break
    }
  }
  console.log(goal)

  return (
    <Card className='flex-1'>
      <CardTitle className='relative border-b'>
        <CardHeader className='font-light text-center h-16 justify-center px-2 py-0'>
          {label}
        </CardHeader>
        <div className='absolute top-0 left-0 text-[16px] p-1 border-b border-r'>{icon}</div>
      </CardTitle>
      <CardContent className='pb-0'>
        <h1 className='text-2xl text-slate-800 text-center leading-relaxed font-semibold'>
          <Status status={cardData.goalStatus ? 'green' : 'red'} />
          {cardData.average}
        </h1>
      </CardContent>
      {goal && (
        <CardFooter className='justify-end'>
          <CardDescription>
            <div className='flex items-center'>
              <StarIcon fill='#64748b' size={12} />
              <span>{cardData.goalLabel}</span>
            </div>
          </CardDescription>
        </CardFooter>
      )}
    </Card>
  )
}

export default HabitCard
