import type { Metadata } from "next";
import { Studio } from "@/components/Studio";

export const metadata: Metadata = { title: "Store page studio | FirstPass" };

export default function StudioPage() {
  return <Studio />;
}
