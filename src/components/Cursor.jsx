import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dot.current) {
        dot.current.style.left = mouseX + 'px'
        dot.current.style.top = mouseY + 'px'
      }
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ring.current) {
        ring.current.style.left = ringX + 'px'
        ring.current.style.top = ringY + 'px'
      }
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    animate()

    const onEnter = () => {
      if (dot.current) dot.current.style.transform = 'translate(-50%,-50%) scale(2)'
      if (ring.current) ring.current.style.transform = 'translate(-50%,-50%) scale(1.5)'
    }
    const onLeave = () => {
      if (dot.current) dot.current.style.transform = 'translate(-50%,-50%) scale(1)'
      if (ring.current) ring.current.style.transform = 'translate(-50%,-50%) scale(1)'
    }

    document.querySelectorAll('a,button,.btn').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div ref={dot} className="cursor" style={{ transform: 'translate(-50%,-50%)', left: -100, top: -100 }} />
      <div ref={ring} className="cursor-ring" style={{ transform: 'translate(-50%,-50%)', left: -100, top: -100 }} />
    </>
  )
}
