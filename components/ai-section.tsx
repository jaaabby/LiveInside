import Image from "next/image"

export function AISection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content - Image */}
          <div className="relative">
            <div className="overflow-hidden">
              <Image
                src="/ai-mobile-ar.png"
                alt="Personas usando la interfaz de IA conversacional en móviles"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Content - Text */}
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Inteligencia Artificial Conversacional</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Asistente AI avanzado que responde preguntas por voz y texto, analiza preferencias y ofrece
              recomendaciones personalizadas. Tecnología OpenAI integrada para conversaciones naturales y contextuales.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
