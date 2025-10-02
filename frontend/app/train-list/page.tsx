"use client";

import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Link,
  Tag,
  Users,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";

// --- Mock Data ---
const MOCK_TRAINS = [
  {
    id: "KA-101",
    name: "Argo Parahyangan",
    class: "Eksekutif",
    departureTime: "08:15",
    arrivalTime: "11:20",
    duration: "3h 5m",
    price: 350000,
  },
  {
    id: "KA-102",
    name: "Serayu Pagi",
    class: "Ekonomi",
    departureTime: "09:30",
    arrivalTime: "13:45",
    duration: "4h 15m",
    price: 180000,
  },
  {
    id: "KA-103",
    name: "Argo Wilis",
    class: "Eksekutif",
    departureTime: "12:45",
    arrivalTime: "15:55",
    duration: "3h 10m",
    price: 375000,
  },
  {
    id: "KA-104",
    name: "Lodaya",
    class: "Bisnis",
    departureTime: "15:00",
    arrivalTime: "18:30",
    duration: "3h 30m",
    price: 250000,
  },
];

// --- Helper Components ---
function TrainCard({
  train,
  origin,
  destination,
  onSelect,
  isSelected,
}: {
  train: (typeof MOCK_TRAINS)[0];
  origin: string;
  destination: string;
  onSelect: (train: any) => void;
  isSelected: boolean;
}) {
  return (
    <div
      className={`border-2 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 bg-card ${
        isSelected ? "border-primary ring-2 ring-primary" : "border-border"
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-primary">{train.name}</h3>
          <span className="bg-primary/10 text-primary font-semibold text-xs px-3 py-1 rounded-full">
            {train.class}
          </span>
        </div>
        <div className="flex items-center justify-between mt-4 text-center">
          <div className="w-1/3">
            <p className="text-2xl font-semibold text-card-foreground">
              {train.departureTime}
            </p>
            <p className="text-sm text-muted-foreground">{origin}</p>
          </div>
          <div className="w-1/3 flex flex-col items-center text-muted-foreground">
            <ArrowRight size={20} />
            <span className="text-xs mt-1">{train.duration}</span>
          </div>
          <div className="w-1/3">
            <p className="text-2xl font-semibold text-card-foreground">
              {train.arrivalTime}
            </p>
            <p className="text-sm text-muted-foreground">{destination}</p>
          </div>
        </div>
      </div>
      <div className="bg-muted p-4 flex justify-between items-center border-t-2 border-border">
        <p className="text-xl font-extrabold text-foreground">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(train.price)}
          <span className="text-sm font-medium text-muted-foreground">
            /pax
          </span>
        </p>
        <button
          onClick={() => onSelect(train)}
          disabled={isSelected}
          className="bg-primary text-primary-foreground font-bold py-2 px-5 rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg disabled:bg-muted-foreground disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={16} /> Selected
            </>
          ) : (
            "Select"
          )}
        </button>
      </div>
    </div>
  );
}

function SearchResults() {
  const [searchData, setSearchData] = useState<any>(null);
  const [selectedDeparture, setSelectedDeparture] = useState<any>(null);
  const [selectedReturn, setSelectedReturn] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = {
      operator: params.get("operator") || "N/A",
      tripType: params.get("tripType") || "N/A",
      origin: params.get("origin") || "N/A",
      destination: params.get("destination") || "N/A",
      departure: params.get("departure") || "N/A",
      returnDate: params.get("return"),
      adults: params.get("adults") || "0",
      infants: params.get("infants") || "0",
    };
    setSearchData(data);
  }, []);

  const handleProceed = () => {
    const params = new URLSearchParams();

    // Add original search data
    Object.entries(searchData).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    // Add selected departure train data
    Object.entries(selectedDeparture).forEach(([key, value]) => {
      params.append(`departure_${key}`, String(value));
    });

    // Add selected return train data if it exists
    if (selectedReturn) {
      Object.entries(selectedReturn).forEach(([key, value]) => {
        params.append(`return_${key}`, String(value));
      });
    }

    // Navigate to the booking page
    window.location.href = `/your-booking?${params.toString()}`;
  };

  if (!searchData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading search results...
      </div>
    );
  }

  const totalPassengers =
    parseInt(searchData.adults) + parseInt(searchData.infants);
  const canProceed =
    searchData.tripType === "round-trip"
      ? selectedDeparture && selectedReturn
      : selectedDeparture;

  return (
    <div className="min-h-screen bg-muted pb-32">
      <header className="bg-background shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ChevronLeft size={20} />
            <span className="font-semibold">Modify Search</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-card p-5 rounded-xl shadow-md border border-border mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-card-foreground">
            {searchData.origin}{" "}
            <ArrowRight className="inline-block mx-2" size={24} />{" "}
            {searchData.destination}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mt-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{searchData.departure}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{totalPassengers} Passenger(s)</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={16} />
              <span>{searchData.operator.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Departure Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TRAINS.map((train) => (
              <TrainCard
                key={train.id}
                train={train}
                origin={searchData.origin}
                destination={searchData.destination}
                isSelected={selectedDeparture?.id === train.id}
                onSelect={(selectedTrain) =>
                  setSelectedDeparture(selectedTrain)
                }
              />
            ))}
          </div>
        </section>

        {searchData.tripType === "round-trip" && searchData.returnDate && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                Return Results
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar size={16} />
                <span>{searchData.returnDate}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...MOCK_TRAINS].reverse().map((train) => (
                <TrainCard
                  key={`${train.id}-return`}
                  train={train}
                  origin={searchData.destination}
                  destination={searchData.origin}
                  isSelected={selectedReturn?.id === train.id}
                  onSelect={(selectedTrain) => setSelectedReturn(selectedTrain)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedDeparture && (
        <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t-2 border-border shadow-2xl p-4 z-20">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-center md:text-left">
              <p className="font-bold text-foreground">
                Departure:{" "}
                <span className="font-normal text-primary">
                  {selectedDeparture.name} ({selectedDeparture.departureTime})
                </span>
              </p>
              {selectedReturn && (
                <p className="font-bold text-foreground">
                  Return:{" "}
                  <span className="font-normal text-primary">
                    {selectedReturn.name} ({selectedReturn.departureTime})
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={handleProceed}
              disabled={!canProceed}
              className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg w-full md:w-auto hover:bg-primary/90 transition-colors shadow-lg disabled:bg-muted-foreground disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function TrainListPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
