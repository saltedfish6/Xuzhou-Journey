import { useEffect } from 'react'

function useTitle(title: string): void {
  useEffect(() => {
    document.title = title
  }, [])
}

export default useTitle
