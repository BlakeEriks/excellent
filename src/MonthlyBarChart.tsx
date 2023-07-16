import { ResponsiveBar } from '@nivo/bar'

const MonthlyBarChart = ({ data }: any) => {
  return (
    // <BarChart
    //   data={data}
    //   index='month'
    //   keys={[['count', 'projected']]}
    //   colors={['#adfa1d']}
    //   padding={0.3}
    //   margin={{ left: -20, top: 5, bottom: 20 }}
    //   axisBottom={{
    //     tickSize: 0,
    //     tickRotation: -45,
    //     legend: '2023',
    //     legendPosition: 'middle',
    //     legendOffset: 30,
    //   }}
    //   defs={[
    //     {
    //       id: 'dots',
    //       type: 'patternLines',
    //       background: 'inherit',
    //       color: '#adfa1d',
    //       spacing: 6,
    //       lineWidth: 1,
    //     },
    //   ]}
    //   fill={[
    //     {
    //       match: {
    //         id: 'projected',
    //       },
    //       id: 'dots',
    //     },
    //   ]}
    // />
    <div className='h-[200px]'>
      <ResponsiveBar
        data={data}
        keys={['count', 'projected']}
        indexBy={'month'}
        padding={0.3}
        margin={{ left: -20, top: 5, bottom: 40 }}
        valueScale={{ type: 'linear' }}
        enableGridY={false}
        colors={['#adfa1d', '#fff']}
        animate={true}
        axisBottom={{
          tickSize: 0,
          tickRotation: -45,
          legend: '2023',
          legendPosition: 'middle',
          legendOffset: 35,
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

export default MonthlyBarChart
