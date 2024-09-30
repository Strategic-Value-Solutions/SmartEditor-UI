'use client'

import projectApi from '@/service/projectApi'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Cell,
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
    percent,
    value,
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

export default function Analytics() {
  const { projectId } = useParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const [analytics, setAnalytics] = useState<any>({})

  useEffect(() => {
    const fetchAnalytics = async () => {
      const analytics = await projectApi.getAnalytics(projectId)
      console.log('analytics,', analytics)
      setAnalytics(analytics)
    }

    fetchAnalytics()
  }, [])

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const pieData = Object.entries(analytics).map(([key, value]: any) => ({
    name: key,
    value: value.Pending || 0 + value.Working || 0 + value.Completed || 0,
    Pending: value.Pending || 0,
    Working: value.Working || 0,
    Completed: value.Completed || 0,
  }))

  console.log('pieData,', pieData)
  const barData = Object.entries(analytics).map(([key, value]: any) => ({
    name: key,
    Pending: value.Pending,
    Working: value.Working,
    Completed: value.Completed,
  }))

  console.log('barData,', barData)
  return (
    <div className='flex flex-col h-full w-full space-y-8'>
      <h1 className='text-2xl font-bold'>Analytics</h1>

      <div className='flex flex-col space-y-8'>
        <div className='w-full'>
          <ResponsiveContainer width='100%' height={400}>
            <BarChart
              data={barData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='Pending' stackId='a' fill={colors.Pending} />
              <Bar dataKey='Working' stackId='a' fill={colors.Working} />
              <Bar dataKey='Completed' stackId='a' fill={colors.Completed} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='w-full'>
          <ResponsiveContainer width='100%' height={600}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieData}
                cx='50%'
                cy='50%'
                innerRadius={100}
                outerRadius={120}
                dataKey='value'
                onMouseEnter={onPieEnter}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(210, 90%, 70%)`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
