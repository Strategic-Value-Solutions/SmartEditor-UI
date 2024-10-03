import { Switch } from '@/components/ui/switch'
import projectApi from '@/service/projectApi'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const EventSettings = () => {
  const { projectId }: any = useParams()

  const [eventSettings, setEventSettings] = useState({
    enableEventTrigger: false,
    enablePublishDataTrigger: false,
    enableEmailTrigger: false,
    enableReportGenerationTrigger: false,
  })

  useEffect(() => {
    const fetchEventSettings = async () => {
      try {
        const settings = await projectApi.getSettings(projectId)
        if (settings) {
          setEventSettings(settings)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchEventSettings()
  }, [projectId])

  const handleToggle = async (attribute: string, value: boolean) => {
    setEventSettings({ ...eventSettings, [attribute]: value })
    try {
      await projectApi.updateSettings(projectId, {
        [attribute]: value,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='flex flex-col gap-6 p-4'>
      <h2 className='text-xl font-semibold text-gray-800'>Event Settings</h2>

      <div className='flex flex-col gap-4 w-full'>
        <div className='flex justify-between gap-2'>
          <span>Enable Event Trigger for annotations</span>
          <Switch
            checked={eventSettings.enableEventTrigger}
            onCheckedChange={(checked) =>
              handleToggle('enableEventTrigger', checked)
            }
          />
        </div>

        {eventSettings.enableEventTrigger && (
          <>
            <div className='flex justify-between gap-2'>
              <span>Enable Publish Data Trigger</span>
              <Switch
                checked={eventSettings.enablePublishDataTrigger}
                onCheckedChange={(checked) =>
                  handleToggle('enablePublishDataTrigger', checked)
                }
              />
            </div>

            <div className='flex justify-between gap-2'>
              <span>Enable Email Trigger</span>
              <Switch
                checked={eventSettings.enableEmailTrigger}
                onCheckedChange={(checked) =>
                  handleToggle('enableEmailTrigger', checked)
                }
              />
            </div>

            <div className='flex justify-between gap-2'>
              <span>Enable Report Generation Trigger</span>
              <Switch
                checked={eventSettings.enableReportGenerationTrigger}
                onCheckedChange={(checked) =>
                  handleToggle('enableReportGenerationTrigger', checked)
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EventSettings
