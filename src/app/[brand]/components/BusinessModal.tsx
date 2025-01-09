"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Business, OperationalHours } from "../types/brands";
import { Clock, Globe, Mail, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";

interface BusinessModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessModal({ business, isOpen, onClose }: BusinessModalProps) {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  type DayOfWeek = typeof daysOfWeek[number];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[60vh] p-0">
        <DialogTitle className="sr-only">
          {business.businessName} Details
        </DialogTitle>
        {/* <div className="relative w-full h-48 md:h-64">
          <Image
            src={business.defaultBusinessBanner.original}
            alt={business.businessName}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {business.avgRating.toFixed(1)} ({business.totalRating})
            </Badge>
          </div>
        </div> */}

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{business.businessName}</h2>
              <p className="text-muted-foreground">{business.title}</p>
            </div>
            <Badge variant={business.status === "Active" ? "default" : "secondary"}>
              {business.status}
            </Badge>
          </div>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {/* <TabsTrigger value="photos">Photos</TabsTrigger> */}
              <TabsTrigger value="hours">Hours</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ScrollArea className="h-[calc(90vh-400px)]">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{business.desc}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <p className="text-sm">{business.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <p className="text-sm">{business.contactUsDetails.indCountryCode} {business.contactUsDetails.indMobileNum}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <p className="text-sm">{business.contactUsDetails.indEmail}</p>
                    </div>
                    {business.websiteURLs && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <p className="text-sm">{business.websiteURLs}</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* <TabsContent value="photos">
              <ScrollArea className="h-[calc(90vh-400px)]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {business.businessImages.map((image:any, index:any) => (
                    image.original && (
                      <div key={image._id} className="relative aspect-square">
                        <Image
                          src={image.original}
                          alt={`Business image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )
                  ))}
                </div>
              </ScrollArea>
            </TabsContent> */}

            <TabsContent value="hours">
              <ScrollArea className="h-[calc(90vh-400px)]">
                <div className="space-y-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center justify-between py-2">
                      <span className="capitalize">{day}</span>
                      <div className="space-y-1">
                        {business.operationalHours[day as DayOfWeek].map((hours:any) => (
                          <div key={hours._id} className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{hours.open} - {hours.close}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}