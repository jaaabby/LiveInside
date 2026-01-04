"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image src="/liveinside-logo.png" alt="LiveInside" width={180} height={80} className="h-12 w-auto md:h-14" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="#inicio" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Inicio
          </Link>
          <Link href="#servicios" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Servicios
          </Link>
          <Link href="#planes" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Planes
          </Link>
          <Link href="#clientes" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Clientes
          </Link>
          <Link href="#contacto" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Contacto
          </Link>
        </nav>

        <Button className="hidden bg-gradient-to-r from-purple-600 to-blue-500 px-8 text-white hover:from-purple-700 hover:to-blue-600 lg:block">
          Ver Demo
        </Button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-gray-700 hover:text-gray-900"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <nav className="container mx-auto flex flex-col px-6 py-4">
            <Link
              href="#inicio"
              className="py-3 text-center text-base font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="#servicios"
              className="py-3 text-center text-base font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link
              href="#planes"
              className="py-3 text-center text-base font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Planes
            </Link>
            <Link
              href="#clientes"
              className="py-3 text-center text-base font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Clientes
            </Link>
            <Link
              href="#contacto"
              className="py-3 text-center text-base font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <Button className="mt-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600">
              Ver Demo
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
