export function VRSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h3 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">Realidad Virtual Inmersiva</h3>
            <p className="text-pretty text-lg leading-relaxed text-gray-600">
              Sumérgete completamente en cada propiedad con experiencias VR de última generación. Compatible con Meta
              Quest, HTC Vive y PICO. Sesiones colaborativas en tiempo real donde múltiples usuarios pueden explorar
              simultáneamente.
            </p>
          </div>

          {/* Right Content - VR Image */}
          <div className="relative">
            <div className="overflow-hidden">
              <img src="/vr-color-palette.png" alt="VR Experience" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
