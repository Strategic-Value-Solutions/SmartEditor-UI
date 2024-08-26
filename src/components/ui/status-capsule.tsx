import { formatText, getStatusDotColor, getStatusStyles } from '@/utils'

function StatusCapsule({ status, redirectTo = () => {} }: any) {
  return (
    <span
      className={`text-sm flex items-center justify-center p-1 rounded-full ${getStatusStyles(status)} ${redirectTo ? ' cursor-pointer' : ''}`}
      style={{
        height: '24px',
        padding: '0 8px',
      }}
      onClick={redirectTo}
    >
      {formatText(status)}
      <span
        className={`ml-2 w-2 h-2 rounded-full ${getStatusDotColor(status)}`}
      ></span>
    </span>
  )
}

export default StatusCapsule
