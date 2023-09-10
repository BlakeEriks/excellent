import { parseTime } from '@/util/time'
import { camelCase } from 'lodash'
import { useCallback, useEffect, useState } from 'react'

export type HabitData = {
  date: Date
  [key: string]: Date | number | boolean
  wakeupTime: Date
  pushupCount: number
  run: number
  coldShower: boolean
  breathe: boolean
  read: boolean
  journal: boolean
  lift: boolean
  yoga: boolean
  vitamins: boolean
  score: number
}

export type HabitHeader = {
  key: string
  icon: string | undefined
  label: string
  datatype: 'number' | 'time' | 'boolean'
}

type ParserByType = {
  [key: string]: (value: string) => boolean | number | Date
}

const parserByType: ParserByType = {
  boolean: (value: string) => value === 'TRUE',
  number: (value: string) => Number(value),
  time: (value: string) => parseTime(value),
}

const HABIT_DATA_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuGKRM2RxWTaV4laTKCyUvtNBzqXlImi-D-Y9vCqMjB-z_GSDwodNZv0-ePFJOgQGAvJIeNlhah_7j/pub?output=csv'

const useHabitData = () => {
  const [rawHabitData, setRawHabitData] = useState<string | null>(localStorage.getItem('data'))
  const [habitData, setHabitData] = useState<HabitData[]>([])
  const [habitHeaders, setHabitHeaders] = useState<HabitHeader[]>([])
  const [lastFetched, setLastFetched] = useState<Date | null>(() => {
    const lastFetched = localStorage.getItem('lastFetched')
    return lastFetched ? new Date(lastFetched) : null
  })
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const refreshData = useCallback(async () => {
    setIsFetching(true)
    fetch(HABIT_DATA_URL)
      .then(res => res.text())
      .then(data => {
        setRawHabitData(data)
        localStorage.setItem('data', data)
        const now = new Date()
        setLastFetched(now)
        localStorage.setItem('lastFetched', now.toISOString())
        setIsFetching(false)
      })
  }, [])

  useEffect(() => {
    if (!rawHabitData) {
      refreshData()
    } else {
      const { parsedData, headers } = parseData(rawHabitData)
      setHabitData(parsedData)
      setHabitHeaders(headers)
    }
  }, [rawHabitData, refreshData])

  return { habitData, habitHeaders, lastFetched, refreshData, isFetching }
}

const parseData = (rawData: string) => {
  const splitData = rawData.split('\r\n').map((row: string) => row.split(','))
  const parsedData: HabitData[] = []

  const headers = []
  for (let i = 2; i < splitData.length; i++) {
    const split = splitData[i][0].split(' ')
    const datatype = splitData[i][1] as 'number' | 'time' | 'boolean'
    const icon = split.shift()
    const label = split.join(' ')
    headers.push({ icon, label, key: camelCase(label), datatype })
  }

  let month
  // Skip header declaration
  for (let i = 2; i < splitData[0].length; i++) {
    month = splitData[0][i].split(' ')[1] ?? month
    const day = splitData[1][i]
    const date = new Date(`${month} ${day}, 2023`)

    // End if date is in the future
    // if (date > new Date()) break
    // End if date is in next month
    if (date.getMonth() > new Date().getMonth()) break

    const item: Partial<HabitData> = { date, count: 0 }

    for (let j = 2; j < splitData.length; j++) {
      const { datatype, key } = headers[j - 2]
      const parser = parserByType[datatype]
      const value = splitData[j][i].trim()
      const parsedValue = parser(value)
      item[key] = parsedValue
    }
    if (date < new Date()) item.score = computeDayScore(item as HabitData)
    parsedData.push(item as HabitData)
  }

  return { parsedData, headers }
}

// 6 am
const GOAL_WAKEUP_TIME = (function () {
  const date = new Date()
  date.setHours(6, 0, 0, 0)
  return date
})()

export const computeDayScore = (habitData: HabitData) => {
  let score = 0

  // Wakeup time score
  if (habitData.wakeupTime < GOAL_WAKEUP_TIME) score += 10
  else {
    const wakeupTimeScore =
      10 - (habitData.wakeupTime.getTime() - GOAL_WAKEUP_TIME.getTime()) / 1000 / 60 / 15
    score += wakeupTimeScore > 0 ? wakeupTimeScore : 0
  }

  // Pushups score
  if (habitData.pushupCount) score += habitData.pushupCount * 0.1

  // Running score
  if (habitData.run) score += habitData.run * 3

  // Boolean habit scores
  if (habitData.coldShower) score += 5
  if (habitData.breathe) score += 5
  if (habitData.read) score += 5
  if (habitData.journal) score += 5
  if (habitData.lift) score += 5
  if (habitData.yoga) score += 5
  if (habitData.vitamins) score += 5

  return Math.floor(score)
}

export default useHabitData
