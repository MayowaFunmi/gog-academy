'use client'

import React, { useEffect, useMemo, useState } from "react"
import clsx from 'clsx'
import { PaginationMeta } from "@/backend/types/apiResponse";
import { DailyTask, ScreenshotsData, TaskAttendance, TaskSubmission } from "@/app/types/task";
import moment from "moment";
import Modal from "../ui/Modal";
import TaskScreenshots from "./TaskScreenshots";
import TaskSubmissionPage from "./TaskSubmissionPage";
import { useApproveSubmission } from "@/app/hooks/tasks";
import { fail_notify, success_notify } from "@/app/utils/constants";
import { AxiosError } from "axios";
import PageLoader from "../loader/pageLoader";

const Badge: React.FC<{ variant?: "green" | "blue" | "gray" | "red"; className?: string; children: React.ReactNode }>
  = ({ variant = "gray", className, children }) => (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "green" && "bg-green-100 text-green-700",
        variant === "blue" && "bg-blue-100 text-blue-700",
        variant === "gray" && "bg-gray-100 text-gray-700",
        variant === "red" && "bg-red-100 text-red-700",
        className
      )}
    >
      {children}
    </span>
  );

const Card: React.FC<{ title: string; right?: React.ReactNode; className?: string; children: React.ReactNode }>
  = ({ title, right, className, children }) => (
    <section className={clsx("w-full bg-white rounded-2xl shadow-sm border border-gray-100", className)}>
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b">
        <h3 className="text-base md:text-lg font-semibold text-gray-800">{title}</h3>
        {right}
      </header>
      <div className="px-3 md:px-6 py-4">{children}</div>
    </section>
  );

const TableShell: React.FC<{ headers: string[]; children: React.ReactNode }>
  = ({ headers, children }) => (
    <div className="overflow-x-auto -mx-3 md:mx-0">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-3 md:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>
      </table>
    </div>
  );

const PaginationControls: React.FC<{
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}>
  = ({ meta, onPageChange, onPageSizeChange }) => {
    if (!meta) return null;
    const { currentPage, totalPages, pageSize, totalItems, hasNextPage, hasPreviousPage } = meta;
    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
        <div className="text-sm text-gray-600">
          Page <span className="font-medium">{currentPage}</span> of {totalPages} · {totalItems} total
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
          >
            Previous
          </button>
          <button
            className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            Next
          </button>
          <select
            className="ml-2 px-2 py-1.5 rounded-lg border text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
            aria-label="Select page size"
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

interface AdminTaskTablesProps {
  task: DailyTask;
  role?: string;
  attendanceMeta?: PaginationMeta; // pass-through if differs from task.attendanceMeta
  submissionsMeta?: PaginationMeta; // pass-through if differs from task.submissionsMeta
  onAttendancePageChange?: (p: number) => void;
  onAttendancePageSizeChange?: (s: number) => void;
  onSubmissionsPageChange?: (p: number) => void;
  onSubmissionsPageSizeChange?: (s: number) => void;
}


const AdminTaskTables = ({
  task,
  role,
  attendanceMeta,
  submissionsMeta,
  onAttendancePageChange,
  onAttendancePageSizeChange,
  onSubmissionsPageChange,
  onSubmissionsPageSizeChange,
}: AdminTaskTablesProps) => {
  const requiresAttendance = !!task.taskType?.requiresAttendance;
  const requiresSubmissions = !!task.taskType?.requiresSubmissions;

  const [activeTab, setActiveTab] = useState<"submissions" | "attendance">(
    requiresSubmissions ? "submissions" : "attendance"
  );
  const [query, setQuery] = useState("");
  const [openScreenshots, setOpenScreenshots] = useState<null | { id: string; screenshots: ScreenshotsData[] }>(null);
  const [openSubmission, setOpenSubmission] = useState<string | null>(null);

  const filteredSubmissions = useMemo(() => {
    if (!task.taskSubmissions) return [] as TaskSubmission[];
    return task.taskSubmissions.filter((s) => {
      const name = `${s.user?.firstName ?? ""} ${s.user?.lastName ?? ""}`.toLowerCase();
      return name.includes(query.toLowerCase()) || (s.user?.email ?? "").toLowerCase().includes(query.toLowerCase());
    });
  }, [task.taskSubmissions, query]);

  const filteredAttendance = useMemo(() => {
    if (!task.attendance) return [] as TaskAttendance[];
    return task.attendance.filter((a) => {
      const name = `${a.user?.firstName ?? ""} ${a.user?.lastName ?? ""}`.toLowerCase();
      return name.includes(query.toLowerCase()) || (a.user?.email ?? "").toLowerCase().includes(query.toLowerCase());
    });
  }, [task.attendance, query]);

  const handleScreenshotCloseModal = () => {
    setOpenScreenshots(null);
  }

  const handleSubmissionCloseModal = () => {
    setOpenSubmission(null);
  }

  const {
    mutate: approveSubmission,
    data: approveData,
    isPending: isApproving,
    isSuccess: isApprovedSuccess,
    isError: isApproveError,
    error: approveError
  } = useApproveSubmission(task.id)

  const handleApproveSubmission = (submissionId: string) => {
    if (!submissionId) return;
    approveSubmission(submissionId);
  }

  useEffect(() => {
    if (isApprovedSuccess && approveData && approveData.status === "success") {
      success_notify(approveData.message);
    }
  }, [approveData, isApprovedSuccess]);

  useEffect(() => {
    if (isApproveError) {
      console.error("Error fetching task categories:", approveError);
      const errMsg =
        (approveError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [approveError, isApproveError]);

  if (!role) return null;

  return (
    <div className="space-y-6">
      {/* Header / tabs */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 bg-white p-3 rounded-lg shadow">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Task Insights</h2>
          <p className="text-sm text-gray-500">Opened {moment(task.startTime).format("LLL")} · Closes {moment(task.endTime).format("LLL")}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={requiresSubmissions ? "blue" : "gray"}>{requiresSubmissions ? "Submissions required" : "Submissions not required"}</Badge>
            <Badge variant={requiresAttendance ? "green" : "gray"}>{requiresAttendance ? "Attendance required" : "Attendance not required"}</Badge>
          </div>
        </div>

        <div className="inline-flex items-center rounded-xl bg-gray-100 p-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("submissions")}
            className={clsx(
              "px-4 py-2 text-sm rounded-lg transition",
              activeTab === "submissions" ? "bg-white shadow-sm" : "text-gray-600"
            )}
            disabled={!requiresSubmissions}
            title={!requiresSubmissions ? "This task does not require submissions" : undefined}
          >
            Submissions
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={clsx(
              "px-4 py-2 text-sm rounded-lg transition",
              activeTab === "attendance" ? "bg-white shadow-sm" : "text-gray-600"
            )}
            disabled={!requiresAttendance}
            title={!requiresAttendance ? "This task does not require attendance" : undefined}
          >
            Attendance
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white rounded-lg p-3 shadow gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full md:w-72 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      {/* Submissions Table */}
      {requiresSubmissions && activeTab === "submissions" && (
        <Card
          title={`Submissions (${task.submissionsMeta?.totalItems ?? filteredSubmissions.length})`}
        >
          {isApproving ? (
            <PageLoader />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <TableShell headers={["User", "Submitted At", "Status", "Score", "Screenshots", "Submission", "Remark"]}>
                  {filteredSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">No submissions yet.</td>
                    </tr>
                  )}
                  {filteredSubmissions.map((s) => {
                    const screenshotsCount = Array.isArray(s.screenshots) ? s.screenshots.length : 0;
                    return (
                      <tr key={s.id} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                              {(s.user?.firstName?.[0] ?? "?").toUpperCase()}
                              {(s.user?.lastName?.[0] ?? "").toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{s.user?.firstName} {s.user?.lastName}</div>
                              <div className="text-xs text-gray-500">{s.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{moment(s.submittedAt).format("LLL")}</td>
                        <td className="px-4 py-3">
                          {s.isSubmitted ? (
                            <Badge variant={s.isLate ? "red" : "green"}>{s.isLate ? "Late" : "On time"}</Badge>
                          ) : (
                            <Badge>Not submitted</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">{s.score ?? 0}</td>
                        <td className="px-4 py-3 text-sm">
                          {screenshotsCount > 0 ? (
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() =>
                                setOpenScreenshots({
                                  id: s.id,
                                  screenshots: Array.isArray(s.screenshots) ? s.screenshots : [],
                                })
                              }
                            >
                              {screenshotsCount} file{screenshotsCount > 1 ? "s" : ""}
                            </button>
                          ) : (
                            "—"
                          )}
                        </td>
                        {/* <td className="px-4 py-3 text-sm">{screenshotsCount > 0 ? `${screenshotsCount} file${screenshotsCount > 1 ? "s" : ""}` : "—"}</td> */}
                        <td className="px-4 py-3 text-sm">
                          {s.submission && s.submission !== "<p><br></p>" ? (
                            <div
                              className="mt-2 text-blue-600 hover:underline cursor-pointer"
                              onClick={() => setOpenSubmission(s.submission ?? "")}
                            >
                              Open Submission
                            </div>
                          ) : "-"}
                        </td>

                        {/* approve or reject submission here */}
                        <td className="px-4 py-3 text-sm">
                          <div
                            onClick={() => handleApproveSubmission(s.id)}
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 
                              ${s.isApproved ? "bg-green-500" : "bg-gray-300"
                              }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 
                                ${s.isApproved ? "translate-x-6" : "translate-x-0"
                                }`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </TableShell>
              </div>

              {/* Mobile cards */}
              <div className="grid md:hidden gap-3">
                {filteredSubmissions.length === 0 && (
                  <div className="text-center text-sm text-gray-500 py-4">No submissions yet.</div>
                )}
                {filteredSubmissions.map((s) => (
                  <div key={s.id} className="rounded-xl border p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                        {(s.user?.firstName?.[0] ?? "?").toUpperCase()}
                        {(s.user?.lastName?.[0] ?? "").toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{s.user?.firstName} {s.user?.lastName}</div>
                        <div className="text-xs text-gray-500">{s.user?.email}</div>
                      </div>
                      <Badge variant={s.isLate ? "red" : "green"}>{s.isLate ? "Late" : "On time"}</Badge>
                    </div>
                    <div className="mt-3 text-sm text-gray-700">{moment(s.submittedAt).format("LLL")}</div>
                    <div className="mt-2 text-sm">Score: {s.score ?? 0}</div>
                    <div
                      className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
                      onClick={() =>
                        setOpenScreenshots({
                          id: s.id,
                          screenshots: Array.isArray(s.screenshots) ? s.screenshots : [],
                        })
                      }
                    >
                      {Array.isArray(s.screenshots) && s.screenshots.length > 0 ? `${s.screenshots.length} screenshot(s)` : "No screenshots"}
                    </div>
                    {s.submission && s.submission !== "<p><br></p>" ? (
                      <div
                        className="mt-2 text-blue-600 hover:underline cursor-pointer"
                        onClick={() => setOpenSubmission(s.submission ?? "")}
                      >
                        Open Submission
                      </div>
                    ) : "-"}

                    <div className="mt-2">
                      <div
                        onClick={() => handleApproveSubmission(s.id)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 
                              ${s.isApproved ? "bg-green-500" : "bg-gray-300"
                          }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 
                                ${s.isApproved ? "translate-x-6" : "translate-x-0"
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <PaginationControls
                meta={submissionsMeta ?? task.submissionsMeta}
                onPageChange={onSubmissionsPageChange}
                onPageSizeChange={onSubmissionsPageSizeChange}
              />
            </>
          )}
        </Card>
      )}

      {/* Attendance Table */}
      {requiresAttendance && activeTab === "attendance" && (
        <Card
          title={`Attendance (${task.attendanceMeta?.totalItems ?? filteredAttendance.length})`}
        >
          {/* Desktop Table */}
          <div className="hidden md:block">
            <TableShell headers={["User", "Marked At", "Status", "Late"]}>
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">No attendance records yet.</td>
                </tr>
              )}
              {filteredAttendance.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                        {(a.user?.firstName?.[0] ?? "?").toUpperCase()}
                        {(a.user?.lastName?.[0] ?? "").toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{a.user?.firstName} {a.user?.lastName}</div>
                        <div className="text-xs text-gray-500">{a.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{moment(a.attendanceAt ?? a.attendanceAt).format("LLL")}</td>
                  <td className="px-4 py-3"><Badge variant={a.marked ? "green" : "gray"}>{a.marked ? "Marked" : "Not marked"}</Badge></td>
                  <td className="px-4 py-3">{a.isLate ? <Badge variant="red">Late</Badge> : "—"}</td>
                </tr>
              ))}
            </TableShell>
          </div>

          {/* Mobile cards */}
          <div className="grid md:hidden gap-3">
            {filteredAttendance.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">No attendance records yet.</div>
            )}
            {filteredAttendance.map((a) => (
              <div key={a.id} className="rounded-xl border p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                    {(a.user?.firstName?.[0] ?? "?").toUpperCase()}
                    {(a.user?.lastName?.[0] ?? "").toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{a.user?.firstName} {a.user?.lastName}</div>
                    <div className="text-xs text-gray-500">{a.user?.email}</div>
                  </div>
                  <Badge variant={a.isLate ? "red" : "green"}>{a.isLate ? "Late" : "On time"}</Badge>
                </div>
                <div className="mt-3 text-sm text-gray-700">{moment(a.attendanceAt ?? a.attendanceAt).format("LLL")}</div>
                <div className="mt-2 text-sm">{a.marked ? "Marked" : "Not marked"}</div>
              </div>
            ))}
          </div>

          <PaginationControls
            meta={attendanceMeta ?? task.attendanceMeta}
            onPageChange={onAttendancePageChange}
            onPageSizeChange={onAttendancePageSizeChange}
          />
        </Card>
      )}

      <Modal
        isOpen={!!openScreenshots}
        closeModal={handleScreenshotCloseModal}
        title="Submission Screenshots"
        widthClass="max-w-3xl"
      >
        <TaskScreenshots openScreenshots={openScreenshots} />
      </Modal>

      <Modal
        isOpen={!!openSubmission}
        closeModal={handleSubmissionCloseModal}
        title="Submission Details"
        widthClass="max-w-3xl"
      >
        <TaskSubmissionPage openSubmission={openSubmission} />
      </Modal>

    </div>
  )
}

export default AdminTaskTables