import { User } from 'lucide-react'
import { useEffect } from 'react'
import { months } from './App'
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

const now = new Date()

type HeaderProps = {
  context: string
  setContext: (context: string) => void
  mode: string
  setMode: (mode: string) => void
}

const Sider = ({ context, setContext, mode, setMode }: HeaderProps) => {
  const { lastFetched, refreshData } = useHabitData()

  useEffect(() => {
    if (lastFetched && lastFetched.getTime() < now.getTime() - 1000 * 60 * 60 * 24) {
      refreshData()
    }
  }, [])

  return (
    <div className='flex flex-col items-center justify-between p-4 border-r'>
      <div className='flex flex-col space-y-4'>
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
      </div>
    </div>
  )
}

export default Sider
