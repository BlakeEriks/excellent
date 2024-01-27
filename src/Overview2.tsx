import { useAtomValue } from 'jotai'
import { chain, filter, groupBy, map, sumBy, values } from 'lodash'
import { Context } from './App'
import DailyLineChart from './DailyLineChart'
import HabitCard, { SimpleHabitCard } from './HabitCard'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import useGoals from './hook/goals'
import { activeSheetAtom } from './state/sheet'
import { getDayOfYear } from './util/time'

type OverviewProps = {
  context: Context
}

const now = new Date()

const Overview2 = ({ context }: OverviewProps) => {
  const { data, headers } = useAtomValue(activeSheetAtom)
  const { typedGoals, scoreGoal } = useGoals(context)
  const currentWeek = Math.floor(getDayOfYear(now) / 7)
  const weekGroupedData = values(groupBy(data, ({ date }) => Math.floor(getDayOfYear(date) / 7)))
  const [numericHeaders, booleanHeaders] = chain(headers)
    .groupBy({ datatype: 'boolean' })
    .values()
    .value()
  const contextData = filter(
    data,
    ({ date }) => context.key === 12 || date.getMonth() === context.key
  )
  const compactedContextData = filter(contextData, ({ date }) => date.getTime() <= now.getTime())
  const score = sumBy(compactedContextData, 'score')

  return (
    <div className='space-y-4 px-4'>
      <h2 className='text-3xl font-bold tracking-tight'>Overview - Week {currentWeek}</h2>
      <div className='flex gap-4 flex-col xl:flex-row items-start space-x-4'>
        <Card className='w-full xl:w-1/2'>
          <CardTitle>
            <CardHeader className='pb-0'>
              Score: {score} / {scoreGoal}
            </CardHeader>
          </CardTitle>
          <CardContent className='pb-2 h-96'>
            <DailyLineChart data={weekGroupedData.reverse().slice(0, 2)} />
          </CardContent>
        </Card>
        <div className='flex w-full flex-row xl:w-1/2 xl:h-full gap-x-4'>
          <div className='flex flex-col space-y-4 h-1/2'>
            {numericHeaders?.map(header => (
              <HabitCard
                {...header}
                data={map(compactedContextData, header.key)}
                goal={typedGoals[header.key]}
              />
            ))}
          </div>
          <div className='flex flex-wrap flex-1 gap-4 h-1/2'>
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

export default Overview2
