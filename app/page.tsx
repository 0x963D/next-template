import { type Metadata } from "next"

import Section from "@/components/common/section"
import HomeView from "@/components/views/home"

export const metadata: Metadata = {
  title: "New Yolk - Home"
}

const HomePage = (): React.JSX.Element => {
  return (
    <Section>
      <HomeView />
    </Section>
  )
}

export default HomePage
