import { updateUserProfile } from "@/apis/profile";
import { validateEmail, validatePhone } from "@/apis/signUp";
import { EditPersonalInfoFormSchema } from "@/schema";
import { z } from "zod";




export const EditPersonalInfo = async (
  values: z.infer<typeof EditPersonalInfoFormSchema>
) => {
  const validatedFields = EditPersonalInfoFormSchema.safeParse(values);

  console.log("::::::EditPersonalInfo:::!!!!", validatedFields);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, mobile, firstname, lastname, dob ,title,desc,gender,watsapp,instagram,twitter,linkdin} =
    validatedFields.data;

//   const validatedEmail = await validateEmail(email,fingerPrints,latitude,longitude);
//   const validateMobile = await validatePhone("91", mobile,fingerPrints,latitude,longitude);
//   if (!validatedEmail.status) {
//     return { error:validatedEmail.message };
//   }

//   if (!validateMobile.status) {
//     return { error: validateMobile.message };
//   }
//   //check if email is already is in use or not- api
//   if (validatedEmail.status && validateMobile.status) {
//     console.log("done!! email");
//     return { success: "OTP has been sent to your email id and mobile number" };
//   }

const updateProfile = await updateUserProfile({email,mobile,firstname,lastname,dob,title,desc,gender
  ,watsapp,instagram,twitter,linkdin})

if(updateProfile.status){
  return {success:updateProfile.message}
}else{
  return {error:updateProfile.message}

}

};