// hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState, useCallback } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
}

/**
 * Intersection Observer Hook
 * @param options 观察器选项
 * @returns [ref, entry, isVisible]
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T>, IntersectionObserverEntry | undefined, boolean] {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false
  } = options

  // ✅ 正确：useRef<T>(null) 返回 RefObject<T>，current 是 T | null
  const elementRef = useRef<T>(null!)

  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const [isVisible, setIsVisible] = useState(false)

  const frozen = freezeOnceVisible && isVisible

  const updateEntry = useCallback(
    ([entry]: IntersectionObserverEntry[]): void => {
      setEntry(entry)
      setIsVisible(entry.isIntersecting)
    },
    []
  )

  useEffect(() => {
    const node = elementRef.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [threshold, root, rootMargin, frozen, updateEntry])

  // ✅ 返回的是 RefObject<T>，完全匹配
  return [elementRef, entry, isVisible]
}

export default useIntersectionObserver
