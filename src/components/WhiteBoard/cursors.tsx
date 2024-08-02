import removeCursor from './images/remove.svg'

const getCursor = ({ type }: any) => {
  switch (type) {
    case 'eraser': {
      return removeCursor
    }

    default: {
      return ''
    }
  }
}

export default getCursor
