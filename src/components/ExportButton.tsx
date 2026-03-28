"use client";

import { Button } from "@/components/ui/Button";

export default function ExportButton() {
  const handleExport = async () => {
    try {
      const res = await fetch('/api/export?time=' + new Date().getTime());
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory_report.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  return (
    <Button variant="outline" className="rounded-full" onClick={handleExport}>
      Export Report
    </Button>
  );
}