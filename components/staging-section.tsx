import Image from "next/image"

export function StagingSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content - Text */}
          <div className="space-y-6 text-center md:text-left order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Staging Digital Inteligente</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Transforma espacios vacíos en hogares amueblados con productos reales de retailers. Personalización
              instantánea, cotización automática y carrito de compras integrado. Visualiza tu futuro hogar antes de
              comprarlo.
            </p>
          </div>

          {/* Right Content - Image */}
          <div className="relative order-1 md:order-2">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/staging-living-room.png"
                alt="Sala de estar moderna con staging digital y catálogo de productos"
                width={700}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
