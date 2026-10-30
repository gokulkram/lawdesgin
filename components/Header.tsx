import HeaderClient from "@/components/HeaderClient";
import { getContent } from "@/lib/content-store";

// Site header: the interactive part is HeaderClient; this passes it the firm's phone and email.
export default async function Header() {
  const { firm } = await getContent();
  return <HeaderClient phone={firm.phone} phoneHref={firm.phoneHref} tollFree={firm.tollFree ?? ""} tollFreeHref={firm.tollFreeHref} email={firm.email} />;
}
