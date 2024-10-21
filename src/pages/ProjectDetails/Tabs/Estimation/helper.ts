export function initTasks() {
  const currentDate = new Date()
  const tasks = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      name: 'RF Magnet',
      id: 'RFMagnet',
      progress: 25,
      type: 'component',
      hideChildren: false,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 6),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      name: 'Gradient Coil Installation',
      id: 'GradientCoil',
      progress: 10,
      dependencies: ['RFMagnet'],
      type: 'component',
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 6),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 13),
      name: 'RF Coil Tuning',
      id: 'RFCoilTuning',
      progress: 5,
      dependencies: ['GradientCoil'],
      type: 'component',
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: 'Shim Coil Installation',
      id: 'ShimCoil',
      progress: 15,
      dependencies: ['RFCoilTuning'],
      type: 'component',
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 16),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      name: 'Main Power Supply Setup',
      id: 'PowerSupply',
      progress: 30,
      dependencies: ['ShimCoil'],
      type: 'component',
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
      name: 'Cryogen System Installation',
      id: 'CryogenSystem',
      progress: 10,
      dependencies: ['PowerSupply'],
      type: 'component',
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 26),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 31),
      name: 'System Calibration',
      id: 'SystemCalibration',
      progress: 0,
      dependencies: ['CryogenSystem'],
      type: 'component',
    },
  ]

  return tasks
}

export function getStartEndDateForProject(tasks, projectId) {
  const projectTasks = tasks.filter((t) => t.project === projectId)
  let start = projectTasks[0].start
  let end = projectTasks[0].end
  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i]
    if (start.getTime() > task.start.getTime()) {
      start = task.start
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end
    }
  }
  return [start, end]
}
