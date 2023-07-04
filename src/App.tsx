import { filter, groupBy, reject, sumBy, values } from 'lodash'
import { User } from 'lucide-react'
import { useState } from 'react'
import Bar from './BarChart'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import useHabitData, { HabitData, HabitHeader } from './hook/habitData'

type DurationOptions = 'oneWeek' | 'twoWeeks' | 'oneMonth' | 'threeMonths' | 'sixMonths' | 'oneYear'
const durationOptions: DurationOptions[] = [
  'oneWeek',
  'twoWeeks',
  'oneMonth',
  'threeMonths',
  'sixMonths',
  'oneYear',
]
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
  const [value, setValue] = useState<DurationOptions>('oneMonth')

  const { habitData, habitHeaders } = useHabitData()

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

  // console.log(numericFields)
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
            {/* <Select value={value}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {durationOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {startCase(option)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button>
              <Download className='mr-2 h-4 w-4' />
              Download
            </Button> */}
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
          {/* <div className='h-96 w-1/2 shadow-xl border rounded-lg p-4'> */}
          {/* <h3 className='text-xl px-3'></h3> */}

          {/* <h3 className='text-2xl'>Pushup Counter: {pushupsCount}</h3>
            <h3 className='text-2xl'>Daily Average: {pushupsAverage}</h3> */}
          {/* </div> */}
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
        <CardHeader className='font-light text-center h-24 justify-center'>{label}</CardHeader>
        <div className='absolute top-0 left-0 text-[16px] p-1 border-b border-r'>{icon}</div>
      </CardTitle>
      <CardContent className='pb-0 bg-[#e5e7eb]'>
        <h1 className='text-5xl text-slate-800 text-center leading-relaxed font-semibold'>
          {cardData.average}
        </h1>
      </CardContent>
    </Card>
  )
}

export default App
