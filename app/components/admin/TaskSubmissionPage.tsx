import React from 'react'
import DOMPurify from "dompurify";

interface Props {
  openSubmission: string | null;
}

const TaskSubmissionPage = ({ openSubmission }: Props) => {
  return (
    <div>
      {openSubmission && (
        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(openSubmission) }} />
      )}
    </div>
  )
}

export default TaskSubmissionPage