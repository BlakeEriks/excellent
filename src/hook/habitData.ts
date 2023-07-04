import { camelCase } from 'lodash'
import { useCallback, useEffect, useState } from 'react'

export type HabitData = {
  date: Date
  [key: string]: Date | number | boolean
  count: number
}

export type HabitHeader = {
  key: string
  icon: string | undefined
  label: string
  datatype: string
}

const parseTime = (value: string) => {
  const [hour, minute] = value.split(':')
  const date = new Date()
  date.setHours(Number(hour), Number(minute), 0, 0)
  return date
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

  const refreshData = useCallback(async () => {
    fetch(HABIT_DATA_URL)
      .then(res => res.text())
      .then(data => {
        setRawHabitData(data)
        localStorage.setItem('data', data)
        const now = new Date()
        setLastFetched(now)
        localStorage.setItem('lastFetched', now.toISOString())
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
  }, [rawHabitData])

  return { habitData, habitHeaders, lastFetched, refreshData }
}

const parseData = (rawData: string) => {
  const splitData = rawData.split('\r\n').map((row: string) => row.split(','))
  const parsedData: HabitData[] = []

  const headers = []
  for (let i = 2; i < splitData.length; i++) {
    const split = splitData[i][0].split(' ')
    const datatype = splitData[i][1]
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
    if (date > new Date()) break

    const item: HabitData = { date, count: 0 }

    for (let j = 2; j < splitData.length; j++) {
      const { datatype, key } = headers[j - 2]
      const parser = parserByType[datatype]
      const value = splitData[j][i].trim()
      const parsedValue = parser(value)
      item[key] = parsedValue
      if (parsedValue) item.count++
    }
    parsedData.push(item as HabitData)
  }

  return { parsedData, headers }
}

export default useHabitData
