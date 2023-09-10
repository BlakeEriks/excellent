export const timeDifference = (previous: Date) => {
  const now = new Date()
  const diffInSeconds = Math.abs(now.getTime() - previous.getTime()) / 1000

  if (diffInSeconds < 60) {
    return 'less than 1 minute'
  } else if (diffInSeconds < 3600) {
    // 60 minutes * 60 seconds
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minutes ago`
  } else if (diffInSeconds < 86400) {
    // 24 hours * 60 minutes * 60 seconds
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hours ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} days ago`
  }
}

export const parseTime = (value: string) => {
  if (!value) return false
  const [hour, minute] = value.split(':')
  const date = new Date()
  date.setHours(Number(hour), Number(minute), 0, 0)
  return date
}

export const formatTime = (date: Date) => {
  const averageHours = date.getHours()
  const averageMinutes = date.getMinutes()
  return `${averageHours}:${averageMinutes < 10 ? '0' : ''}${averageMinutes}`
}

export const getDaysInMonth = (month: number, year = new Date().getFullYear()) =>
  new Date(year, month, 0).getDate()
