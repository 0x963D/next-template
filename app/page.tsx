import { type Metadata } from "next"

import HomeView from "@/components/views/home"

export const metadata: Metadata = {
  title: "New Yolk - Home"
}

const HomePage = (): React.JSX.Element => {
  return <HomeView />
}

export default HomePage
