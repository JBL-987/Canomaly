"use client";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Minus,
  Plus,
  Train,
} from "lucide-react";
import { useEffect, useState } from "react";

const KAI_STATIONS = [
  "Jakarta Gambir",
  "Jakarta Pasar Senen",
  "Bandung",
  "Yogyakarta",
  "Solo Balapan",
  "Surabaya Gubeng",
  "Surabaya Pasar Turi",
  "Semarang Tawang",
  "Malang",
  "Cirebon",
];

const WHOOSH_STATIONS = [
  "Halim (Jakarta)",
  "Karawang",
  "Padalarang",
  "Bandung (Tegalluar)",
];

export function TrainBookingForm() {
  const [trainOperator, setTrainOperator] = useState<"kai" | "whoosh">("kai");
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departure: undefined as Date | undefined,
    return: undefined as Date | undefined,
    adults: 1,
    infants: 0,
  });

  useEffect(() => {
    if (tripType === "one-way") {
      setFormData((prev) => ({ ...prev, return: undefined }));
    }
  }, [tripType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    params.append("operator", trainOperator);
    params.append("tripType", tripType);
    if (formData.origin) params.append("origin", formData.origin);
    if (formData.destination)
      params.append("destination", formData.destination);

    if (formData.departure) {
      params.append(
        "departure",
        formData.departure.toISOString().split("T")[0]
      );
    }
    if (formData.return && tripType === "round-trip") {
      params.append("return", formData.return.toISOString().split("T")[0]);
    }

    params.append("adults", formData.adults.toString());
    params.append("infants", formData.infants.toString());

    // Use standard window location for navigation
    window.location.href = `/train-list?${params.toString()}`;
  };

  const incrementPassengers = (type: "adults" | "infants") => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const decrementPassengers = (type: "adults" | "infants") => {
    setFormData((prev) => ({
      ...prev,
      [type]: Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
    }));
  };

  const stations = trainOperator === "kai" ? KAI_STATIONS : WHOOSH_STATIONS;

  return (
    <Card className="shadow-xl border-2">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg">
            <Train className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-4xl font-bold text-balance text-primary">
            Trains
          </CardTitle>
        </div>
        <Separator className="bg-border" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Train Operator:
          </Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTrainOperator("kai")}
              className={cn(
                "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
                trainOperator === "kai"
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              Indonesia (KAI)
            </button>
            <button
              type="button"
              onClick={() => setTrainOperator("whoosh")}
              className={cn(
                "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
                trainOperator === "whoosh"
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              Indonesia (Whoosh)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            {/* Origin */}
            <div className="flex-1 min-w-[160px] space-y-2">
              <Label className="text-sm font-medium">Origin</Label>
              <Popover open={originOpen} onOpenChange={setOriginOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={originOpen}
                    className="h-11 w-full justify-between font-normal bg-transparent"
                  >
                    {formData.origin || "Search station..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[280px] p-0 shadow-xl border-2"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search station..."
                      className="h-10"
                    />
                    <CommandList>
                      <CommandEmpty>No station found.</CommandEmpty>
                      <CommandGroup>
                        {stations.map((station) => (
                          <CommandItem
                            key={station}
                            value={station}
                            onSelect={(currentValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                origin: currentValue,
                              }));
                              setOriginOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.origin === station
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {station}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Destination */}
            <div className="flex-1 min-w-[160px] space-y-2">
              <Label className="text-sm font-medium">Destination</Label>
              <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={destinationOpen}
                    className="h-11 w-full justify-between font-normal bg-transparent"
                  >
                    {formData.destination || "Search station..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[280px] p-0 shadow-xl border-2"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search station..."
                      className="h-10"
                    />
                    <CommandList>
                      <CommandEmpty>No station found.</CommandEmpty>
                      <CommandGroup>
                        {stations.map((station) => (
                          <CommandItem
                            key={station}
                            value={station}
                            onSelect={(currentValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                destination: currentValue,
                              }));
                              setDestinationOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.destination === station
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {station}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Departure */}
            <div className="flex-1 min-w-[160px] space-y-2">
              <Label className="text-sm font-medium">Departure</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-11 w-full justify-start text-left font-normal",
                      !formData.departure && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.departure ? (
                      format(formData.departure, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 shadow-xl border-2"
                  align="start"
                >
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-4 rounded-lg">
                    <Calendar
                      mode="single"
                      selected={formData.departure}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, departure: date }))
                      }
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className="rounded-lg border-0"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Return */}
            <div className="flex-1 min-w-[160px] space-y-2">
              <Label className="text-sm font-medium">Return</Label>
              <div className="space-y-2">
                <RadioGroup
                  value={tripType}
                  onValueChange={(value) =>
                    setTripType(value as "one-way" | "round-trip")
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-way" id="one-way" />
                    <Label
                      htmlFor="one-way"
                      className="cursor-pointer font-normal text-xs"
                    >
                      One-way
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="round-trip" id="round-trip" />
                    <Label
                      htmlFor="round-trip"
                      className="cursor-pointer font-normal text-xs"
                    >
                      Round-trip
                    </Label>
                  </div>
                </RadioGroup>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={tripType === "one-way"}
                      className={cn(
                        "h-11 w-full justify-start text-left font-normal",
                        tripType === "one-way" &&
                          "opacity-50 cursor-not-allowed",
                        !formData.return && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.return ? (
                        format(formData.return, "PPP")
                      ) : (
                        <span>
                          {tripType === "one-way"
                            ? "One-way trip"
                            : "Pick a date"}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto p-0 shadow-xl border-2"
                    align="start"
                  >
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-4 rounded-lg">
                      <Calendar
                        mode="single"
                        selected={formData.return}
                        onSelect={(date) =>
                          setFormData((prev) => ({ ...prev, return: date }))
                        }
                        disabled={(date) =>
                          date <
                          (formData.departure ||
                            new Date(new Date().setHours(0, 0, 0, 0)))
                        }
                        initialFocus
                        className="rounded-lg border-0"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Passengers */}
            <div className="flex-1 min-w-[180px] space-y-2">
              <Label className="text-sm font-medium">No. of Passengers</Label>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Adult</Label>
                  <div className="flex items-center gap-1 h-11 border-2 rounded-lg px-2 bg-background">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-primary/10"
                      onClick={() => decrementPassengers("adults")}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="flex-1 text-center font-semibold text-primary">
                      {formData.adults}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-primary/10"
                      onClick={() => incrementPassengers("adults")}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Infant
                  </Label>
                  <div className="flex items-center gap-1 h-11 border-2 rounded-lg px-2 bg-background">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-primary/10"
                      onClick={() => decrementPassengers("infants")}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="flex-1 text-center font-semibold text-primary">
                      {formData.infants}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-primary/10"
                      onClick={() => incrementPassengers("infants")}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 font-semibold text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          >
            Search Trains
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
