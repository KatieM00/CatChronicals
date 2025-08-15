import React from 'react'
import styles from './HotspotsOverlay.module.css'

interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  onClick: () => void
}

interface HotspotsOverlayProps {
  hotspots: Hotspot[]
}

const HotspotsOverlay: React.FC<HotspotsOverlayProps> = ({ hotspots }) => {
  return (
    <div className={styles.hotspotsOverlay}>
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          className={styles.hotspot}
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`
          }}
          onClick={hotspot.onClick}
          aria-label={hotspot.label}
          title={hotspot.label}
        />
      ))}
    </div>
  )
}

export default HotspotsOverlay