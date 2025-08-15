import React, { CSSProperties } from 'react'
import styles from './ParallaxLayer.module.css'

interface ParallaxLayerProps {
  type: 'far' | 'mid' | 'near'
  speed: number
  backgroundImage?: string
  style?: CSSProperties
}

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  type,
  speed,
  backgroundImage,
  style = {},
}) => {
  const layerStyle: CSSProperties = {
    ...style,
    ...(backgroundImage && {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    }),
  }

  return (
    <div
      className={`${styles.parallaxLayer} ${styles[type]}`}
      data-speed={speed}
      style={layerStyle}
    />
  )
}

export default ParallaxLayer
