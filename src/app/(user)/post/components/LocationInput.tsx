"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "@/hooks/use-location";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationInput({ value, onChange }: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const { location, loading, error } = useLocation();
  const [apiError, setApiError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (location && !value && !isInitialized) {
      onChange(location);
      setIsInitialized(true);
    }
  }, [location, value, onChange, isInitialized]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.google) {
      setApiError(true);
      return;
    }

    if (inputRef.current && !autocomplete) {
      try {
        const autocompleteInstance = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
          },
        );

        autocompleteInstance.addListener("place_changed", () => {
          const place = autocompleteInstance.getPlace();
          if (place.formatted_address) {
            onChange(place.formatted_address);
          }
        });

        setAutocomplete(autocompleteInstance);
      } catch (error) {
        console.error("Error initializing Google Maps Autocomplete:", error);
        setApiError(true);
      }
    }


    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="location">Location</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="location"
          placeholder="Enter the location"
          value={value}
          onChange={handleInputChange}
          className="pr-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      {apiError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Location services are currently unavailable. Please enter your
            location manually.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
