import { Loader2, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import Goals from './Goals'
import Overview from './Overview'
import Sider from './Sider'
import { Button } from './components/ui/button'
import useHabitData from './hook/habitData'
import { readableDate, timeDifference } from './util/time'

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
  const { lastFetched, isFetching, refreshData } = useHabitData()
  const [context, setContext] = useState<string>(months[now.getMonth()].key)
  const [mode, setMode] = useState('overview')

  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <div className='flex flex-col relative flex-1 shadow-lg bg-background border max-w-fit gap-y-4 rounded-lg'>
        {isFetching && (
          <Overlay>
            <Loader2 className='animate-spin' />
          </Overlay>
        )}

        <div className='flex justify-between items-center border-b p-4 px-4 uppercase tracking-[1px]'>
          <span className='text-xl'>{readableDate(now)}</span>
          <Button variant='outline' onClick={refreshData}>
            <RefreshCcw />
          </Button>
        </div>

        <div className='flex space-x-4'>
          <Sider context={context} setContext={setContext} mode={mode} setMode={setMode} />

          {mode === 'overview' && <Overview context={context} />}

          {mode === 'goals' && <Goals context={context} />}
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
