import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

interface BookingRequest {
    name: string;
    plan: string;
    goal: string;
    location: string;
    bookingDate: string;
    bookingTime: string;
    contact: string;
    specialRequest?: string;
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export default {
    fetch: withSupabase(
        {
            auth: ["publishable"],
        },
        async (req, ctx) => {
            try {
                if (req.method === "OPTIONS") {
                    return new Response(null, { headers: corsHeaders });
                }

                console.log("Admin available:", !!ctx.supabaseAdmin);

                const booking: BookingRequest = await req.json();

                const { data, error } = await ctx.supabaseAdmin
                    .from("bookings")
                    .insert({
                        name: booking.name,
                        plan: booking.plan,
                        goal: booking.goal,
                        location: booking.location,
                        booking_date: booking.bookingDate,
                        booking_time: booking.bookingTime,
                        contact: booking.contact,
                        special_request: booking.specialRequest ?? null,
                        status: "confirmed",
                    })
                    .select()
                    .single();

                if (error) {
                    console.error("Insert error:", error);

                    return Response.json(
                        {
                            success: false,
                            message: error.message,
                        },
                        { status: 500, headers: corsHeaders }
                    );
                }

                return Response.json(
                    {
                        success: true,
                        booking: data,
                    },
                    { headers: corsHeaders }
                );

            } catch (err) {
                console.error("Function error:", err);

                return Response.json(
                    {
                        success: false,
                        message: "Invalid request.",
                    },
                    { status: 500, headers: corsHeaders }
                );
            }
        }
    ),
};