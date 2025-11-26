import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Stairs = ({ children }) => {
  const currentPath = useLocation().pathname

  const stairParentRef = useRef(null)
  const pageRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    // show the stairs container and enable pointer events to block interactions during transition
    tl.set(stairParentRef.current, { display: 'block', pointerEvents: 'auto' })

    // animate stairs opening up sequence
    tl.from(
      '.stair',
      {
        height: 0,
        transformOrigin: 'bottom',
        stagger: {
          amount: -0.2,
        },
        ease: 'power2.out',
      },
      0
    )

    // slide them down to reveal the page
    tl.to(
      '.stair',
      {
        y: '100%',
        stagger: {
          amount: -0.25,
        },
        ease: 'power3.inOut',
      },
      '>-0.05'
    )

    // hide the stairs container and disable pointer events
    tl.set(stairParentRef.current, { display: 'none', pointerEvents: 'none' })

    // reset stairs to original position for next transition
    tl.set('.stair', { y: '0%' })

    // animate page content in
    gsap.from(pageRef.current, {
      opacity: 0,
      delay: 1.2,
      scale: 1.2,
      duration: 0.8,
      ease: 'power2.out',
    })
  }, [currentPath])

  return (
    <div>
      <div
        ref={stairParentRef}
        className="stairs-overlay"
        aria-hidden="true"
        style={{ display: 'none' }}
      >
        <div className="stairs-inner">
          <div className="stair h-full w-1/5 bg-white" />
          <div className="stair h-full w-1/5 bg-white" />
          <div className="stair h-full w-1/5 bg-white" />
          <div className="stair h-full w-1/5 bg-white" />
          <div className="stair h-full w-1/5 bg-white" />
        </div>
      </div>

      <div ref={pageRef} className="page-with-transition">
        {children}
      </div>
    </div>
  )
}

export default Stairs


