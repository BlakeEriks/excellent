import { Context } from '@/App'
import { getDaysInMonth, parseTime } from '@/util/time'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { compact, get, isEmpty, isEqual } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import useHabitData, { HabitData, HabitHeader, computeDayScore } from './habitData'

type Goal = { [key: string]: string }
type Goals = { [key: string]: Goal }

const getEmptyGoals = (key: string, headers: HabitHeader[]) => {
  return {
    [key]: headers.reduce((acc, { key }) => {
      acc[key] = ''
      return acc
    }, {} as Goal),
  }
}

const goalsAtom = atomWithStorage('goals', {} as Goals)

const now = new Date()

const isValidTime = (time: string) => {
  const pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return pattern.test(time)
}

const useGoals = (context: Context) => {
  const { habitHeaders } = useHabitData()
  const [savedGoals, setSavedGoals] = useAtom(goalsAtom)
  const contextKey = compact([context.label, now.getFullYear()]).join('-')
  const [goals, setGoals] = useState<Goals>({})
  const localGoals = goals[contextKey] ?? getEmptyGoals(contextKey, habitHeaders)[contextKey]
  const [errors, setErrors] = useState({} as { [key: string]: string })

  useEffect(() => {
    setGoals(isEmpty(savedGoals) ? getEmptyGoals(contextKey, habitHeaders) : savedGoals)
  }, [savedGoals, contextKey, habitHeaders])

  const validate = (goals: { [key: string]: string }) => {
    const errors = {} as { [key: string]: string }
    habitHeaders.forEach(({ key, datatype }) => {
      if (datatype === 'number' && goals[key] && isNaN(Number(goals[key]))) {
        errors[key] = 'Must be a number'
      }
      if (datatype === 'time' && goals[key] && !isValidTime(goals[key])) {
        errors[key] = 'Must be a time'
      }
    })
    setErrors(errors)
  }

  const saveGoals = () => {
    localStorage.setItem('goals', JSON.stringify(goals))

    // Update goals to re-render isSaved statuses
    setSavedGoals({ ...goals })
  }

  const updateGoal = (update: { [key: string]: string }) => {
    const newGoals = { ...localGoals, ...update }
    validate(newGoals)
    setGoals({ ...goals, [contextKey]: newGoals })
  }

  const isGoalSaved = (key: string, value: string) =>
    value &&
    get(JSON.parse(localStorage.getItem('goals') ?? '{}'), `${contextKey}.${key}`) === value

  const typedGoals = habitHeaders.reduce((acc, { key, datatype }) => {
    if (!savedGoals[contextKey]) return acc
    if (datatype === 'number') {
      acc[key] = Number(savedGoals[contextKey][key])
    } else if (datatype === 'time') {
      acc[key] = parseTime(savedGoals[contextKey][key])
    } else if (datatype === 'boolean') {
      acc[key] = savedGoals[contextKey][key] === 'true'
    }
    return acc
  }, {} as { [key: string]: number | Date | boolean })

  const isAllGoalsSaved = isEqual(JSON.parse(localStorage.getItem('goals') ?? '{}'), goals)

  const scoreGoal = useMemo(() => {
    const daysInMonth = getDaysInMonth(context.key)
    const { pushupCount, run, wakeupTime, ...booleans } = localGoals
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
  }, [localGoals, context, habitHeaders])

  return {
    typedGoals,
    goals: localGoals,
    errors,
    saveGoals,
    updateGoal,
    isGoalSaved,
    isAllGoalsSaved,
    scoreGoal,
  }
}

export default useGoals
