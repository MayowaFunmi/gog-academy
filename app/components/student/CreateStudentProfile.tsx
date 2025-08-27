"use client";

import {
  bioDataSchema,
  consentSchema,
  membershipSchema,
  referenceSchema,
  salvationSchema,
} from "@/app/schemas/user/userProfileSchema";
import {
  LOCAL_STORAGE_KEYS,
  ProfileForm,
  SelectInputOption,
  STEP_FIELDS,
  STEP_KEYS,
} from "@/app/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AnyObjectSchema } from "yup";
import Input from "../ui/input";
import { countries } from "countries-list";
import SearchSelect from "../ui/SearchSelect";
import { statesData } from "@/app/utils/statesData";
import SelectForm from "../forms/SelectForm";
import RichText from "../ui/RichText";
import ProfilePreview from "./ProfilePreview";
import { useGetCurrentCohort } from "@/app/hooks/cohorts";
import { useCreateUserProfile } from "@/app/hooks/user";
import { fail_notify, success_notify } from "@/app/utils/constants";
import { AxiosError } from "axios";
import Button from "../ui/button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useSignOutUser } from "@/app/hooks/auth";

const CreateStudentProfile = () => {
  const router = useRouter();
  const { data: currentCohort } = useGetCurrentCohort();
  const { update } = useSession();

  const {
    mutate: createUserProfile,
    isPending: isCreatePending,
    isError: isCreateError,
    error: createError,
    isSuccess: createSuccess,
  } = useCreateUserProfile();

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

  const userProfileSchemas: AnyObjectSchema[] = [
    bioDataSchema,
    salvationSchema,
    membershipSchema,
    referenceSchema,
    consentSchema,
  ] as const;

  type profileSchema = (typeof userProfileSchemas)[number];

  const methods = useForm<ProfileForm>({
    resolver: yupResolver(userProfileSchemas[step] as profileSchema),
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    getValues,
    formState: { errors },
  } = methods;

  const saveToStorage = (data: Partial<ProfileForm>) => {
    const key = STEP_KEYS[step];
    if (!key) return;
    const stepFields = STEP_FIELDS[step];
    const stepData = stepFields.reduce((acc, field) => {
      if (field in data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc as any)[field] = data[field];
      }
      return acc;
    }, {} as Partial<ProfileForm>);

    localStorage.setItem(LOCAL_STORAGE_KEYS[key], JSON.stringify(stepData));
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
    const consentData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.consentData) || "{}"
    );

    return {
      ...bioData,
      ...salvationData,
      ...membershipData,
      ...referenceData,
      ...consentData,
    };
  };

  const loadFromStorage = (): Partial<ProfileForm> => {
    const key = STEP_KEYS[step];
    if (!key) return {};

    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS[key]);
    if (!raw) return {};

    try {
      const parsed = JSON.parse(raw);
      const stepFields = STEP_FIELDS[step];
      return stepFields.reduce((acc, field) => {
        if (field in parsed) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (acc as any)[field] = parsed[field];
        }
        return acc;
      }, {} as Partial<ProfileForm>);
    } catch {
      return {};
    }
  };

  const onSubmit: SubmitHandler<ProfileForm> = async (data) => {
    saveToStorage(data);

    if (step < steps.length - 1) {
      // move to next section
      setStep((prev) => prev + 1);
    } else {
      const finalData = loadProfileData();
      // console.log(`profile = ${JSON.stringify(finalData, null, 2)}`);
      const payload = {
        ...finalData,
        cohortId: currentCohort?.data?.id,
      };
      createUserProfile(payload);
    }
  };

  const country = watch("country");
  const statusOfSalvation = watch("salvationStatus");

  const { data: session } = useSession();

  const { mutate: logOut, isSuccess } = useSignOutUser();
  const handleSignOut = () => {
    logOut();
  };

  useEffect(() => {
    if (isSuccess) {
      success_notify("Please log in again to continue");
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (session?.user?.userProfile) {
      router.push("/student/profile-view");
    }
  }, [router, session?.user?.userProfile]);

  useEffect(() => {
    const savedData = loadFromStorage();
    reset(savedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, step]);

  useEffect(() => {
    if (isCreateError) {
      console.error("Error fetching cohorts:", createError);
      const errMsg =
        (createError as AxiosError).response?.data?.message ||
        "An error occurred while fetching cohorts.";
      fail_notify(errMsg);
    }

    if (currentCohort?.status === "notFound") {
      fail_notify("Current cohort not found");
    }
  }, [currentCohort?.status, createError, isCreateError]);

  useEffect(() => {
    if (createSuccess) {
      success_notify("Profile created successfully!");

      update()
        .then(() => {
          Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
          });
          handleSignOut();
        })
        .catch((err) => {
          console.error("Error updating session:", err);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSuccess]);

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

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl mx-auto">
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
                      value={field.value || ""}
                      onChange={(val) => field.onChange(val)}
                      // value={selectedCountry}
                      // onChange={(e) => {
                      //   setSelectedCountry(String(e));
                      //   field.onChange(e);
                      // }}
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

              {country?.includes("Nigeria") && (
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
                        {...field}
                        options={nigerianStates}
                        value={getValues("stateOfResidence") ?? ""}
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
                        {statusOfSalvation === "Yes"
                          ? "Tell us about your salvation story"
                          : "Tell us about your doubts"}
                      </label>
                      <RichText
                        {...field}
                        value={field.value || ""}
                        setValue={(val) => field.onChange(val)}
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
                <Controller
                  name="gogMembershipStatus"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="gogMembershipStatus"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={
                        field.value === true
                          ? "true"
                          : field.value === false
                          ? "false"
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(e.target.value === "true")
                      }
                    >
                      <option value="">Select One</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  )}
                />

                {errors.assignmentCommitmentStatus && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.assignmentCommitmentStatus.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gogMembershipYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Which year did you join Gospel of Grace Outreach?
                </label>
                <Input
                  {...register("gogMembershipYear")}
                  type="text"
                  id="gogMembershipYear"
                  autoComplete="gogMembershipYear"
                  required={false}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Enter year"
                />
                {/* {errors.gogMembershipYear && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gogMembershipYear.message}
                  </p>
                )} */}
              </div>

              <div>
                <label
                  htmlFor="previouslyApplied"
                  className="block text-sm font-medium text-gray-700"
                >
                  Have you previously applied to or attended this academy?
                </label>
                <Controller
                  name="previouslyApplied"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="previouslyApplied"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={
                        field.value === true
                          ? "true"
                          : field.value === false
                          ? "false"
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(e.target.value === "true")
                      }
                    >
                      <option value="">Select One</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  )}
                />
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

                <Controller
                  name="classCommitmentStatus"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="classCommitmentStatus"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={
                        field.value === true
                          ? "true"
                          : field.value === false
                          ? "false"
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(e.target.value === "true")
                      }
                    >
                      <option value="">Select One</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  )}
                />
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
                <Controller
                  name="assignmentCommitmentStatus"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="assignmentCommitmentStatus"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={
                        field.value === true
                          ? "true"
                          : field.value === false
                          ? "false"
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(e.target.value === "true")
                      }
                    >
                      <option value="">Select One</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  )}
                />
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
                        {...field}
                        value={field.value || ""}
                        setValue={(val) => field.onChange(val)}
                        // value={reason}
                        // setValue={handleReasonChange}
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
                  type="text"
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
              <ProfilePreview onEdit={(s) => setStep(s)} />
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <input
                    {...register("consentCheck")}
                    type="checkbox"
                    id="consentCheck"
                    required
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="consentCheck"
                    className="text-sm font-medium text-gray-700"
                  >
                    I agree that all information I have provided is true
                  </label>
                </div>
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
              <Button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              isLoading={isCreatePending}
              disabled={isCreatePending}
            >
              {step === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudentProfile;
