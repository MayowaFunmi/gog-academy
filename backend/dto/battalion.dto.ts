import { z } from "zod";

export const createBattalionSChema = z.object({
  cohortId: z.string({ required_error: "cohort id cannot be null" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const addBattalionMembersSchema = z.object({
  battalionId: z.string({ required_error: "Battalion id cannot be null" }),
  userId: z.string({ required_error: "User id cannot be null" }),
  isLeader: z.boolean().default(false),
});

export const createPresentationSchema = z.object({
  cohortId: z.string({ required_error: "Cohort id cannot be null" }),
  // battalionId: z.string({ required_error: "Battalion id cannot be null" }),
  taskTypeId: z.string({ required_error: "BattaliTask type id cannot be null" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  presentationDate: z.string().datetime({ message: "Invalid presentation date." }),
  submissionDeadline: z.string().datetime({ message: "Invalid submission deadline." }),
});

export const presentationSubmissionSchema = z.object({
  presentationId: z.string({ required_error: "Presentation id cannot be null" }),
  battalionId: z.string({ required_error: "Battalion id cannot be null" }),
})

export type CreateBattalionDto = z.infer<typeof createBattalionSChema>;
export type AddBattalionMembersDto = z.infer<typeof addBattalionMembersSchema>;
export type CreatePresentationDto = z.infer<typeof createPresentationSchema>;
export type AddPresentationSubmissionDto = z.infer<typeof presentationSubmissionSchema>;