"use client";

import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Download, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";

// Ticket type with station relations
type Ticket = {
  id: string;
  transaction_id: string;
  passenger_name: string;
  seat_number: string;
  price: number;
  final_price: number;
  status_id: number;
  created_at: string;
  ticket_class_id: number;
  station_from_id?: { id: number; name: string };
  station_to_id?: { id: number; name: string };
};

export default function TicketsLogPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  const supabase = createClient();
  const pageSize = 10;

  function getStatusLabel(status_id: number) {
    switch (status_id) {
      case 1:
        return "confirmed";
      case 2:
        return "pending";
      case 3:
        return "cancelled";
      default:
        return "unknown";
    }
  }

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("tickets")
        .select(
          `
          id,
          transaction_id,
          passenger_name,
          seat_number,
          price,
          final_price,
          status_id,
          created_at,
          ticket_class_id,
          station_from_id ( id, name ),
          station_to_id ( id, name )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching tickets:", error.message);
      } else {
        setTickets((data as Ticket[]) || []);
        setTotalTickets(count || 0);
      }
      setLoading(false);
    }

    fetchTickets();
  }, [page]);

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.passenger_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.seat_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(totalTickets / pageSize);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tickets Log</h1>
            <p className="text-muted-foreground">
              Complete history of all ticket transactions
            </p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Tickets</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading tickets...</p>
            ) : filteredTickets.length === 0 ? (
              <p className="text-muted-foreground">No tickets found.</p>
            ) : (
              <div className="rounded-lg border border-border">
                {/* Table Header */}
                <div className="grid grid-cols-7 gap-4 border-b border-border bg-muted/50 px-6 py-3 text-sm font-medium text-muted-foreground">
                  <div>Ticket ID</div>
                  <div>Booking Time</div>
                  <div>Passenger</div>
                  <div>Route</div>
                  <div>Seat</div>
                  <div>Price</div>
                  <div>Status</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-border">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="grid grid-cols-7 gap-4 px-6 py-4 text-sm hover:bg-accent/5 transition-colors"
                    >
                      {/* Ticket ID */}
                      <div className="font-mono font-medium text-card-foreground">
                        {ticket.transaction_id}
                      </div>

                      {/* Booking Time */}
                      <div className="text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleString()}
                      </div>

                      {/* Passenger */}
                      <div className="text-card-foreground">
                        {ticket.passenger_name}
                      </div>

                      {/* Route */}
                      <div className="text-muted-foreground">
                        {ticket.station_from_id?.name} →{" "}
                        {ticket.station_to_id?.name}
                      </div>

                      {/* Seat */}
                      <div className="text-muted-foreground">
                        {ticket.seat_number}
                      </div>

                      {/* Price */}
                      <div className="font-medium text-card-foreground">
                        Rp{" "}
                        {(ticket.final_price ?? ticket.price).toLocaleString()}
                      </div>

                      {/* Status */}
                      <div>
                        <Badge
                          className={cn(
                            getStatusLabel(ticket.status_id) === "confirmed" &&
                              "bg-chart-4 text-background",
                            getStatusLabel(ticket.status_id) === "pending" &&
                              "bg-accent text-accent-foreground",
                            getStatusLabel(ticket.status_id) === "cancelled" &&
                              "bg-destructive text-destructive-foreground"
                          )}
                        >
                          {getStatusLabel(ticket.status_id)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing page {page} of {totalPages} ({totalTickets} tickets)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
