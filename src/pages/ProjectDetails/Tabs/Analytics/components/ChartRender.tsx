import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  Sector,
  Bar,
  Cell,
  CartesianGrid,
  Line,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Area,
  Pie,
} from 'recharts'

const colors = {
  Pending: 'hsl(0, 100%, 80%)',
  Working: 'hsl(210, 100%, 70%)',
  Completed: 'hsl(120, 100%, 70%)',
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={36}
        textAnchor={textAnchor}
        fill='#999'
      >
        {`Pending: ${payload.Pending}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={54}
        textAnchor={textAnchor}
        fill='#999'
      >
        {`Working: ${payload.Working}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={72}
        textAnchor={textAnchor}
        fill='#999'
      >
        {`Completed: ${payload.Completed}`}
      </text>
    </g>
  )
}

export const renderChart = (
  type: string,
  data: any,
  activeIndex: number,
  onPieEnter: (index: number) => void
) => {
  // Check if there's no data or the data is empty
  if (!data || data.length === 0) {
    return <p>No data available</p>
  }

  switch (type) {
    case 'Bar Chart':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='Pending' fill={colors.Pending} />
          <Bar dataKey='Working' fill={colors.Working} />
          <Bar dataKey='Completed' fill={colors.Completed} />
        </BarChart>
      )
    case 'Pie Chart':
      return (
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            dataKey='value'
            cx='50%'
            cy='50%'
            outerRadius={120}
            onMouseEnter={(_, index) => onPieEnter(index)}
          >
            {data.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index === 0
                    ? colors.Pending
                    : index === 1
                      ? colors.Working
                      : colors.Completed
                }
              />
            ))}
          </Pie>
        </PieChart>
      )
    case 'Line Chart':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey='Pending' stroke={colors.Pending} />
          <Line type='monotone' dataKey='Working' stroke={colors.Working} />
          <Line type='monotone' dataKey='Completed' stroke={colors.Completed} />
        </LineChart>
      )
    case 'Area Chart':
      return (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type='monotone' dataKey='Pending' fill={colors.Pending} />
          <Area type='monotone' dataKey='Working' fill={colors.Working} />
          <Area type='monotone' dataKey='Completed' fill={colors.Completed} />
        </AreaChart>
      )

    default:
      return (
        <div className='flex items-center justify-center h-full w-full'>
          <p className='text-center'>No chart available</p>
        </div>
      )
  }
}
