import { chain, isUndefined, sum } from 'lodash'
import { StarIcon } from 'lucide-react'
import Status from './components/Status'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/card'
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

function formatAsPercent(decimal: number) {
  return Math.round(decimal * 100) + '%'
}

const HabitCard = ({ label, icon, datatype, data, goal }: HabitCardProps) => {
  if (!data?.length) return null

  const cardData: HabitCardData = {}

  switch (datatype) {
    case 'number':
      cardData.average = parseFloat(sum(data).toFixed(1))
      if (goal) {
        cardData.goalStatus = ((goal as number) * now.getDate()) / 31 <= cardData.average
        cardData.goalLabel = `${goal}`
      }
      break
    case 'time': {
      const avgInMs = chain(data)
        .compact()
        .meanBy(date => (date as Date).getTime())
        .value()
      cardData.average = formatTime(new Date(avgInMs))
      if (goal) {
        cardData.goalStatus = avgInMs <= (goal as Date).getTime()
        cardData.goalLabel = formatTime(goal as Date)
      }
      break
    }
  }

  return (
    <Card className='flex-1 max-w-fit'>
      <CardTitle className='relative border-b'>
        <CardHeader className='text-xl font-light text-center h-8 justify-center px-2 py-0 whitespace-nowrap w-[190px]'>
          {icon} {label}
        </CardHeader>
        {/* <div className='absolute top-0 left-0 text-[16px] p-1 border-b border-r'>{icon}</div> */}
      </CardTitle>
      <CardContent className='pb-0'>
        <h1 className='text-xl text-slate-800 text-center leading-relaxed font-semibold'>
          {!isUndefined(cardData.goalStatus) && (
            <Status status={cardData.goalStatus ? 'green' : 'red'} />
          )}
          {cardData.average}
        </h1>
      </CardContent>
      {!!goal && (
        <CardFooter className='justify-end'>
          <div className='flex items-center opacity-50 space-x-1'>
            <StarIcon fill='#64748b' size={12} />
            <span>{cardData.goalLabel}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export const SimpleHabitCard = ({ label, icon, data, goal }: HabitCardProps) => {
  if (!data?.length) return null

  const cardData: HabitCardData = {}

  cardData.average = sum(data) / now.getDate()

  return (
    <Card className='w-[30%] xl:w-[48%]'>
      <CardTitle className='relative border-b'>
        <CardHeader className='font-light text-center h-16 justify-center px-2 py-0'>
          <div className='flex flex-col text-sm font-semibold'>
            <span>{icon}</span>
            <span className='whitespace-nowrap'>{label}</span>
          </div>
        </CardHeader>
      </CardTitle>
      <CardContent className='p-0'>
        <h2 className='text-lg text-slate-800 text-center leading-relaxed font-semibold'>
          {!isUndefined(cardData.goalStatus) && (
            <Status status={cardData.goalStatus ? 'green' : 'red'} />
          )}
          {formatAsPercent(cardData.average)}
        </h2>
      </CardContent>
      {!!goal && (
        <CardFooter className='justify-end'>
          <div className='flex items-center opacity-50 space-x-1'>
            <StarIcon fill='#64748b' size={12} />
            <span>{cardData.goalLabel}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default HabitCard
