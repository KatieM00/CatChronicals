import React from 'react'
import styles from './LessonButton.module.css'

interface LessonButtonProps {
  id: string
  x: number // Percentage position
  y: number // Percentage position
  label: string
  onClick: () => void
  isAccessible?: boolean
  isCompleted?: boolean
}

const LessonButton: React.FC<LessonButtonProps> = ({
  id,
  x,
  y,
  label,
  onClick,
  isAccessible = true,
  isCompleted = false
}) => {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (isAccessible) {
      onClick()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && isAccessible) {
      event.preventDefault()
      event.stopPropagation()
      onClick()
    }
  }

  return (
    <button
      className={`${styles.lessonButton} ${
        isCompleted ? styles.completed : ''
      } ${!isAccessible ? styles.disabled : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
      disabled={!isAccessible}
      data-lesson-id={id}
    >
      <div className={styles.buttonCore}>
        <div className={styles.buttonRing} />
        {isCompleted && <div className={styles.checkmark}>✓</div>}
      </div>
      <div className={styles.tooltip}>
        <span>{label}</span>
      </div>
    </button>
  )
}

export default LessonButton