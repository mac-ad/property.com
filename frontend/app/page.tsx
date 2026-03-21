import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
        Welcome to the Real Estate Listings Platform
      </h1>
      <p className="text-center text-muted-foreground max-w-lg mb-8">
        Browse properties for sale or rent easily. This platform offers different features for admins and regular users.
      </p>
      <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        <div className="bg-muted/50 rounded-lg p-4">
          <h2 className="font-bold text-primary text-lg mb-1">Admin View</h2>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li>
              <span className="font-medium">Full property access</span>, including <span className="italic">extra_notes</span> on detail pages.
            </li>
          </ul>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <h2 className="font-bold text-green-700 dark:text-green-400 text-lg mb-1">User View</h2>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li>
              View public property details.
            </li>
            <li>
              <span className="italic font-medium">extra_notes</span> are <span className="font-semibold text-destructive">not visible</span>.
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-sm">Browse available listings now</span>
        <Link href="/listings">
          <Button className="px-8 py-2 mt-1 text-base font-medium w-full md:w-auto">
            View Listings
          </Button>
        </Link>
      </div>
    </div>
  );
}
