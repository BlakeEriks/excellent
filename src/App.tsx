import { Loader2, RefreshCcw, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import Goals from './Goals'
import Nav from './Nav'
import Overview from './Overview'
import { Button } from './components/ui/button'
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

export const months = [
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
  const { lastFetched, refreshData, isFetching } = useHabitData()
  const [context, setContext] = useState<string>(months[now.getMonth()].key)
  const [mode, setMode] = useState('overview')

  useEffect(() => {
    if (lastFetched && lastFetched.getTime() < now.getTime() - 1000 * 60 * 60 * 24) {
      refreshData()
    }
  }, [])

  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <div className='relative flex-1 shadow-lg bg-background border max-w-fit space-y-4 rounded-lg'>
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
                  📆 {now.getFullYear()}
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
            <Nav active={mode} setActive={setMode} />
          </div>
          <div className='flex items-center space-x-4'>
            <span>Blake Eriks</span>
            <User className='h-6 w-6' />
            <Button variant='outline' onClick={refreshData}>
              <RefreshCcw />
            </Button>
          </div>
        </div>

        {mode === 'overview' && <Overview context={context} />}

        {mode === 'goals' && <Goals context={context} />}

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
