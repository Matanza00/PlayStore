import type { Metadata } from "next";
import { CheckFlow } from "@/components/CheckFlow";

export const metadata: Metadata = { title: "Check my app | FirstPass" };

export default function CheckPage() {
  return <CheckFlow />;
}
