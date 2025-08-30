import { ScreenshotsData } from '@/app/types/task';
import { getFrontendUrl } from '@/app/utils/apiCalls/Environment.helpers';
import React from 'react'

interface Props {
  openScreenshots: {
    id: string;
    screenshots: ScreenshotsData[];
  } | null;
}

const TaskScreenshots = ({ openScreenshots }: Props) => {
  return (
    <div>
      {openScreenshots?.screenshots?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {openScreenshots.screenshots.map((src, idx) => (
            <div key={idx} className="border rounded-md overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${getFrontendUrl()}/${src.filePath.replace(/^public\//, "")}`}
                alt={`Screenshot ${idx + 1}`}
                className="w-full object-contain"
                width={600}
                height={600}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No screenshots available.</p>
      )}
    </div>
  )
}

export default TaskScreenshots