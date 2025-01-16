import { SelectGender } from "@/components/signup/Gender-dropDown";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditPersonalInfoFormSchema, PersonalInfoFormSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProfileDataProps } from "./dataTypes";
import { EditPersonalInfo } from "@/actions/profile";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useRouter } from "next/navigation";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
interface Props {
  data: {
    fname: string;
    lname: string;
    desc: string;
    title: string;
    dob: Date;
    gender: string;
    email: string | undefined;
    phone: string | undefined;
  };
  profileData: ProfileDataProps;
  reload: (
    fname: string,
    lname: string,
    desc: string,
    title: string,
    dob: Date,
    gender: string,
    email: string,
    phone: string,
  ) => void;
}
export default function EditForm({ data, reload, profileData }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const router = useRouter();

  const form = useForm<z.infer<typeof EditPersonalInfoFormSchema>>({
    resolver: zodResolver(EditPersonalInfoFormSchema),
    mode: "onChange",
    defaultValues: {
      email: data.email,
      lastname: data.lname,
      firstname: data.fname,
      mobile: data.phone,
      dob: new Date(data.dob),
      gender: data.gender,
      title: data.title,
      desc: data.desc,
    },
  });

  const onSubmit = (values: z.infer<typeof EditPersonalInfoFormSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      EditPersonalInfo(values)
        .then((res) => {
          if (res?.error) {
            // form.reset();
            setError(res?.error);
          }

          if (res?.success) {
            // form.reset();
            setSuccess(res?.success);
            reload(
              values.firstname,
              values.lastname,
              values.desc || "",
              values.title || "",
              new Date(values.dob),

              values.gender,
              values.email,
              values.mobile,
            );
          }

          //start transition will tell when the validation has ended till then the feilds will be disabled
        })
        .catch((error: any) => setError(error.message));
    });
  };

  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="border border-gray-600 p-4 rounded-lg">
            <div className="mb-6">
              <div className="space-y-2">
                {/* <Label htmlFor="title">Title</Label>
                <Textarea id="title" placeholder="Title..." /> */}

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="title"
                          type="text"
                          maxLength={50}
                          minLength={3}
                          // value={data.title}
                          disabled={pending}
                          onBlur={(e) => {
                            const value = e.target.value;
                            const capitalizedValue =
                              value.charAt(0).toUpperCase() + value.slice(1);
                            field.onChange(capitalizedValue);
                          }}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="space-y-2">
                {/* <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Description..." />
                */}

                <FormField
                  control={form.control}
                  name="desc"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="description..."
                          type="text"
                          // value={data.desc}
                          maxLength={500}
                          minLength={20}
                          disabled={pending}
                          onBlur={(e) => {
                            const value = e.target.value;
                            const capitalizedValue =
                              value.charAt(0).toUpperCase() + value.slice(1);
                            field.onChange(capitalizedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-6 border border-gray-600 p-4
              rounded-lg"
          >
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Jhon"
                        type="text"
                        maxLength={30}
                        minLength={3}
                        disabled={pending}
                        // value={data.indFirstName}
                        onBlur={(e) => {
                          const value = e.target.value;
                          const capitalizedValue =
                            value.charAt(0).toUpperCase() + value.slice(1);
                          field.onChange(capitalizedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              {" "}
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Doe"
                        type="text"
                        maxLength={30}
                        minLength={3}
                        disabled={pending}
                        // value={data.indLastName}
                        onBlur={(e) => {
                          const value = e.target.value;
                          const capitalizedValue =
                            value.charAt(0).toUpperCase() + value.slice(1);
                          field.onChange(capitalizedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="name@domain.com"
                        type="email"
                        // value={data.indEmail}
                        disabled
                        onBlur={(e) => {
                          const value = e.target.value;

                          const lowerCase = value.toLocaleLowerCase();

                          field.onChange(lowerCase);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1234567890"
                        type="text"
                        maxLength={10}
                        // value={data.indMobileNum}
                        disabled
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                          if (value.length <= 10) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>gender</FormLabel>
                    <FormControl>
                      {/* <Input
                          {...field}
                          placeholder="********"
                          type="text"
                          disabled={pending}
                          /> */}
                      <SelectGender
                        {...field}
                        // value={data.indGender}
                        error={form.formState.errors.mobile?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        disabled={pending}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        } // Convert Date to string
                        onChange={(e) => {
                          const dateValue = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          field.onChange(dateValue); // Convert string to Date before passing it to react-hook-form
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        <div className="flex flex-row justify-center gap-12 w-full">
          <DialogFooter  className="w-full">
            <DialogClose />
            <Button className="w-full" type="submit">
              Save
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
}
