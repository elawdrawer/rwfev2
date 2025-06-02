import { updateUserProfile } from "@/apis/profile";
import { EditPersonalInfoFormSchema } from "@/schema";
import { z } from "zod";

export const EditPersonalInfo = async (
  values: z.infer<typeof EditPersonalInfoFormSchema>,
) => {
  const validatedFields = EditPersonalInfoFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    email,
    mobile,
    firstname,
    lastname,
    dob,
    title,
    desc,
    gender,
    watsapp,
    instagram,
    twitter,
    linkdin,
    userName,
    facebook,
    location,
    interest,
    categoryPref,
  } = validatedFields.data;

  const updateProfile = await updateUserProfile({
    email,
    mobile,
    firstname,
    lastname,
    dob,
    title,
    desc,
    gender,
    watsapp,
    instagram,
    twitter,
    linkdin,
    userName,
    facebook,
    location,
    interest,
    categoryPref,
  });

  if (updateProfile.status) {
    return { success: updateProfile.message };
  } else {
    return { error: updateProfile.message };
  }
};
