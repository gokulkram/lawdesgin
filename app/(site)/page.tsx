import HomeView from "@/components/static-pages/HomeView";
import type { HomeText } from "@/content/static-text";
import { getContent } from "@/lib/content-store";
import { staticPageMeta } from "@/lib/site";

export const generateMetadata = () => staticPageMeta("/");

export default async function Home() {
  return <HomeView t={(await getContent()).staticText<HomeText>("/")} />;
}
