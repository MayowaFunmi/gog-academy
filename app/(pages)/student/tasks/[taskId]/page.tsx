'use client'

import TaskDetail from '@/app/components/tasks/TaskDetail'
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

const DailyTaskDetail = () => {
  const params = useParams()
  const searchParams = useSearchParams();
  const weekId = searchParams.get('wkId') || '';
  const taskId = params.taskId as string;

  return (
    <TaskDetail taskId={taskId} weekId={weekId} />
  );
}

export default DailyTaskDetail