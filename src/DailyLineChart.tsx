import { ResponsiveLine } from '@nivo/line'
import { findIndex } from 'lodash'
import { months } from './App'
import useGoals from './hook/goals'
import { HabitData } from './hook/habitData'
import { getDaysInMonth } from './util/time'

const DailyLineChart = ({
  context,
  data /* see data tab */,
}: {
  context: string
  data: HabitData[]
}) => {
  const { scoreGoal } = useGoals(context)
  const daysInMonth = getDaysInMonth(findIndex(months, { key: context }))
  const scoreData = data.map((_, index) => ({
    x: index + 1,
    y: data.slice(0, index + 1).reduce((acc, item) => acc + (item.score ?? 0), 0),
  }))

  const goalData = new Array(daysInMonth)
    .fill(0)
    .map((_, index) => ({
      x: index + 1,
      y: Math.ceil(((index + 1) * scoreGoal) / daysInMonth),
    }))
    .slice(0, scoreData.length)

  const data2 = [
    {
      id: 'score',
      data: scoreData,
    },
    {
      id: 'goal',
      data: goalData,
    },
  ]

  return data2.length ? (
    <ResponsiveLine
      // width={800} // You can set the width according to your needs
      // height={400} // You can set the height according to your needs
      data={data2}
      curve='natural'
      margin={{ top: 25, right: 110, bottom: 50, left: 60 }}
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
        legend: 'Day of Month',
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
      colors={['#adfa1d', '#FFD700']}
      pointSize={8}
      pointBorderColor={{ from: 'serieColor' }}
      pointColor={{ from: 'color', modifiers: [] }}
      // pointBorderWidth={0}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          translateX: 100,
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
        },
      ]}
    />
  ) : null
}

export default DailyLineChart

// const MyResponsiveLine = ({ data /* see data tab */ }) => (
//   <ResponsiveLine
//       data={data}
//       margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//       xScale={{ type: 'point' }}
//       yScale={{
//           type: 'linear',
//           min: 'auto',
//           max: 'auto',
//           stacked: true,
//           reverse: false
//       }}
//       yFormat=" >-.2f"
//       axisTop={null}
//       axisRight={null}
//       axisBottom={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: 'transportation',
//           legendOffset: 36,
//           legendPosition: 'middle'
//       }}
//       axisLeft={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: 'count',
//           legendOffset: -40,
//           legendPosition: 'middle'
//       }}
//       pointSize={10}
//       pointColor={{ theme: 'background' }}
//       pointBorderWidth={2}
//       pointBorderColor={{ from: 'serieColor' }}
//       pointLabelYOffset={-12}
//       useMesh={true}
//       legends={[
//           {
//               anchor: 'bottom-right',
//               direction: 'column',
//               justify: false,
//               translateX: 100,
//               translateY: 0,
//               itemsSpacing: 0,
//               itemDirection: 'left-to-right',
//               itemWidth: 80,
//               itemHeight: 20,
//               itemOpacity: 0.75,
//               symbolSize: 12,
//               symbolShape: 'circle',
//               symbolBorderColor: 'rgba(0, 0, 0, .5)',
//               effects: [
//                   {
//                       on: 'hover',
//                       style: {
//                           itemBackground: 'rgba(0, 0, 0, .03)',
//                           itemOpacity: 1
//                       }
//                   }
//               ]
//           }
//       ]}
//   />
// )
