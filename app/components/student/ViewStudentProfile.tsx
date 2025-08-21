"use client";

import { User } from "@/app/types/auth";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  User as UserIcon,
  Calendar,
  MapPin,
  Briefcase,
  Edit,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import moment from "moment";
import { useGetCohortById } from "@/app/hooks/cohorts";

const ViewStudentProfile = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // validation
    if (!["image/jpeg", "image/jpg"].includes(selectedFile.type)) {
      setError("Only JPG/JPEG files are allowed");
      return;
    }
    if (selectedFile.size > 300 * 1024) {
      setError("File size must not exceed 300KB");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSave = async () => {
    if (!file) return;
    try {
      setSaving(true);
      //await onSave(file);
    } catch (err) {
      setError("Failed to upload picture. Try again." + err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  const { data: cohortData } = useGetCohortById(
    userData?.userProfile?.cohortId ?? ""
  );

  useEffect(() => {
    if (session?.user) {
      setUserData(session.user);
    }
  }, [session]);

  return (
    <div className="w-full bg-white shadow-md rounded-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Profile picture */}
        <div className="relative w-full md:w-1/3 bg-gray-50 flex items-center justify-center p-6">
          {userData?.userProfile?.profilePicture ? (
            <Image
              src={userData?.userProfile?.profilePicture}
              alt={`${userData?.firstName} ${userData?.lastName}`}
              width={250}
              height={250}
              className="rounded-full object-cover w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 shadow"
            />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {loading ? (
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-500" />
                ) : preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" />
                )}

                {/* upload trigger */}
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-gray-100"
                >
                  <UserIcon className="w-5 h-5 text-gray-700" />
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/jpeg,image/jpg"
                  className="hidden"
                  onChange={handleFileChange}
                  aria-label="profile upload"
                />
              </div>

              {/* error message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* actions */}
              <div className="flex gap-3">
                {file && (
                  <>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                      disabled={saving}
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Picture"}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div className="flex-1 p-6 space-y-6">
          {/* Basic Info */}
          {/* Basic Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-3">
            {/* Left section (Name, Title, Roles, Cohort) */}
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {userData?.firstName} {userData?.lastName}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {userData?.userProfile?.title ?? "Member"}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData?.roles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-xs font-medium"
                  >
                    {role}
                  </span>
                ))}

                {cohortData && cohortData.data && (
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-medium">
                    {cohortData.data.cohort} | Batch {cohortData.data.batch} |{" "}
                    {new Date(cohortData.data.startDate).getFullYear()}
                  </span>
                )}
              </div>
            </div>

            {/* Right section (Profile Strength + Edit button) */}
            <div className="flex flex-col items-end gap-2">
              {/* Profile Strength */}
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500">Profile Strength</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${userData?.profileStrength}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-indigo-600 mt-1">
                  {userData?.profileStrength}%
                </span>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => router.push("/profile/edit")}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="break-all">{userData?.email}</span>
            </div>
            {userData?.userProfile?.refereePhoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{userData?.userProfile?.refereePhoneNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {moment(userData?.userProfile?.dateOfBirth).format(
                  "MMMM D, YYYY"
                ) ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="truncate">
                {userData?.userProfile?.address},{" "}
                {userData?.userProfile?.stateOfResidence},{" "}
                {userData?.userProfile?.country}
              </span>
            </div>
            {userData?.userProfile?.occupation && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span>{userData?.userProfile?.occupation}</span>
              </div>
            )}
          </div>

          {/* Spiritual Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Spiritual Journey
            </h3>
            <p className="text-gray-600 text-sm">
              Salvation Status:{" "}
              <strong>{userData?.userProfile?.salvationStatus ?? "N/A"}</strong>
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Salvation Story:{" "}
              <span
                className=""
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    userData?.userProfile?.salvationStory ??
                      "No story provided."
                  ),
                }}
              />
            </p>
          </div>

          {/* Membership & Commitments */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Membership & Commitments
            </h3>
            <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
              <li>
                GOG Membership:{" "}
                {userData?.userProfile?.gogMembershipStatus
                  ? `Yes (since ${userData?.userProfile?.gogMembershipYear})`
                  : "No"}
              </li>
              <li>
                Class Commitment:{" "}
                {userData?.userProfile?.classCommitmentStatus ? "Yes" : "No"}
              </li>
              <li>
                Assignment Commitment:{" "}
                {userData?.userProfile?.assignmentCommitmentStatus
                  ? "Yes"
                  : "No"}
              </li>
              <li>
                Reason for Joining:{" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      userData?.userProfile?.reasonForJoining ?? "N/A"
                    ),
                  }}
                />
              </li>
              <li>Church: {userData?.userProfile?.churchName ?? "N/A"}</li>
            </ul>
          </div>

          {/* Referee Info */}
          {userData?.userProfile && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Referee Information
              </h3>
              <p className="text-sm text-gray-600">
                <strong>{userData?.userProfile?.refereeName}</strong> (
                {userData?.userProfile?.refereeRelationship}) <br />
                {userData?.userProfile?.refereeEmail} |{" "}
                {userData?.userProfile?.refereePhoneNumber}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center">
        Joined on {new Date(userData?.createdAt ?? "").toLocaleDateString()} |
        Last Login:{" "}
        {userData?.lastLogin
          ? new Date(userData?.lastLogin).toLocaleDateString()
          : "N/A"}
      </div>
    </div>
  );
};

export default ViewStudentProfile;
