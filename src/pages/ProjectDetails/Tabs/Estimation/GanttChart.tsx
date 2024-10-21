import { getStartEndDateForProject, initTasks } from './helper'
import { ViewMode, Gantt, Task } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import React from 'react'

//Init
const App = () => {
  const [view, setView] = React.useState(ViewMode.Day)
  const [tasks, setTasks] = React.useState(initTasks())
  const [isChecked, setIsChecked] = React.useState(false)
  let columnWidth = 60
  if (view === ViewMode.Month) {
    columnWidth = 300
  } else if (view === ViewMode.Week) {
    columnWidth = 250
  }
  const handleTaskChange = (task) => {
    console.log('On date change Id:' + task.id)
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t))
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project)
      const project = newTasks[newTasks.findIndex((t) => t.id === task.project)]
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end }
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        )
      }
    }
    setTasks(newTasks)
  }
  const handleTaskDelete = (task) => {
    const conf = window.confirm('Are you sure about ' + task.name + ' ?')
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id))
    }
    return conf
  }
  const handleProgressChange = async (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    console.log('On progress change Id:' + task.id)
  }
  const handleDblClick = (task) => {
    alert('On Double Click event Id:' + task.id)
  }
  const handleSelect = (task, isSelected) => {
    console.log(task.name + ' has ' + (isSelected ? 'selected' : 'unselected'))
  }
  const handleExpanderClick = (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    console.log('On expander click Id:' + task.id)
  }

  return (
    <div className='w-full'>
      <p className='py-3 text-lg font-semibold'>Timeline</p>
      <div className='w-[90vw] overflow-auto'>
        <Gantt
          tasks={tasks as Task[]}
          viewMode={view}
          onDateChange={handleTaskChange}
          onDelete={handleTaskDelete}
          onProgressChange={handleProgressChange}
          onDoubleClick={handleDblClick}
          onSelect={handleSelect}
          onExpanderClick={handleExpanderClick}
          listCellWidth={isChecked ? '155px' : ''}
          columnWidth={columnWidth}
        />
      </div>
    </div>
  )
}
export default App
