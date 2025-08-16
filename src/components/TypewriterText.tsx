import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  isVisible: boolean
  onComplete?: () => void
}

export default function TypewriterText({ 
  text, 
  speed = 50, 
  isVisible,
  onComplete
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState<string[]>([])

  // Split text into chunks that fit in approximately 3 lines (about 120 characters)
  useEffect(() => {
    const words = text.split(' ')
    const chunks: string[] = []
    let currentChunk = ''
    const maxCharsPerPage = 120 // Approximate characters that fit in 3 lines
    
    for (const word of words) {
      const testChunk = currentChunk ? `${currentChunk} ${word}` : word
      
      if (testChunk.length > maxCharsPerPage && currentChunk) {
        chunks.push(currentChunk)
        currentChunk = word
      } else {
        currentChunk = testChunk
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk)
    }
    
    setPages(chunks)
  }, [text])

  useEffect(() => {
    if (!isVisible || pages.length === 0) {
      setDisplayedText('')
      setCurrentIndex(0)
      setCurrentPage(0)
      return
    }

    const currentPageText = pages[currentPage] || ''
    
    if (currentIndex < currentPageText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + currentPageText[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (currentIndex === currentPageText.length) {
      if (currentPage < pages.length - 1) {
        // Move to next page after a pause
        setTimeout(() => {
          setDisplayedText('')
          setCurrentIndex(0)
          setCurrentPage(prev => prev + 1)
        }, 1500)
      } else if (onComplete) {
        onComplete()
      }
    }
  }, [currentIndex, currentPage, pages, speed, isVisible, onComplete])

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
    setCurrentPage(0)
  }, [text])

  return <span>{displayedText}</span>
}