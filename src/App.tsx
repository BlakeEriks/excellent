import { filter, groupBy, reject, sumBy, values } from 'lodash'
import { Loader2, RefreshCcw, User } from 'lucide-react'
import { useState } from 'react'
import DailyBarChart from './DailyBarChart'
import HabitCard from './HabitCard'
import MonthlyBarChart from './MonthlyBarChart'
import Nav from './Nav'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'
import useHabitData from './hook/habitData'
import { timeDifference } from './util/time'

const months = [
  { key: '0', icon: '❄️', label: 'January' },
  { key: '1', icon: '🌹', label: 'Febuary' },
  { key: '2', icon: '☘️', label: 'March' },
  { key: '3', icon: '🌺', label: 'April' },
  { key: '4', icon: '🐝', label: 'May' },
  { key: '5', icon: '🌼', label: 'June' },
  { key: '6', icon: '☀️', label: 'July' },
  { key: '7', icon: '🍎', label: 'August' },
  { key: '8', icon: '🍁', label: 'September' },
  { key: '9', icon: '🎃', label: 'October' },
  { key: '10', icon: '🦃', label: 'November' },
  { key: '11', icon: '🎄', label: 'December' },
]

const now = new Date()

const Overlay = ({ children }: any) => (
  <div className='absolute z-50 h-full w-full flex justify-center items-center bg-slate-500 bg-opacity-10'>
    {children}
  </div>
)

const App = () => {
  const { habitData, habitHeaders, lastFetched, refreshData, isFetching } = useHabitData()
  const dataByMonth = groupBy(habitData, ({ date }: { date: Date }) => date.getMonth())
  const [context, setContext] = useState<string>(months[now.getMonth()].key)
  const volumeByMonth: { month: string; count: number; projected?: number }[] = values(
    dataByMonth
  ).map((dataset, index) => ({
    month: months[index].label.slice(0, 3),
    count: sumBy(dataset, 'count'),
  }))

  const day = now.getDate()
  const last = volumeByMonth[volumeByMonth.length - 1]
  if (last) {
    last.projected = Math.floor((last.count / day) * 31)
  }

  const numericHeaders = reject(habitHeaders, { datatype: 'boolean' })
  const dataThisMonth = filter(
    habitData,
    ({ date }) => context === 'year' || String(date.getMonth()) === context
  )
  const compactedDataThisMonth = filter(
    dataThisMonth,
    ({ date }) => date.getDate() <= now.getDate()
  )
  console.log(habitHeaders)

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
      <div className='relative flex-1 shadow-lg bg-background border max-w-5xl space-y-4 rounded-lg'>
        {isFetching && (
          <Overlay>
            <Loader2 className='animate-spin' />
          </Overlay>
        )}
        <div className='flex h-16 items-center justify-between border-b p-4'>
          <div className='flex space-x-4'>
            <Select value={`${context}`} onValueChange={setContext}>
              <SelectTrigger className='w-40 text-md'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='year' className='text-md border-b'>
                  📆 2023
                </SelectItem>
                <SelectGroup>
                  <SelectLabel>Months</SelectLabel>
                  {months
                    .slice(0, now.getMonth() + 1)
                    .reverse()
                    .map(({ icon, label, key }, index) => (
                      <SelectItem key={index} value={key} className='text-md'>
                        {icon} {label}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Nav />
          </div>
          <div className='flex items-center space-x-4'>
            <span>Blake Eriks</span>
            <User className='h-6 w-6' />
            <Button variant='outline' onClick={refreshData}>
              <RefreshCcw />
            </Button>
          </div>
        </div>
        <div className='px-4'>
          <h2 className='text-3xl font-bold tracking-tight'>Habit Dashboard</h2>
        </div>
        <div className='flex items-start px-4 space-x-4'>
          <Card className='w-1/2'>
            <CardTitle>
              <CardHeader>Habit Volume</CardHeader>
            </CardTitle>
            <CardContent className='pb-2'>
              {context === 'year' ? (
                <MonthlyBarChart data={volumeByMonth} />
              ) : (
                <DailyBarChart data={dataThisMonth} keys={['score']} />
              )}
            </CardContent>
          </Card>
          <div className='flex w-1/2 space-x-4'>
            {numericHeaders.map((header, index) => (
              <HabitCard key={index} habit={header} data={compactedDataThisMonth} />
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

export default App
