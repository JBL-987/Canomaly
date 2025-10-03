"use client";

import { TrainBookingForm } from "@/components/train-booking-form";

export default function Home() {
  return (
    <div className="relative flex itemce">
      {/* Main content */}
      <main className="relative z-10 container mx-auto max-w-4xl mt-24">
        <TrainBookingForm />
      </main>
    </div>
  );
}
