import { filter, groupBy, reject, sumBy, values } from 'lodash'
import { RefreshCcw, User } from 'lucide-react'
import Bar from './BarChart'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import useHabitData, { HabitData, HabitHeader } from './hook/habitData'
import { timeDifference } from './util/time'

type DurationOptions = 'oneWeek' | 'twoWeeks' | 'oneMonth' | 'threeMonths' | 'sixMonths' | 'oneYear'

const months = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const now = new Date()
const start = new Date(now.getFullYear(), 0, 0)
const diff = now.getTime() - start.getTime()
const oneDay = 1000 * 60 * 60 * 24
const day = Math.floor(diff / oneDay)
console.log('Day of year: ' + day)

function App() {
  const { habitData, habitHeaders, lastFetched, refreshData } = useHabitData()
  const dataByMonth = groupBy(habitData, ({ date }: { date: Date }) => date.getMonth())
  const volumeByMonth: { month: string; count: number; projected?: number }[] = values(
    dataByMonth
  ).map((dataset, index) => ({
    month: months[index].slice(0, 3),
    count: sumBy(dataset, 'count'),
  }))

  const day = new Date().getDate()
  const last = volumeByMonth[volumeByMonth.length - 1]
  if (last) {
    last.projected = Math.floor((last.count / day) * 31)
  }

  const numericHeaders = reject(habitHeaders, { datatype: 'boolean' })
  const dataThisMonth = filter(habitData, ({ date }) => date.getMonth() === now.getMonth())
  console.log(dataThisMonth)

  // const pushupsAverage = (
  //   sum(
  //     pushups
  //       ?.slice(0, day)
  //       .slice(-31)
  //       .map((a: any) => Number(a))
  //   ) / 31
  // ).toFixed(1)

  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <div className='flex-1 shadow-lg bg-background border max-w-5xl space-y-4 rounded-lg'>
        <div className='flex h-16 items-center justify-between border-b p-4'>
          <h2 className='text-3xl font-bold '>Habit Dashboard</h2>
          <div className='flex items-center space-x-4'>
            <span>Blake Eriks</span>
            <User className='h-6 w-6' />
            <Button variant='outline' onClick={refreshData}>
              <RefreshCcw />
            </Button>
          </div>
        </div>
        <div className='flex items-start p-4 space-x-4'>
          <Card className='w-1/2'>
            <CardTitle>
              <CardHeader>Habit Volume</CardHeader>
            </CardTitle>
            <CardContent>
              <Bar data={volumeByMonth} />
            </CardContent>
          </Card>
          <div className='flex w-1/2 space-x-4'>
            {numericHeaders.map((header, index) => (
              <HabitCard key={index} habit={header} data={dataThisMonth} />
            ))}
          </div>
        </div>
        <div className='border-t p-4'>
          {lastFetched && (
            <p className='italic text-right text-slate-600'>
              last updated {timeDifference(lastFetched)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

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
      cardData.average = sumBy(data, key)
      break
    case 'number':
      cardData.average = sumBy(data, key)
      break
    case 'time': {
      const avgInMs =
        data.reduce((acc, data) => acc + (data[key] as Date).getTime(), 0) / data.length
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

export default App
