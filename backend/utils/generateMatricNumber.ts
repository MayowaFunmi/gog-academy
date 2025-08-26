import { prisma } from "@/lib/prisma";
import moment from "moment";

export const generateMatricNumber = async () => {
  const yearCode = moment().format("YY");

  const [cohort, lastUser] = await prisma.$transaction(async (tx) => {
    const activeCohort = await tx.academyCohort.findFirst({
      where: { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
      select: { cohort: true },
    });
    const user = await tx.user.findFirst({
      where: { matricNumber: { contains: `/${yearCode}` } },
      orderBy: { createdAt: "desc" },
      select: { matricNumber: true },
    });
    return [activeCohort, user]
  });

  if (!cohort) {
    throw new Error("Cohort not found");
  }

  const words = cohort.cohort.trim().split(" ");
  const initials =
    words.length >= 2 ? words[0][0] + words[1][0] : words[0].slice(0, 2);
  const initialsUpper = initials.toUpperCase();

  let serial = 1;
  if (lastUser?.matricNumber) {
    const parts = lastUser.matricNumber.split("/");
    const lastSerial = parts[3].slice(2); // take "002" part
    serial = parseInt(lastSerial, 10) + 1;
  }

  const serialPadded = serial.toString().padStart(3, "0");

  // Construct matric number
  return `GOG/ACD/${initialsUpper}/${yearCode}${serialPadded}`;
};
