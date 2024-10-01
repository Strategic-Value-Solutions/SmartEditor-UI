import { renderChart } from './components/ChartRender'
import ProjectFilter from './components/ProjectFilter'
import StatusFilter from './components/StatusFilter'
import { Button } from '@/components/ui/button'
import projectApi from '@/service/projectApi'
import { FileTextIcon, ImageIcon } from '@radix-ui/react-icons'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const chartRef = useRef(null)
  const { projectId } = useParams()
  const [analytics, setAnalytics] = useState<any>({})
  const [filter, setFilter] = useState('All')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      const analytics = await projectApi.getAnalytics(projectId)
      setAnalytics(analytics)
    }
    fetchAnalytics()
  }, [projectId])

  const handleFilterChange = (value: string | undefined) => {
    if (!value) {
      return
    }
    setFilter(value)
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
  }

  const filteredData = Object.entries(analytics).map(([key, value]: any) => ({
    name: key,
    value: (value.Pending || 0) + (value.Working || 0) + (value.Completed || 0),
    ...value,
  }))

  // Convert JSON to CSV
  const downloadCSV = () => {
    const headers = ['Name', 'Pending', 'Working', 'Completed']
    const rows = filteredData.map((item: any) => [
      item.name,
      item.Pending || 0,
      item.Working || 0,
      item.Completed || 0,
    ])

    // Create a CSV string
    let csvContent =
      headers.join(',') + '\n' + rows.map((row) => row.join(',')).join('\n')

    // Create a Blob from the CSV string and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'analytics-data.csv'
    link.click()
  }

  // Download chart as an image
  const downloadImage = () => {
    if (chartRef.current === null) {
      return
    }
    toPng(chartRef.current)
      .then(function (dataUrl) {
        const link = document.createElement('a')
        link.download = 'analytics-chart.png'
        link.href = dataUrl
        link.click()
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
      })
  }

  // Convert data to PDF
  const downloadPDF = () => {
    const doc = new jsPDF()
    const tableColumn = ['Name', 'Pending', 'Working', 'Completed']
    const tableRows: any[] = []

    filteredData.forEach((item: any) => {
      const row = [
        item.name,
        item.Pending || 0,
        item.Working || 0,
        item.Completed || 0,
      ]
      tableRows.push(row)
    })

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    })
    doc.save('analytics-data.pdf')
  }

  return (
    <div className='flex flex-col h-full w-full space-y-8'>
      <h1 className='text-2xl font-bold'>Analytics</h1>

      <div className='flex justify-between'>
        <ProjectFilter
          analytics={analytics}
          onFilterChange={handleFilterChange}
        />
        <StatusFilter onStatusChange={toggleStatus} />
      </div>

      <div className='flex space-x-4 mt-4'>
        <Button onClick={downloadCSV} className='btn'>
          <FileTextIcon className='mr-2' /> Download CSV
        </Button>
        <Button onClick={downloadImage} className='btn'>
          <ImageIcon className='mr-2' /> Download Image
        </Button>
        <Button onClick={downloadPDF} className='btn'>
          <FileTextIcon className='mr-2' /> Download PDF
        </Button>
      </div>

      <div ref={chartRef} className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
        <ResponsiveContainer width='100%' height={400}>
          {renderChart('Bar Chart', filteredData, 0, () => {})}
        </ResponsiveContainer>
        <ResponsiveContainer width='100%' height={400}>
          {renderChart('Pie Chart', filteredData, 0, () => {})}
        </ResponsiveContainer>
        <ResponsiveContainer width='100%' height={400}>
          {renderChart('Line Chart', filteredData, 0, () => {})}
        </ResponsiveContainer>
        <ResponsiveContainer width='100%' height={400}>
          {renderChart('Area Chart', filteredData, 0, () => {})}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
