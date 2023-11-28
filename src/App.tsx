import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Link, Loader2, RefreshCcw } from 'lucide-react'
import { ReactNode, useState } from 'react'
import Goals from './Goals'
import Overview from './Overview'
import Sider from './Sider'
import Flex from './components/Flex'
import { SheetUrlDialog } from './components/SheetUrlDialog'
import { Button } from './components/ui/button'
import useHabitData from './hook/habitData'
import { readableDate, timeDifference } from './util/time'

export type Context = {
  key: number
  icon: string
  label: string
}

export enum CONTEXT {
  Year,
  January,
  Febuary,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

export const contexts: Context[] = [
  { key: 0, icon: '📅', label: 'Year' },
  { key: 1, icon: '❄️', label: 'January' },
  { key: 2, icon: '🌹', label: 'Febuary' },
  { key: 3, icon: '☘️', label: 'March' },
  { key: 4, icon: '🌺', label: 'April' },
  { key: 5, icon: '🐝', label: 'May' },
  { key: 6, icon: '🌼', label: 'June' },
  { key: 7, icon: '☀️', label: 'July' },
  { key: 8, icon: '🍎', label: 'August' },
  { key: 9, icon: '🍁', label: 'September' },
  { key: 10, icon: '🎃', label: 'October' },
  { key: 11, icon: '🦃', label: 'November' },
  { key: 12, icon: '🎄', label: 'December' },
]

const now = new Date()

const Overlay = ({ children }: { children: ReactNode }) => (
  <div className='absolute z-50 h-full w-full flex justify-center items-center bg-slate-500 bg-opacity-10'>
    {children}
  </div>
)

const sheetURL = atomWithStorage<string>('sheetURL', '')

const App = () => {
  const { lastFetched, isFetching, refreshData } = useHabitData()
  const [context, setContext] = useState<Context>(contexts[now.getMonth()])
  const [mode, setMode] = useState('overview')
  const [url, setUrl] = useAtom(sheetURL)
  const [openUrlDialog, setOpenUrlDialog] = useState(false)

  const handleClickLinkButton = () => {
    if (url) {
      window.open(url, '_blank')
    } else {
      setOpenUrlDialog(true)
    }
  }

  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <div className='flex flex-col relative flex-1 shadow-lg bg-background border max-w-fit gap-y-4 rounded-lg'>
        {isFetching && (
          <Overlay>
            <Loader2 className='animate-spin' />
          </Overlay>
        )}

        <div className='flex items-center border-b p-4 px-4 uppercase tracking-[1px]'>
          <span className='text-xl flex-1'>{readableDate(now)}</span>
          <Flex className='gap-2'>
            <Button variant='outline' onClick={handleClickLinkButton}>
              <Link />
            </Button>
            <Button variant='outline' onClick={refreshData}>
              <RefreshCcw />
            </Button>
          </Flex>
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
      <SheetUrlDialog open={openUrlDialog} setOpen={setOpenUrlDialog} setUrl={setUrl} />
    </div>
  )
}

export default App
