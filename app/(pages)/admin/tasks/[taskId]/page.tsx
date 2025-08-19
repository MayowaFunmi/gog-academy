'use client'

import TaskDetail from '@/app/components/tasks/TaskDetail'
import { useParams } from 'next/navigation'
import React from 'react'

const DailyTaskDetail = () => {
  const params = useParams()
  const taskId = params.taskId as string;

  return (
    <TaskDetail taskId={taskId} />
  );
}

export default DailyTaskDetail