// @ts-nocheck
import imageConstants from '@/constants/imageConstants'

const getCursor = ({ type }): any => {
  switch (type) {
    case 'eraser': {
      return imageConstants.removeCursor
    }

    default: {
      return ''
    }
  }
}

export default getCursor
