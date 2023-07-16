import { sumBy } from 'lodash'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { HabitData, HabitHeader } from './hook/habitData'

type HabitCardData = {
  average?: number | string
  sum?: number
}

const HabitCard = ({ habit, data }: { habit: HabitHeader; data: HabitData[] }) => {
  if (!habit || !data) return null

  const { label, icon, key, datatype } = habit
  const cardData: HabitCardData = {}

  switch (datatype) {
    case 'boolean':
    case 'number':
      cardData.average = parseFloat(sumBy(data, key).toFixed(1))
      break
    case 'time': {
      const avgInMs =
        data.reduce((acc, data) => {
          const date = data[key] as Date
          return acc + (date ? date.getTime() : 0)
        }, 0) / data.length
      const avgAsDate = new Date(avgInMs)
      const averageHours = avgAsDate.getHours()
      const averageMinutes = avgAsDate.getMinutes()
      cardData.average = `${averageHours}:${averageMinutes < 10 ? '0' : ''}${averageMinutes}`
      break
    }
  }

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
          {cardData.average}
        </h1>
      </CardContent>
    </Card>
  )
}

export default HabitCard
