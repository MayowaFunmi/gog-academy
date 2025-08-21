'use client'

import { LOCAL_STORAGE_KEYS, ProfileForm, STEP_FIELDS } from "@/app/types/user";
import React, { useEffect, useState } from "react";

const SECTION_TITLES: Record<number, string> = {
  0: "Bio Data",
  1: "Salvation",
  2: "Membership",
  3: "References",
  4: "Consent",
};

interface PreviewProps {
  onEdit: (step: number) => void;
}

const formatValue = (val: unknown) => {
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (val === null || val === undefined) return "-";
  return String(val);
};

const Section = ({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
}) => (
  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-medium">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        className="text-sm text-indigo-600 hover:underline"
      >
        Edit
      </button>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="font-medium capitalize">
      {label.replace(/([A-Z])/g, " $1")}
    </span>
    <span>{value}</span>
  </div>
);


const ProfilePreview = ({ onEdit }: PreviewProps) => {
  const [profileData, setProfileData] = useState<Partial<ProfileForm>>({});

  useEffect(() => {
    const combined: Partial<ProfileForm> = {};
    Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          Object.assign(combined, JSON.parse(raw));
        } catch {
          console.warn(`Invalid JSON in localStorage for ${key}`);
        }
      }
    });
    setProfileData(combined);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Preview Your Profile</h2>

      {Object.entries(STEP_FIELDS).map(([stepStr, fields]) => {
        const step = Number(stepStr);
        const sectionTitle = SECTION_TITLES[step];

        return (
          <Section
            key={step}
            title={sectionTitle}
            onEdit={() => onEdit(step)} // 🔹 allow editing
          >
            {fields.map((field) => (
              <Field
                key={field}
                label={field}
                value={formatValue(profileData[field])}
              />
            ))}
          </Section>
        );
      })}
    </div>
  );
};

export default ProfilePreview;
