"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "@/hooks/use-location";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function LocationInput({
  value,
  onChange,
  disabled,
}: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const { location, loading, error } = useLocation();
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    if (location && !value) {
      onChange(location);
    }
  }, [location, value, onChange]);

  console.log("location useEffect", location);

  useEffect(() => {
    // if (typeof window !== 'undefined' && !window.google) {
    //   setApiError(true);
    //   return;
    // }

    if (typeof google !== "undefined" && inputRef.current && !autocomplete) {
      try {
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
          },
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            onChange(place.formatted_address);
          }
        });

        setAutocomplete(autocomplete);
      } catch (error) {
        setApiError(true);
      }
    }
  }, [onChange, autocomplete]);

  console.log("checking apiError", apiError);

  return (
    <div className="space-y-2">
      {/* <Label htmlFor="location">Location</Label> */}
      <div className="relative">
        <Input
          ref={inputRef}
          id="location"
          placeholder="Enter the location"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
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
