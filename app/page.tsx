import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BusinessSection } from "@/components/business-section"
import { VRSection } from "@/components/vr-section"
import { AISection } from "@/components/ai-section"
import { StagingSection } from "@/components/staging-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <BusinessSection />
      <VRSection />
      <AISection />
      <StagingSection />
      <Footer />
    </main>
  )
}
