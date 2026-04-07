"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function SendEmailButton() {
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/send-alert-email", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "manogna.perka2005@gmail.com",
        }),
      });

      // ✅ safer JSON parsing
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) throw new Error(data.error);

      alert(data.message || "Email sent successfully");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={sendEmail} disabled={loading} className="rounded-full">
      {loading ? "Sending..." : "Send Low Stock Email"}
    </Button>
  );
}