import loader from '../../assets/settings.gif'

const Loader = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white  z-50'>
      <img src={loader} alt='loader' />
    </div>
  )
}

export default Loader
