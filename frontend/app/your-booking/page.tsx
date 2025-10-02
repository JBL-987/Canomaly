"use client";

import {
  ArrowRight,
  Clock,
  CreditCard,
  Save,
  Ticket,
  User,
  Users,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";

// --- Mock Data ---
const COUNTRY_CODES = [
  { name: "Indonesia", code: "+62" },
  { name: "Afghanistan", code: "+93" },
  { name: "Albania", code: "+355" },
  { name: "Algeria", code: "+213" },
  { name: "American Samoa", code: "+1684" },
  { name: "Andorra", code: "+376" },
  { name: "Angola", code: "+244" },
  { name: "Anguilla", code: "+1264" },
  { name: "Antarctica", code: "+672" },
  { name: "Antigua and Barbuda", code: "+1268" },
  { name: "Argentina", code: "+54" },
  { name: "Armenia", code: "+374" },
  { name: "Aruba", code: "+297" },
  { name: "Australia", code: "+61" },
  { name: "Austria", code: "+43" },
  { name: "Azerbaijan", code: "+994" },
  { name: "Bahamas", code: "+1242" },
  { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" },
  { name: "Barbados", code: "+1246" },
  { name: "Belarus", code: "+375" },
  { name: "Belgium", code: "+32" },
  { name: "Belize", code: "+501" },
  { name: "Benin", code: "+229" },
  { name: "Bermuda", code: "+1441" },
  { name: "Bhutan", code: "+975" },
  { name: "Bolivia", code: "+591" },
  { name: "Bosnia and Herzegovina", code: "+387" },
  { name: "Botswana", code: "+267" },
  { name: "Brazil", code: "+55" },
  { name: "British Indian Ocean Territory", code: "+246" },
  { name: "Brunei", code: "+673" },
  { name: "Bulgaria", code: "+359" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Burundi", code: "+257" },
  { name: "Cambodia", code: "+855" },
  { name: "Cameroon", code: "+237" },
  { name: "Canada", code: "+1" },
  { name: "Cape Verde", code: "+238" },
  { name: "Cayman Islands", code: "+1345" },
  { name: "Central African Republic", code: "+236" },
  { name: "Chad", code: "+235" },
  { name: "Chile", code: "+56" },
  { name: "China", code: "+86" },
  { name: "Colombia", code: "+57" },
  { name: "Comoros", code: "+269" },
  { name: "Congo", code: "+242" },
  { name: "Cook Islands", code: "+682" },
  { name: "Costa Rica", code: "+506" },
  { name: "Croatia", code: "+385" },
  { name: "Cuba", code: "+53" },
  { name: "Cyprus", code: "+357" },
  { name: "Czech Republic", code: "+420" },
  { name: "Denmark", code: "+45" },
  { name: "Djibouti", code: "+253" },
  { name: "Dominica", code: "+1767" },
  { name: "Dominican Republic", code: "+1809" },
  { name: "Ecuador", code: "+593" },
  { name: "Egypt", code: "+20" },
  { name: "El Salvador", code: "+503" },
  { name: "Equatorial Guinea", code: "+240" },
  { name: "Eritrea", code: "+291" },
  { name: "Estonia", code: "+372" },
  { name: "Ethiopia", code: "+251" },
  { name: "Falkland Islands", code: "+500" },
  { name: "Faroe Islands", code: "+298" },
  { name: "Fiji", code: "+679" },
  { name: "Finland", code: "+358" },
  { name: "France", code: "+33" },
  { name: "Gabon", code: "+241" },
  { name: "Gambia", code: "+220" },
  { name: "Georgia", code: "+995" },
  { name: "Germany", code: "+49" },
  { name: "Ghana", code: "+233" },
  { name: "Gibraltar", code: "+350" },
  { name: "Greece", code: "+30" },
  { name: "Greenland", code: "+299" },
  { name: "Grenada", code: "+1473" },
  { name: "Guatemala", code: "+502" },
  { name: "Guinea", code: "+224" },
  { name: "Guyana", code: "+592" },
  { name: "Haiti", code: "+509" },
  { name: "Honduras", code: "+504" },
  { name: "Hong Kong", code: "+852" },
  { name: "Hungary", code: "+36" },
  { name: "Iceland", code: "+354" },
  { name: "India", code: "+91" },
  { name: "Iran", code: "+98" },
  { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" },
  { name: "Israel", code: "+972" },
  { name: "Italy", code: "+39" },
  { name: "Jamaica", code: "+1876" },
  { name: "Japan", code: "+81" },
  { name: "Jordan", code: "+962" },
  { name: "Kazakhstan", code: "+7" },
  { name: "Kenya", code: "+254" },
  { name: "Kiribati", code: "+686" },
  { name: "Kuwait", code: "+965" },
  { name: "Kyrgyzstan", code: "+996" },
  { name: "Latvia", code: "+371" },
  { name: "Lebanon", code: "+961" },
  { name: "Lesotho", code: "+266" },
  { name: "Liberia", code: "+231" },
  { name: "Libya", code: "+218" },
  { name: "Liechtenstein", code: "+423" },
  { name: "Lithuania", code: "+370" },
  { name: "Luxembourg", code: "+352" },
  { name: "Macau", code: "+853" },
  { name: "Madagascar", code: "+261" },
  { name: "Malawi", code: "+265" },
  { name: "Malaysia", code: "+60" },
  { name: "Maldives", code: "+960" },
  { name: "Mali", code: "+223" },
  { name: "Malta", code: "+356" },
  { name: "Mauritius", code: "+230" },
  { name: "Mexico", code: "+52" },
  { name: "Monaco", code: "+377" },
  { name: "Mongolia", code: "+976" },
  { name: "Montenegro", code: "+382" },
  { name: "Montserrat", code: "+1664" },
  { name: "Morocco", code: "+212" },
  { name: "Mozambique", code: "+258" },
  { name: "Myanmar", code: "+95" },
  { name: "Namibia", code: "+264" },
  { name: "Nauru", code: "+674" },
  { name: "Nepal", code: "+977" },
  { name: "Netherlands", code: "+31" },
  { name: "New Caledonia", code: "+687" },
  { name: "New Zealand", code: "+64" },
  { name: "Nicaragua", code: "+505" },
  { name: "Niger", code: "+227" },
  { name: "Nigeria", code: "+234" },
  { name: "Norway", code: "+47" },
  { name: "Oman", code: "+968" },
  { name: "Pakistan", code: "+92" },
  { name: "Panama", code: "+507" },
  { name: "Papua New Guinea", code: "+675" },
  { name: "Paraguay", code: "+595" },
  { name: "Peru", code: "+51" },
  { name: "Philippines", code: "+63" },
  { name: "Poland", code: "+48" },
  { name: "Portugal", code: "+351" },
  { name: "Puerto Rico", code: "+1" },
  { name: "Qatar", code: "+974" },
  { name: "Romania", code: "+40" },
  { name: "Russia", code: "+7" },
  { name: "Rwanda", code: "+250" },
  { name: "Samoa", code: "+685" },
  { name: "San Marino", code: "+378" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Senegal", code: "+221" },
  { name: "Serbia", code: "+381" },
  { name: "Seychelles", code: "+248" },
  { name: "Sierra Leone", code: "+232" },
  { name: "Singapore", code: "+65" },
  { name: "Slovakia", code: "+421" },
  { name: "Slovenia", code: "+386" },
  { name: "Solomon Islands", code: "+677" },
  { name: "Somalia", code: "+252" },
  { name: "South Africa", code: "+27" },
  { name: "South Korea", code: "+82" },
  { name: "Spain", code: "+34" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Sudan", code: "+249" },
  { name: "Suriname", code: "+597" },
  { name: "Sweden", code: "+46" },
  { name: "Switzerland", code: "+41" },
  { name: "Syria", code: "+963" },
  { name: "Taiwan", code: "+886" },
  { name: "Tanzania", code: "+255" },
  { name: "Thailand", code: "+66" },
  { name: "Togo", code: "+228" },
  { name: "Tonga", code: "+676" },
  { name: "Trinidad and Tobago", code: "+1868" },
  { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" },
  { name: -"Turkmenistan", code: "+993" },
  { name: "Tuvalu", code: "+688" },
  { name: "Uganda", code: "+256" },
  { name: "Ukraine", code: "+380" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Uruguay", code: "+598" },
  { name: "Uzbekistan", code: "+998" },
  { name: "Vanuatu", code: "+678" },
  { name: "Venezuela", code: "+58" },
  { name: "Vietnam", code: "+84" },
  { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" },
  { name: "Zimbabwe", code: "+263" },
];

// --- Helper Components ---
function InfoCard({
  title,
  children,
  icon: Icon,
  titleButton,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
  titleButton?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-md">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Icon className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
        </div>
        {titleButton}
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

function TripDetailCard({
  train,
  date,
  origin,
  destination,
  isReturn = false,
}: {
  train: any;
  date: string;
  origin: string;
  destination: string;
  isReturn?: boolean;
}) {
  return (
    <div>
      <h3 className="font-bold text-lg text-foreground mb-2">
        {isReturn ? "Return Train" : "Departure Train"}
      </h3>
      <div className="border border-border p-3 rounded-lg bg-muted/50 space-y-3">
        <p className="font-semibold text-card-foreground text-sm">{date}</p>
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-md text-primary">
            {train.name}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({train.class})
            </span>
          </h4>
          <p className="text-xs text-muted-foreground font-medium">
            Non-refundable
          </p>
        </div>
        <div className="flex items-center justify-between text-center">
          <div className="w-1/3">
            <p className="text-xl font-semibold text-card-foreground">
              {train.departureTime}
            </p>
            <p className="text-sm text-muted-foreground">{origin}</p>
          </div>
          <div className="w-1/3 flex flex-col items-center text-muted-foreground">
            <ArrowRight size={20} />
            <span className="text-xs mt-1 flex items-center gap-1">
              <Clock size={12} /> {train.duration}
            </span>
          </div>
          <div className="w-1/3">
            <p className="text-xl font-semibold text-card-foreground">
              {train.arrivalTime}
            </p>
            <p className="text-sm text-muted-foreground">{destination}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingDetails() {
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const departureTrain: any = {};
    const returnTrain: any = {};
    const searchData: any = {};

    for (const [key, value] of params.entries()) {
      if (key.startsWith("departure_")) {
        departureTrain[key.replace("departure_", "")] = value;
      } else if (key.startsWith("return_")) {
        returnTrain[key.replace("return_", "")] = value;
      } else {
        searchData[key] = value;
      }
    }

    const finalReturnTrain =
      Object.keys(returnTrain).length > 0 ? returnTrain : null;
    setBookingDetails({
      searchData,
      departureTrain,
      returnTrain: finalReturnTrain,
    });
  }, []);

  if (!bookingDetails) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading booking details...
      </div>
    );
  }

  const { searchData, departureTrain, returnTrain } = bookingDetails;
  const totalPassengers =
    parseInt(searchData.adults) + parseInt(searchData.infants);
  const departurePrice = parseFloat(departureTrain.price) || 0;
  const returnPrice = parseFloat(returnTrain?.price) || 0;
  const totalPrice = (departurePrice + returnPrice) * totalPassengers;

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-background shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground">Your Booking</h1>
          <p className="text-muted-foreground mt-1">
            Fill in your details and review your booking.
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md text-blue-800">
            <p>Log in or register for a seamless booking and more benefits!</p>
          </div>

          {/* Contact Details Form */}
          <InfoCard
            title="Contact Details"
            icon={User}
            titleButton={
              <button className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <Save size={16} /> <span>Use Saved Details</span>
              </button>
            }
          >
            <p className="text-xs text-muted-foreground -mt-2">
              Contact Details (for E-ticket/Voucher)
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Full Name*
                </label>
                <input
                  type="text"
                  placeholder="Without title and punctuation"
                  className="mt-1 w-full p-2 border border-input rounded-md bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Mobile Number*
                </label>
                <div className="flex mt-1">
                  <select className="p-2 border border-input rounded-l-md bg-background text-sm">
                    {COUNTRY_CODES.map((c) => (
                      <option
                        key={c.code}
                        value={c.code}
                      >{`${c.name} (${c.code})`}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="e.g. 812345678"
                    className="w-full p-2 border-t border-r border-b border-input rounded-r-md bg-background"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Email*
                </label>
                <input
                  type="email"
                  placeholder="e.g. email@example.com"
                  className="mt-1 w-full p-2 border border-input rounded-md bg-background"
                />
              </div>
            </div>
          </InfoCard>

          {/* Traveler Details Form */}
          <InfoCard title="Traveler Details" icon={Users}>
            <p className="text-sm font-bold text-foreground">Adult 1</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Title*
                </label>
                <select className="mt-1 w-full p-2 border border-input rounded-md bg-background">
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Full Name*
                </label>
                <input
                  type="text"
                  placeholder="Without title and punctuation"
                  className="mt-1 w-full p-2 border border-input rounded-md bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  ID Type*
                </label>
                <select className="mt-1 w-full p-2 border border-input rounded-md bg-background">
                  <option>ID Card</option>
                  <option>PASSPORT</option>
                </select>
              </div>
            </div>
          </InfoCard>
        </div>

        <div className="lg:col-span-1 space-y-8 sticky top-8">
          {/* Itinerary */}
          <InfoCard title="Your Itinerary" icon={Ticket}>
            <TripDetailCard
              train={departureTrain}
              date={searchData.departure}
              origin={searchData.origin}
              destination={searchData.destination}
            />
            {returnTrain && (
              <TripDetailCard
                train={returnTrain}
                date={searchData.returnDate}
                origin={searchData.destination}
                destination={searchData.origin}
                isReturn={true}
              />
            )}
          </InfoCard>

          {/* Price Summary */}
          <InfoCard title="Price Summary" icon={CreditCard}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Departure Ticket</span>
                <span>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(departurePrice)}
                </span>
              </div>
              {returnTrain && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Return Ticket</span>
                  <span>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(returnPrice)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passengers</span>
                <span>x {totalPassengers}</span>
              </div>
            </div>
            <div className="border-t border-border mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-card-foreground">
                  Total Price
                </span>
                <span className="text-2xl font-extrabold text-primary">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(totalPrice)}
                </span>
              </div>
            </div>
            <button className="w-full mt-6 bg-primary text-primary-foreground font-bold py-3 px-5 rounded-lg text-lg hover:bg-primary/90 transition-colors shadow-lg">
              Continue to Payment
            </button>
          </InfoCard>
        </div>
      </main>
    </div>
  );
}

export default function YourBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <BookingDetails />
    </Suspense>
  );
}
