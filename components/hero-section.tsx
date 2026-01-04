import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-black py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="text-white text-center lg:text-left">
            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Haz que cada visita sea inolvidable
            </h1>
            <p className="mb-8 text-pretty text-lg text-gray-300 md:text-xl">
              Con realidad virtual e inteligencia artificial, tus clientes podrán recorrer, personalizar y elegir su
              próximo hogar sin moverse de donde estén.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-6 text-base font-semibold text-white hover:from-purple-700 hover:to-blue-600">
                Explorar ahora
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white bg-transparent px-8 py-6 text-base font-semibold text-white hover:bg-white hover:text-black"
              >
                Ver funciones
              </Button>
            </div>
          </div>

          {/* Right Content - VR Interface Mockup */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-4 shadow-2xl">
              {/* VR Tour Interface */}
              <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-200">
                <img
                  src="/vr-bedroom-interface.png"
                  alt="Virtual tour bedroom interface with color palette and catalog options"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
