import { AppDispatch, RootState } from '@/store'
import {
  setCollapsedBasedOnWidth,
  setIsCollapsed as setReduxIsCollapsed,
} from '@/store/slices/sidebarSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function useIsCollapsed() {
  const dispatch = useDispatch<AppDispatch>()
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed
  )

  useEffect(() => {
    const handleResize = () => {
      dispatch(setCollapsedBasedOnWidth())
    }

    // Add event listener for window resize
    window.addEventListener('resize', handleResize)

    // Initial check on component mount
    handleResize()

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dispatch])

  const setIsCollapsed = (collapsed: boolean) => {
    dispatch(setReduxIsCollapsed(collapsed))
  }

  return [isCollapsed, setIsCollapsed] as const
}
