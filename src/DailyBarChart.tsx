import BarChart from './BarChart'

const DailyBarChart = ({ data, keys }: any) => {
  return (
    <BarChart
      margin={{ left: -5, top: 5, bottom: 40 }}
      padding={0.3}
      data={data}
      keys={keys}
      colors={['#adfa1d']}
      index='index'
      axisBottom={{
        tickSize: 0,
        tickRotation: -45,
        legend: 'July',
        legendPosition: 'middle',
        legendOffset: 30,
      }}
    />
  )
}

export default DailyBarChart
