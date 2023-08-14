import { months } from '@/App'
import { parseTime } from '@/util/time'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { compact, find, get, isEmpty, isEqual } from 'lodash'
import { useState } from 'react'
import useHabitData, { HabitHeader } from './habitData'

const getEmptyGoals = (key: string, headers: HabitHeader[]) => {
  return {
    [key]: headers.reduce((acc, { key }) => {
      acc[key] = ''
      return acc
    }, {} as { [key: string]: string }),
  }
}

const goalsAtom = atomWithStorage('goals', {} as { [key: string]: { [key: string]: string } })

const now = new Date()

const isValidTime = (time: string) => {
  const pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return pattern.test(time)
}

const useGoals = (context: string) => {
  const { habitHeaders } = useHabitData()
  const [savedGoals, setSavedGoals] = useAtom(goalsAtom)
  const contextKey = compact([find(months, { key: context })?.label, now.getFullYear()]).join('-')
  const [goals, setGoals] = useState(
    isEmpty(savedGoals) ? getEmptyGoals(contextKey, habitHeaders) : savedGoals
  )
  const localGoals = goals[contextKey] ?? getEmptyGoals(contextKey, habitHeaders)[contextKey]
  const [errors, setErrors] = useState({} as { [key: string]: string })

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

  return {
    typedGoals,
    goals: localGoals,
    errors,
    saveGoals,
    updateGoal,
    isGoalSaved,
    isAllGoalsSaved,
  }
}

export default useGoals
