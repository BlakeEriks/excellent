import { chain, filter, groupBy, map, sumBy, values } from 'lodash'
import { months } from './App'
import DailyLineChart from './DailyLineChart'
import HabitCard, { SimpleHabitCard } from './HabitCard'
import MonthlyBarChart from './MonthlyBarChart'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import useGoals from './hook/goals'
import useHabitData from './hook/habitData'

type OverviewProps = {
  context: string
}

type VolumeData = {
  month: string
  score: number
  projected?: number
}

const now = new Date()

const Overview = ({ context }: OverviewProps) => {
  const { habitData, habitHeaders } = useHabitData()
  const { typedGoals } = useGoals(context)
  const dataByMonth = groupBy(habitData, ({ date }: { date: Date }) => date.getMonth())
  const volumeByMonth: VolumeData[] = values(dataByMonth).map((dataset, index) => ({
    month: months[index].label.slice(0, 3),
    score: sumBy(dataset, 'score'),
  }))

  const day = now.getDate()
  const last = volumeByMonth[volumeByMonth.length - 1]
  if (last) {
    last.projected = Math.floor((last.score / day) * 31) - last.score
  }
  const [numericHeaders, booleanHeaders] = chain(habitHeaders)
    .groupBy({ datatype: 'boolean' })
    .values()
    .value()
  const contextData = filter(
    habitData,
    ({ date }) => context === 'year' || String(date.getMonth()) === context
  )
  const compactedContextData = filter(contextData, ({ date }) => date.getTime() <= now.getTime())

  return (
    <div className='space-y-4 px-4'>
      <h2 className='text-3xl font-bold tracking-tight'>Dashboard Overview</h2>
      <div className='flex items-start space-x-4'>
        <Card className='w-1/2'>
          <CardTitle>
            <CardHeader>Habit Volume</CardHeader>
          </CardTitle>
          <CardContent className='pb-2 h-80'>
            {context === 'year' ? (
              <MonthlyBarChart data={volumeByMonth} />
            ) : (
              // <DailyBarChart data={contextData} keys={['score']} />
              <DailyLineChart
                data={months[now.getMonth()].key === context ? compactedContextData : contextData}
              />
            )}
          </CardContent>
        </Card>
        <div className='flex h-full flex-col w-1/2 space-y-4'>
          <div className='flex flex-1 space-x-4 h-1/2'>
            {numericHeaders?.map(header => (
              <HabitCard
                {...header}
                data={map(compactedContextData, header.key)}
                goal={typedGoals[header.key]}
              />
            ))}
          </div>
          <div className='flex flex-1 justify-between space-x-2 h-1/2'>
            {booleanHeaders?.map(header => (
              <SimpleHabitCard
                {...header}
                data={map(compactedContextData, header.key)}
                goal={typedGoals[header.key]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
