import { BarDatum, BarSvgProps } from '@nivo/bar'
import BarChart from './BarChart'

const MonthlyBarChart = (props: BarSvgProps<BarDatum>) => {
  return (
    <BarChart
      keys={[['count', 'projected']]}
      colors={['#adfa1d', '#fff']}
      padding={0.3}
      margin={{ left: -20, top: 5, bottom: 20 }}
      defs={[
        {
          id: 'dots',
          type: 'patternLines',
          background: 'inherit',
          color: '#adfa1d',
          spacing: 6,
          lineWidth: 1,
        },
      ]}
      fill={[
        {
          match: {
            id: 'projected',
          },
          id: 'dots',
        },
      ]}
    />
  )
}

export default MonthlyBarChart
