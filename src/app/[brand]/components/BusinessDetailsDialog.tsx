"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { formatHours } from "@/lib/utils";
import { BusinessPage } from "../types/brands";

interface BusinessDetailsDialogProps {
  business: BusinessPage;
}

const BusinessDetailsDialog: React.FC<BusinessDetailsDialogProps> = ({
  business,
}) => {

  return (
    <div className="h-[90vh] md:h-[80vh] w-full flex flex-col">
  
      <div className="bg-gray-800 p-4">
        <h2 className="text-xl md:text-2xl font-bold">
          {business.businessName}
        </h2>
      </div>

      <Tabs
        defaultValue="overview"
        className="flex-1 flex flex-col overflow-hidden pb-5"
      >
        <TabsList className="w-full justify-start px-2 md:px-4 py-0 h-12 bg-gray-100 border-b">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-b-2 rounded-none px-3 md:px-4"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger value="photos" className="rounded-none px-3 md:px-4">
            Photos
          </TabsTrigger>
          <TabsTrigger value="hours" className="rounded-none px-3 md:px-4">
            Operation Hours
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="h-full p-4 md:p-6 m-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3">About</h3>
                <p>{business.desc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {Object.entries(business.content || {}).map(([key, values]) => (
                  <div
                    key={key}
                    className="bg-gray-50 p-4 rounded-lg overflow-hidden"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{key}</h4>
                    <div>
                      {values.map((value, index) => (
                        <p key={index}>{value}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {business.keywords.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {business.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <span className="font-medium min-w-20">Email:</span>
                    <a
                      href={`mailto:${business.contactUsDetails.indEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {business.contactUsDetails.indEmail}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium min-w-20">Phone:</span>
                    <a
                      href={`tel:${business.contactUsDetails.indCountryCode}${business.contactUsDetails.indMobileNum}`}
                      className="text-blue-600 hover:underline"
                    >
                      {business.contactUsDetails.indCountryCode}{" "}
                      {business.contactUsDetails.indMobileNum}
                    </a>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-medium min-w-20">Location:</span>
                    <span className="flex-1">{business.location}</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  Social Media
                </h3>
                <div className="flex flex-wrap gap-3">
                  {business.socialUrls.whatsapp && (
                    <a
                      href={business.socialUrls.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600
                        transition-colors text-sm md:text-base"
                    >
                      WhatsApp
                    </a>
                  )}
                  {business.socialUrls.instagram && (
                    <a
                      href={business.socialUrls.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600
                        transition-colors text-sm md:text-base"
                    >
                      Instagram
                    </a>
                  )}
                  {business.socialUrls.facebook && (
                    <a
                      href={business.socialUrls.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors
                        text-sm md:text-base"
                    >
                      Facebook
                    </a>
                  )}
                  {business.socialUrls.twitter && (
                    <a
                      href={business.socialUrls.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors
                        text-sm md:text-base"
                    >
                      Twitter
                    </a>
                  )}
                  {business.socialUrls.linkedin && (
                    <a
                      href={business.socialUrls.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors
                        text-sm md:text-base"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="h-full p-4 md:p-6 m-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {business.businessImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={image.original}
                    alt={`${business.businessName} image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
              {business.businessBanners.map((banner, index) => (
                <div
                  key={`banner-${index}`}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={banner.original}
                    alt={`${business.businessName} banner ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hours" className="h-full p-4 md:p-6 m-0">
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                Operational Hours
              </h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Day
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hours
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(business.operationalHours).map(
                        ([day, hours]) => (
                          <tr key={day} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                              {day}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {hours.map((hour, index) => (
                                <div key={index}>
                                  {formatHours(hour.open)} -{" "}
                                  {formatHours(hour.close)}
                                </div>
                              ))}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {hours[0]?.isOpen ? (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Open
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                  Closed
                                </span>
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default BusinessDetailsDialog;
