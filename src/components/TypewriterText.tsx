import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  isVisible: boolean
}

export default function TypewriterText({ 
  text, 
  speed = 50, 
  isVisible 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('')
      setCurrentIndex(0)
      return
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, speed, isVisible])

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
  }, [text])

  return <span>{displayedText}</span>
}