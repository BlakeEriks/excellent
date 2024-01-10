import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { RefreshCcw } from 'lucide-react'
import { ReactNode, useState } from 'react'
import Goals from './Goals'
import Overview from './Overview'
import Sider from './Sider'
import Flex from './components/Flex'
import { Button } from './components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'
import { activeSheetAtom, activeSheetIndexAtom, refreshSheetAtom, sheetsAtom } from './state/sheet'
import { readableDate, timeDifference } from './util/time'

export type Context = {
  key: number
  icon: string
  label: string
}

export enum CONTEXT {
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
  Year,
}

export const contexts: Context[] = [
  { key: 0, icon: '❄️', label: 'January' },
  { key: 1, icon: '🌹', label: 'Febuary' },
  { key: 2, icon: '☘️', label: 'March' },
  { key: 3, icon: '🌺', label: 'April' },
  { key: 4, icon: '🐝', label: 'May' },
  { key: 5, icon: '🌼', label: 'June' },
  { key: 6, icon: '☀️', label: 'July' },
  { key: 7, icon: '🍎', label: 'August' },
  { key: 8, icon: '🍁', label: 'September' },
  { key: 9, icon: '🎃', label: 'October' },
  { key: 10, icon: '🦃', label: 'November' },
  { key: 11, icon: '🎄', label: 'December' },
  { key: 12, icon: '📆', label: 'Year' },
]

const now = new Date()

const Overlay = ({ children }: { children: ReactNode }) => (
  <div className='absolute z-50 h-full w-full flex justify-center items-center bg-slate-500 bg-opacity-10'>
    {children}
  </div>
)

const App = () => {
  const { data, lastFetched } = useAtomValue(activeSheetAtom)
  const refreshSheet = useSetAtom(refreshSheetAtom)
  const [context, setContext] = useState<Context>(contexts[now.getMonth()])
  const [mode, setMode] = useState('overview')
  // const [openUrlDialog, setOpenUrlDialog] = useState(false)
  const sheetUrls = useAtomValue(sheetsAtom)
  const [activeSheetIndex, setActiveSheetIndex] = useAtom(activeSheetIndexAtom)
  const activeSheet = useAtomValue(activeSheetAtom)

  console.log('data', data, activeSheetIndex)

  const handleClickLinkButton = () => {
    if (activeSheet) {
      window.open(activeSheet.url, '_blank')
    }
  }

  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <div className='flex flex-col relative flex-1 shadow-lg bg-background border max-w-fit gap-y-4 rounded-lg'>
        {/* {isFetching && (
          <Overlay>
            <Loader2 className='animate-spin' />
          </Overlay>
        )} */}
        <div className='flex items-center border-b p-4 px-4 uppercase tracking-[1px] space-x-2'>
          <Select
            value={activeSheetIndex.toString()}
            onValueChange={val => setActiveSheetIndex(Number(val))}
          >
            <SelectTrigger className='w-40 text-md'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sheetUrls
                .sort((a, b) => b.year - a.year)
                .map(({ year }, index) => (
                  <SelectItem key={index} value={index.toString()} className='text-md border-b'>
                    {year}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <span className='text-xl flex-1'>{readableDate(now)}</span>
          <Flex className='gap-2'>
            {/* <Button variant='outline' onClick={handleClickLinkButton}>
              <Link />
            </Button> */}
            <Button variant='outline' onClick={refreshSheet}>
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
      {/* <SheetUrlDialog open={openUrlDialog} setOpen={setOpenUrlDialog} setUrl={setUrl} /> */}
    </div>
  )
}

export default App
