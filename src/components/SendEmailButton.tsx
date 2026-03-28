"use client";

import { Button } from "@/components/ui/Button";

export default function SendEmailButton() {
  const sendEmail = async () => {
    const res = await fetch('/api/send-alert-email');
    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <Button onClick={sendEmail} className="rounded-full">
      Send Low Stock Email
    </Button>
  );
}