import React from 'react'
import styles from '../styles/DialogueBox.module.css'

interface DialogueBoxProps {
  children: React.ReactNode
  mode?: 'narrow' | 'wide'
  className?: string
  onClick?: () => void
}

export default function DialogueBox({ 
  children, 
  mode = 'narrow',
  className = '',
  onClick
}: DialogueBoxProps) {
  const dialogueClasses = [
    styles.dialogueBox,
    styles[mode],
    className
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={dialogueClasses}
      onClick={onClick}
      role={onClick ? 'button' : 'dialog'}
      tabIndex={onClick ? 0 : -1}
    >
      {children}
    </div>
  )
}