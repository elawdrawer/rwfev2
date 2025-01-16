"use client";

import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { BusinessFormData } from "@/lib/types/business";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

interface LocationStepProps {
  form: UseFormReturn<BusinessFormData>;
}

interface Place {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

const libraries: ("places")[] = ["places"];

export function LocationStep({ form }: LocationStepProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [addressComponents, setAddressComponents] = useState<Place>({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    latitude: 0,
    longitude: 0,
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBmrEg7SfI6pHlfcoAhOBG5GbHXxFz9pqk",
    libraries,
  });

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        const components: Place = {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          latitude: lat,
          longitude: lng,
        };

        place.address_components?.forEach((component) => {
          const types = component.types;
          if (types.includes("street_number") || types.includes("route")) {
            components.street = components.street 
              ? `${components.street} ${component.long_name}`
              : component.long_name;
          }
          if (types.includes("locality")) components.city = component.long_name;
          if (types.includes("administrative_area_level_1")) components.state = component.long_name;
          if (types.includes("country")) components.country = component.long_name;
          if (types.includes("postal_code")) components.postalCode = component.long_name;
        });

        setAddressComponents(components);
        
        // Update form values
        form.setValue("locationCoordinates.latitude", lat);
        form.setValue("locationCoordinates.longitude", lng);
        form.setValue("location", `${components.street}, ${components.city}, ${components.state}, ${components.country}, ${components.postalCode}`);
      }
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Search Address*</FormLabel>
        <Autocomplete
          onLoad={setAutocomplete}
          onPlaceChanged={onPlaceChanged}
        >
          <Input placeholder="Start typing your address..." />
        </Autocomplete>
      </FormItem>

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Address*</FormLabel>
            <FormControl>
              <Input {...field} readOnly />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormItem>
          <FormLabel>City</FormLabel>
          <Input value={addressComponents.city} readOnly />
        </FormItem>

        <FormItem>
          <FormLabel>State</FormLabel>
          <Input value={addressComponents.state} readOnly />
        </FormItem>
      </div>

      {/* <FormItem>
        <FormLabel>Street</FormLabel>
        <Input value={addressComponents.street} readOnly />
      </FormItem> */}
    </div>
  );
}