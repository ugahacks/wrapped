import { WrappedApp } from "@/components/wrapped/wrapped-app";
import { wrappedData } from "@/lib/wrapped-data";

export default function Home() {
  return <WrappedApp data={wrappedData} />;
}
