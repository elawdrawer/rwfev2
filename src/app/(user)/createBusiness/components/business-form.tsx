"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessFormSchema } from "@/lib/schemas/business";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { BusinessStep } from "./steps/business-step";
import { ContactStep } from "./steps/contact-step";
import { HoursStep } from "./steps/hours-step";
import { LocationStep } from "./steps/location-step";
import { SocialStep } from "./steps/social-step";
import { ContentStep } from "./steps/content-step";
import type { BusinessFormData, FormStep } from "@/lib/types/business";
import {
  Building2,
  Contact,
  Clock,
  MapPin,
  Share2,
  FileText,
} from "lucide-react";
import { addBusiness } from "@/apis/business";

const STEPS: { title: string; icon: React.ReactNode; id: FormStep }[] = [
  {
    title: "Business Details",
    icon: <Building2 className="h-5 w-5" />,
    id: "business",
  },
  {
    title: "Contact Info",
    icon: <Contact className="h-5 w-5" />,
    id: "contact",
  },
  {
    title: "Operating Hours",
    icon: <Clock className="h-5 w-5" />,
    id: "hours",
  },
  { title: "Location", icon: <MapPin className="h-5 w-5" />, id: "location" },
  { title: "Social Media", icon: <Share2 className="h-5 w-5" />, id: "social" },
  { title: "Content", icon: <FileText className="h-5 w-5" />, id: "content" },
];

const DEFAULT_VALUES: BusinessFormData = {
  businessName: "",
  contactUsDetails: {
    indEmail: "",
    indCountryCode: "+91",
    indMobileNum: "",
  },
  operationalHours: {
    monday: [{ open: "09:00", close: "17:00" }],
    tuesday: [{ open: "09:00", close: "17:00" }],
    wednesday: [{ open: "09:00", close: "17:00" }],
    thursday: [{ open: "09:00", close: "17:00" }],
    friday: [{ open: "09:00", close: "17:00" }],
    saturday: [{ open: "09:00", close: "17:00" }],
    sunday: [{ open: "09:00", close: "17:00" }],
  },
  handle: "",
  title: "",
  desc: "",
  websiteUrl: "",
  location: "",
  locationCoordinates: {
    latitude: 0,
    longitude: 0,
  },
  socialUrls: {
    whatsapp: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    twitter: "",
  },
  keywords: [],
  content: {},
};

export function BusinessForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>("business");

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const getStepFields = (step: FormStep): (keyof BusinessFormData)[] => {
    switch (step) {
      case "business":
        return ["businessName", "handle", "title", "desc", "websiteUrl"];
      case "contact":
        return ["contactUsDetails"];
      case "hours":
        return ["operationalHours"];
      case "location":
        return ["location", "locationCoordinates"];
      case "social":
        return ["socialUrls"];
      case "content":
        return ["keywords", "content"];
      default:
        return [];
    }
  };

  const isStepValid = async () => {
    const fields = getStepFields(currentStep);
    const result = await form.trigger(fields as any);
    return result;
  };

  const nextStep = async () => {
    if (await isStepValid()) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < STEPS.length) {
        setCurrentStep(STEPS[nextIndex].id);
      }
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  async function onSubmit(data: BusinessFormData) {
    try {
      const response = await addBusiness(data);
      console.log("checking res of add business", response);
      if (response) {
        toast.success("Business information submitted successfully!");
        <Toaster />;
      }
      // if (!response.ok) {
      //   throw new Error("Failed to submit form");
      // }
    } catch (error) {
      console.log("checking error", error);
      toast.error("Failed to submit form. Please try again.");
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case "business":
        return <BusinessStep form={form} />;
      case "contact":
        return <ContactStep form={form} />;
      case "hours":
        return <HoursStep form={form} />;
      case "location":
        return <LocationStep form={form} />;
      case "social":
        return <SocialStep form={form} />;
      case "content":
        return <ContentStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center ${
            index <= currentStepIndex
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2">
              {step.icon}
            </div>
            <span className="text-sm text-center">{step.title}</span>
          </div>
        ))}
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
              >
                Previous
              </Button>

              {isLastStep ? (
                <Button type="submit">Submit</Button>
              ) : (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
