import { ResponsiveLine } from '@nivo/line'
import { HabitData } from './hook/habitData'

const DailyLineChart = ({ data /* see data tab */ }: { data: HabitData[] }) => {
  const data2 = [
    {
      id: 'score',
      data: data.map((item, index) => ({
        x: index + 1,
        y: data.slice(0, index + 1).reduce((acc, item) => acc + (item.score ?? 0), 0),
      })),
    },
  ]

  return data2.length ? (
    <ResponsiveLine
      // width={800} // You can set the width according to your needs
      // height={400} // You can set the height according to your needs
      data={data2}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{
        type: 'point',
      }}
      yScale={{
        type: 'linear',
        min: 0,
        max: 'auto',
        stacked: false,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        // orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Date (MM/DD)',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        // orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Score',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      colors={{ scheme: 'nivo' }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
    />
  ) : null
}

export default DailyLineChart
