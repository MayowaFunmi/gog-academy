"use client";

import {
  bioDataSchema,
  membershipSchema,
  referenceSchema,
  salvationSchema,
} from "@/app/schemas/user/userProfileSchema";
import {
  BioData,
  MembershipData,
  ReferenceData,
  SalvationData,
  SelectInputOption,
} from "@/app/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AnyObjectSchema } from "yup";
import Input from "../ui/input";
import { countries } from "countries-list";
import SearchSelect from "../ui/SearchSelect";
import { statesData } from "@/app/utils/statesData";
import SelectForm from "../forms/SelectForm";
import RichText from "../ui/RichText";

export const LOCAL_STORAGE_KEYS = {
  bioData: "profile_bioData",
  salvationData: "profile_salvationData",
  membershipData: "profile_membershipData",
  referenceData: "profile_referenceData",
};

interface ProfileForm
  extends BioData,
    SalvationData,
    MembershipData,
    ReferenceData {}

const CreateStudentProfile = () => {
  // console.log(`countries = ${JSON.stringify(countries, null, 2)}`)
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [salvationStatus, setSalvationStatus] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const allCountries: SelectInputOption[] = Object.entries(countries).map(
    ([code, details]) => ({
      label: `${details.name} - ${code}`,
      value: `${details.name} - ${code}`,
    })
  );

  const nigerianStates: SelectInputOption[] = statesData.map((st) => ({
    label: st.state,
    value: st.state,
  }));

  const [step, setStep] = useState(0);
  const steps = [
    "Bio Data",
    "Salvation",
    "Membership",
    "References",
    "Preview",
  ];
  const userTitles = [
    "Mr",
    "Mrs",
    "Miss",
    "Brother",
    "Sister",
    "Dr.",
    "Prof",
    "Revd",
    "Pastor",
    "Evangelist",
    "Apostle",
    "Bishop",
    "Elder",
    "Deacon",
    "Deaconess",
    "Prophet",
    "Prophetess",
    "Chief",
    "Honourable",
  ];

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const handleReasonChange = useCallback((value: string) => {
    setReason(value);
  }, []);

  const userProfileSchemas: AnyObjectSchema[] = [
    bioDataSchema,
    salvationSchema,
    membershipSchema,
    referenceSchema,
  ] as const;

  type profileSchema = (typeof userProfileSchemas)[number];

  const methods = useForm<ProfileForm>({
    resolver: yupResolver(userProfileSchemas[step] as profileSchema),
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    getValues,
    formState: { errors },
  } = methods;

  const STEP_KEYS: Record<number, keyof typeof LOCAL_STORAGE_KEYS> = {
    0: "bioData",
    1: "salvationData",
    2: "membershipData",
    3: "referenceData",
  };

  const STEP_FIELDS: Record<number, (keyof ProfileForm)[]> = {
    0: ["title", "dateOfBirth", "address", "stateOfResidence", "country", "maritalStatus", "occupation"],
    1: ["salvationStatus", "salvationStory"],
    2: ["gogMembershipStatus", "gogMembershipDate", "previouslyApplied", "classCommitmentStatus", "assignmentCommitmentStatus", "reasonForJoining", "churchName"],
    3: ["refereeName", "refereePhoneNumber", "refereeEmail", "refereeRelationship", "consentCheck"]
  }

  const saveToStorage = (data: Partial<ProfileForm>) => {
    const key = STEP_KEYS[step]
    if (!key) return
    const stepFields = STEP_FIELDS[step]
    const stepData = stepFields.reduce((acc, field) => {
      if (field in data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc as any)[field] = data[field]
      }
      return acc
    }, {} as Partial<ProfileForm>)

    localStorage.setItem(LOCAL_STORAGE_KEYS[key], JSON.stringify(stepData))
  };

  const loadProfileData = () => {
    const bioData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.bioData) || "{}"
    );
    const salvationData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.salvationData) || "{}"
    );
    const membershipData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.membershipData) || "{}"
    );
    const referenceData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.referenceData) || "{}"
    );

    return {
      ...bioData,
      ...salvationData,
      ...membershipData,
      ...referenceData,
    };
  };

  const loadFromStorage = (): Partial<ProfileForm> => {
    const key = STEP_KEYS[step];
    if (!key) return {}

    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS[key])
    if (!raw) return {}

    try {
      const parsed = JSON.parse(raw)
      const stepFields = STEP_FIELDS[step]
      return stepFields.reduce((acc, field) => {
      if (field in parsed) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc as any)[field] = parsed[field];
      }
      return acc;
    }, {} as Partial<ProfileForm>);
    } catch {
      return {}
    }
  }

  const onSubmit: SubmitHandler<ProfileForm> = async (data) => {
    saveToStorage(data);

    if (step < steps.length - 1) {
      // move to next section
      setStep(step + 1);
    } else {
      const finalData = loadProfileData();
      console.log(`profile = ${JSON.stringify(finalData, null, 2)}`);
    }
  };

  // const stepByStepSubmit = () => {};

  useEffect(() => {
    const savedData = loadFromStorage()
    reset(savedData)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset])

  useEffect(() => {
    if (content) {
      setValue("salvationStory", content);
    }
  }, [content, setValue]);

  useEffect(() => {
    if (reason) {
      setValue("reasonForJoining", reason);
    }
  }, [reason, setValue]);

  return (
    <div className="my-3 px-3 w-full">
      <div className="text-2xl font-semibold text-gray-800">
        Create Profile - Step {step + 1}: {steps[step]}
      </div>

      <div className="flex md:flex-row flex-col items-start justify-between bg-white py-3 px-2 font-medium my-4">
        {steps.map((stp, index) => (
          <div
            key={index}
            className={`${
              step === index ? "text-green-400 font-extrabold text-2xl" : ""
            }`}
          >
            {stp}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 0 && (
            <div className="space-y-5">
              <SelectForm<ProfileForm>
                id="title"
                label="Title"
                options={userTitles}
                register={register}
                error={errors.title}
              />
              {/* <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <select
                  {...register("title")}
                  id="title"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a title</option>
                  {userTitles.map((title, index) => (
                    <option key={index} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div> */}

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Of Birth
                </label>
                <Input
                  {...register("dateOfBirth")}
                  type="date"
                  id="dateOfBirth"
                  autoComplete="dateOfBirth"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Residential Address
                </label>
                <Input
                  {...register("address")}
                  type="text"
                  id="address"
                  autoComplete="address"
                  required
                  placeholder="Enter your residential address"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>

                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <SearchSelect
                      options={allCountries}
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(String(e));
                        field.onChange(e);
                      }}
                      placeHolder="Choose a country"
                    />
                  )}
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {selectedCountry.includes("Nigeria") && (
                <div>
                  <label
                    htmlFor="stateOfResidence"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State Of Residence
                  </label>

                  <Controller
                    name="stateOfResidence"
                    control={control}
                    render={({ field }) => (
                      <SearchSelect
                        options={nigerianStates}
                        value={getValues("stateOfResidence")}
                        onChange={(e) => field.onChange(e)}
                        placeHolder="Choose a state"
                      />
                    )}
                  />
                  {errors.stateOfResidence && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.stateOfResidence.message}
                    </p>
                  )}
                </div>
              )}

              <SelectForm
                id="maritalStatus"
                label="Marital Status"
                options={["Single", "Married", "Divorced", "Widow", "Engaged"]}
                register={register}
                error={errors.maritalStatus}
              />

              <div>
                <label
                  htmlFor="occupation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Occupation
                </label>
                <Input
                  {...register("occupation")}
                  type="text"
                  id="occupation"
                  autoComplete="occupation"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Enter your occupation"
                />
                {errors.occupation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.occupation.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <SelectForm
                id="salvationStatus"
                label="Are you saved?"
                options={["Yes", "No", "Not Sure", "Undecided"]}
                register={register}
                error={errors.salvationStatus}
                value={salvationStatus}
                onChange={(e) => setSalvationStatus(e.target.value)}
              />

              <div>
                <Controller
                  name="salvationStory"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tell us about your choice above
                      </label>
                      <RichText
                        value={content}
                        setValue={handleContentChange}
                        onBlur={field.onBlur}
                      />
                      {errors.salvationStory && (
                        <p className="text-red-500 text-xs">
                          {errors.salvationStory?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="gogMembershipStatus"
                  className="block text-sm font-medium text-gray-700"
                >
                  Are you a member of Gospel of Grace Outreach?
                </label>
                <select
                  {...register("gogMembershipStatus", {
                    setValueAs: (val) => val === "true",
                  })}
                  id="gogMembershipStatus"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select One</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.gogMembershipStatus && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gogMembershipStatus.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gogMembershipDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Which year did you join Gospel of Grace Outreach?
                </label>
                <Input
                  {...register("gogMembershipDate")}
                  type="text"
                  id="gogMembershipDate"
                  autoComplete="gogMembershipDate"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Enter year"
                />
                {errors.gogMembershipDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gogMembershipDate.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="previouslyApplied"
                  className="block text-sm font-medium text-gray-700"
                >
                  Have you previously applied to or attended this academy?
                </label>
                <select
                  {...register("previouslyApplied", {
                    setValueAs: (val) => val === "true",
                  })}
                  id="previouslyApplied"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select One</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.previouslyApplied && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.previouslyApplied.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="classCommitmentStatus"
                  className="block text-sm font-medium text-gray-700"
                >
                  Do you commit to attend all classes (online and physical) at
                  the scheduled time?
                </label>
                <select
                  {...register("classCommitmentStatus", {
                    setValueAs: (val) => val === "true",
                  })}
                  id="classCommitmentStatus"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select One</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.classCommitmentStatus && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.classCommitmentStatus.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="assignmentCommitmentStatus"
                  className="block text-sm font-medium text-gray-700"
                >
                  Do you commit to do all assignments given by the facilitators?
                </label>
                <select
                  {...register("assignmentCommitmentStatus", {
                    setValueAs: (val) => val === "true",
                  })}
                  id="assignmentCommitmentStatus"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select One</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.assignmentCommitmentStatus && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.assignmentCommitmentStatus.message}
                  </p>
                )}
              </div>

              <div>
                <Controller
                  name="reasonForJoining"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label
                        htmlFor="reasonForJoining"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tell us why you are applying into GOG Academy
                      </label>
                      <RichText
                        value={reason}
                        setValue={handleReasonChange}
                        onBlur={field.onBlur}
                      />
                      {errors.reasonForJoining && (
                        <p className="text-red-500 text-xs">
                          {errors.reasonForJoining?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="churchName"
                  className="block text-sm font-medium text-gray-700"
                >
                  What is the name of your church?
                </label>
                <Input
                  {...register("churchName")}
                  type="text"
                  id="churchName"
                  autoComplete="churchName"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Enter the name of your church"
                />
                {errors.churchName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.churchName.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="refereeName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name of Referee
                </label>
                <Input
                  {...register("refereeName")}
                  type="text"
                  id="refereeName"
                  autoComplete="refereeName"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Enter the name of your referee"
                />
                {errors.refereeName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.refereeName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="refereePhoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone number of Referee
                </label>
                <Input
                  {...register("refereePhoneNumber")}
                  type="text"
                  id="refereePhoneNumber"
                  autoComplete="refereePhoneNumber"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Enter the phone number of your referee"
                />
                {errors.refereePhoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.refereePhoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="refereeEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address of Referee
                </label>
                <Input
                  {...register("refereeEmail")}
                  type="email"
                  id="refereeEmail"
                  autoComplete="refereeEmail"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Enter the email address of your referee"
                />
                {errors.refereeEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.refereeEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="refereeRelationship"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your relationship with your referee
                </label>
                <Input
                  {...register("refereeRelationship")}
                  type="email"
                  id="refereeRelationship"
                  autoComplete="refereeRelationship"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Your relationship with your referee"
                />
                {errors.refereeRelationship && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.refereeRelationship.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              Preview here
              <div>
                <label
                  htmlFor="consentCheck"
                  className="block text-sm font-medium text-gray-700"
                >
                  I agree that all information i have provided are true
                </label>
                <Input
                  {...register("consentCheck")}
                  type="checkbox"
                  id="consentCheck"
                  autoComplete="consentCheck"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Enter the name of your church"
                />
                {errors.consentCheck && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.consentCheck.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {step === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudentProfile;
