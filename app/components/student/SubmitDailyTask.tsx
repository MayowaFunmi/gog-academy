import React from 'react'

interface SubmitProps {
  userId: string
  taskId: string
  weekId: string
}

const SubmitDailyTask = ({ userId, taskId, weekId }: SubmitProps) => {
  return (
    <div>SubmitDailyTask</div>
  )
}

export default SubmitDailyTask