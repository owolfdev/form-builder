// src/app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-6 space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-bold">🧱 Form Builder Demo</h1>
        <p className="text-muted-foreground text-lg">
          Dynamically generate forms using a schema + config. Built with
          <strong> Zod</strong>, <strong>React Hook Form</strong>, and
          <strong> shadcn/ui</strong>. Easily extensible and type-safe.
        </p>
        <div className="space-y-4">
          <Link href="/person" className="">
            <Button
              variant="outline"
              className="cursor-pointer w-full justify-start active:scale-95 transition-all duration-200 active:bg-blue-100"
            >
              Person Entity →
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 text-sm text-muted-foreground max-w-prose mx-auto">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Define your form structure in a config file
            <code className="ml-1 bg-muted px-1 rounded text-xs">
              personFields
            </code>
          </li>
          <li>
            Use{" "}
            <code className="bg-muted px-1 rounded text-xs">DynamicForm</code>{" "}
            to render fields dynamically
          </li>
          <li>Zod schema handles validation and type inference</li>
          <li>
            Easily swap field components (input, textarea, checkbox, etc.)
          </li>
        </ul>
      </div>
    </main>
  );
}
