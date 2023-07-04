import { ResponsiveBar } from '@nivo/bar'

const Bar = ({ data }: any) => {
  return (
    <div className='h-[200px]'>
      <ResponsiveBar
        data={data}
        keys={['count', 'projected']}
        indexBy='month'
        margin={{ left: -20, top: 5, bottom: 20 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        enableGridY={false}
        colors={['#adfa1d', '#fff']}
        label={d => `${d.data.count}`}
        animate={true}
        axisBottom={{
          tickSize: 0,
        }}
        enableLabel={false}
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
    </div>
  )
}

export default Bar
