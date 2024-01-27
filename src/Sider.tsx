import { useAtomValue } from 'jotai'
import { User } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Context, contexts } from './App'
import Nav from './Nav'
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
import { activeSheetAtom } from './state/sheet'

const now = new Date()

type HeaderProps = {
  context: Context
  setContext: (context: Context) => void
  mode: string
  setMode: (mode: string) => void
}

const Sider = ({ context, setContext, mode, setMode }: HeaderProps) => {
  const { lastFetched, refreshData } = useHabitData()
  const { year } = useAtomValue(activeSheetAtom)

  useEffect(() => {
    if (lastFetched && lastFetched.getTime() < now.getTime() - 1000 * 60 * 60 * 24) {
      refreshData()
    }
  }, [lastFetched, refreshData])

  const availableContexts = useMemo(() => {
    if (year === now.getFullYear()) {
      return contexts.slice(0, now.getMonth() + 1)
    }
    return contexts.slice(0, 12)
  }, [year])

  return (
    <div className='flex flex-col items-center justify-between p-4 border-r'>
      <div className='flex flex-col space-y-4'>
        <Select
          value={context.key.toString()}
          onValueChange={val => setContext(contexts[Number(val)])}
        >
          <SelectTrigger className='w-40 text-md'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='12' className='text-md border-b'>
              📆 Year
            </SelectItem>
            <SelectGroup>
              <SelectLabel>Months</SelectLabel>
              {availableContexts.map(({ icon, label, key }, index) => (
                <SelectItem key={index} value={key.toString()} className='text-md'>
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
      </div>
    </div>
  )
}

export default Sider
