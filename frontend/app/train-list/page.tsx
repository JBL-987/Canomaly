"use client";

import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  Link,
  Tag,
  Users,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";

// --- Mock Data ---
// In a real application, this would come from an API call
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

// A single card representing a train option
function TrainCard({
  train,
  origin,
  destination,
}: {
  train: (typeof MOCK_TRAINS)[0];
  origin: string;
  destination: string;
}) {
  return (
    <div className="border-border border-2 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 bg-card">
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
        <button className="bg-primary text-primary-foreground font-bold py-2 px-5 rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg">
          Select
        </button>
      </div>
    </div>
  );
}

// The main component that reads params and displays results
function SearchResults() {
  const [searchData, setSearchData] = useState<any>(null);

  useEffect(() => {
    // We use the standard browser URLSearchParams API to read the query string
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
  }, []); // The empty dependency array ensures this runs only once on component mount

  // Show a loading state until the search data is parsed from the URL
  if (!searchData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading search results...
      </div>
    );
  }

  const totalPassengers =
    parseInt(searchData.adults) + parseInt(searchData.infants);

  return (
    <div className="min-h-screen bg-muted">
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
        {/* Search Summary Card */}
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

        {/* Departure Results */}
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
              />
            ))}
          </div>
        </section>

        {/* Return Results (only if round-trip) */}
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
              {/* We reverse the mock data for variety, and swap origin/destination */}
              {[...MOCK_TRAINS].reverse().map((train) => (
                <TrainCard
                  key={`${train.id}-return`}
                  train={train}
                  origin={searchData.destination}
                  destination={searchData.origin}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// The main page component
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
