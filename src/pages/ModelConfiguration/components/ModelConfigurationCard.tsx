// @ts-nocheck
import { Card } from '@/components/ui/card'
import { Package, Pencil, Trash2 } from 'lucide-react'

const TemplateCard = ({ configuration, onEdit, onConfirm }: any) => {
  const { modelName } = configuration

  return (
    <Card className='m-2 w-52 capitalize'>
      <div className='flex cursor-pointer flex-col rounded-lg bg-white p-4'>
        <div className='flex h-36 items-center justify-center overflow-hidden rounded-md bg-[#8892b3]'>
          <Package className='text-9xl text-white' size={50} />
        </div>
        <div className='flex justify-between pt-2'>
          <div className='flex-grow text-left font-light'>{modelName}</div>
          <div className='flex justify-between gap-1'>
            <button onClick={onEdit} className='h-6 rounded p-1'>
              <Pencil size={15} />
            </button>
            <button
              onClick={onConfirm}
              className='h-6 rounded bg-red-400 p-1 text-white'
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TemplateCard
