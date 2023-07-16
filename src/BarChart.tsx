import { ResponsiveBar } from '@nivo/bar'

const BarChart = ({
  data,
  index = 'index',
  keys,
  colors,
  defs,
  fill,
  padding,
  margin,
  axisBottom,
}: any) => {
  const dataWithIndex = data.map((d: any, i: number) => ({ ...d, index: i + 1 }))

  return (
    <div className='h-[200px]'>
      <ResponsiveBar
        data={dataWithIndex}
        keys={keys}
        indexBy={index}
        margin={margin}
        padding={padding}
        valueScale={{ type: 'linear' }}
        enableGridY={false}
        colors={colors}
        animate={true}
        axisBottom={axisBottom}
        enableLabel={false}
        defs={defs}
        fill={fill}
      />
    </div>
  )
}

export default BarChart
