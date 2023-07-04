import { ResponsiveBar } from '@nivo/bar'

const BarChart = ({ data, index, keys, colors, defs, fill, padding, margin, axisBottom }: any) => {
  const dataWithIndex = data.map((d: any, i: number) => ({ ...d, index: i }))

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
        // label={d => `${d.data.count}`}
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
