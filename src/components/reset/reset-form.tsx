"use client";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";

export default function ResetForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      reset(values).then((res) => {
        setError(res?.error);
        setSuccess(res?.success);
        //start transition will tell when the validation has ended till then the feilds will be disabled
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-1">
      <div className="relative hidden w-0 xl:block xl:flex-1 hue-rotate-30">
        <img
          alt="Share your Experiences, Review and Rate"
          src="/images/iStock-1409730706.jpg"
          className="absolute h-full w-full"
          // inset-0 size-full object-cover
        />
      </div>
      <div
        className="flex flex-1 flex-col w-1/3 justify-center px-4 py-12 sm:px-6 xl:flex-none
          xl:px-20"
      >
        <div className="mx-auto w-full lg:w-96 py-4">
          <div className="flex flex-col items-center">
            <img
              alt="Rewardwale"
              src="/brand_logo/png/RW_White_Name.png"
              className="w-[220px] hidden dark:inline"
            />
            <img
              alt="Rewardwale"
              src="/brand_logo/png/RW_Black_Name.png"
              className="w-[220px] inline dark:hidden"
            />
            <h2 className="mt-6 text-2xl/9 tracking-tight text-primary font-Inter font-bold">
              Sign In
            </h2>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
                        disabled={pending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
            <Button type="submit" className="w-full">
              Send reset email
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
