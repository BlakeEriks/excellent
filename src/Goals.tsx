import { findIndex, isEmpty } from 'lodash'
import { SaveAllIcon, Undo2Icon } from 'lucide-react'
import { useMemo } from 'react'
import { months } from './App'
import Status from './components/Status'
import { Button } from './components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import useGoals from './hook/goals'
import useHabitData, { HabitData, computeDayScore } from './hook/habitData'
import { getDaysInMonth, parseTime } from './util/time'

type GoalsProps = {
  context: string
}

const Goals = ({ context }: GoalsProps) => {
  const { habitHeaders } = useHabitData()
  const { goals, errors, saveGoals, updateGoal, isGoalSaved, isAllGoalsSaved } = useGoals(context)

  const scoreGoal = useMemo(() => {
    const daysInMonth = getDaysInMonth(findIndex(months, { key: context }) + 1)
    const { pushupCount, run, wakeupTime, ...booleans } = goals
    const avgPushups = Number(pushupCount) / daysInMonth
    const avgMiles = Number(run) / daysInMonth
    const avgWakeupTime = parseTime(wakeupTime)

    let score = 0
    for (let i = 1; i <= daysInMonth; i++) {
      const data: Partial<HabitData> = {
        pushupCount: avgPushups,
        run: avgMiles,
        wakeupTime: avgWakeupTime as Date,
      }
      habitHeaders.forEach(
        ({ key }) => (data[key] = data[key] ?? i / daysInMonth <= Number(booleans[key]))
      )

      score += computeDayScore(data as HabitData)
    }

    return score
  }, [goals, context, habitHeaders])

  return (
    <div className='space-y-4 px-4'>
      <h2 className='text-3xl font-bold tracking-tight'>Goals</h2>
      <Card className=''>
        <CardTitle className='flex justify-between'>
          <CardHeader className='flex-1 pr-0'>Goal</CardHeader>
          <CardHeader className='flex-1 pl-0'>Value</CardHeader>
        </CardTitle>
        <CardContent className='space-y-2 pb-0'>
          {habitHeaders.map(({ label, icon, key }) => (
            <div className='flex justify-between items-center space-x-2' key={key}>
              <h3 className='flex-1 text-lg'>
                {icon} {label}:
              </h3>
              <input
                onChange={({ target }) => updateGoal({ [key]: target.value })}
                value={goals[key]}
                placeholder='value'
                className='flex-1 border border-gray-300'
              />
              <Status
                status={errors[key] ? 'red' : isGoalSaved(key, goals[key]) ? 'green' : 'yellow'}
              />
            </div>
          ))}
          <CardFooter className='justify-between p-0 py-4 border-t'>
            <h4 className='text-lg font-semibold tracking-wide'>Score: {scoreGoal}</h4>
            <div className='space-x-2'>
              <Button variant='secondary' size='sm' className='space-x-2'>
                <Undo2Icon /> <span>Reset</span>
              </Button>
              <Button
                size='sm'
                className='space-x-2'
                onClick={saveGoals}
                disabled={isAllGoalsSaved || !isEmpty(errors)}
              >
                <SaveAllIcon /> <span>Save</span>
              </Button>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default Goals
