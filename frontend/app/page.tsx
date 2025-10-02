import { AuthButton } from "@/components/auth-button";
import { TrainBookingForm } from "@/components/train-booking-form";
import VantaBg from "@/components/vanta-bg";

export default function Home() {
  return (
    <>
      <VantaBg />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <nav className="flex justify-between border-b-white/10 border-b-4 items-center px-6 py-8 ">
          <h1 className="text-3xl font-bold">Canomaly</h1>
          <AuthButton />
        </nav>
        <div className="container mx-auto max-w-4xl mt-8">
          <TrainBookingForm />
        </div>
      </main>
    </>
  );
}
