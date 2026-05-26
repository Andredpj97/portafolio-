import { useEffect } from 'react'

/**
 * Hook personalizado para gestionar meta tags dinámicos
 * Actualiza el title, description, Open Graph, Twitter Cards, etc.
 */
const usePageMetadata = (config = {}) => {
  useEffect(() => {
    const {
      title = 'Mi Farmacia - Tienda Online de Medicamentos',
      description = 'Compra medicamentos, suplementos y productos de cuidado personal en línea. Entrega rápida y segura.',
      ogTitle,
      ogDescription,
      ogImage = 'https://mifarmacia.com/logo%20minimalista%20farmacia.png',
      ogType = 'website',
      keywords = 'medicamentos, farmacia, suplementos, cuidado personal, comprar online',
      robots = 'index, follow',
    } = config

    // Actualizar title
    document.title = title

    // Función auxiliar para actualizar/crear meta tags
    const setMetaTag = (name, content, isProperty = false) => {
      if (!content) return

      const attr = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attr}="${name}"]`)

      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, name)
        document.head.appendChild(element)
      }

      element.setAttribute('content', content)
    }

    // Meta tags básicos
    setMetaTag('description', description)
    setMetaTag('keywords', keywords)
    setMetaTag('robots', robots)

    // Open Graph (para redes sociales)
    setMetaTag('og:title', ogTitle || title, true)
    setMetaTag('og:description', ogDescription || description, true)
    setMetaTag('og:image', ogImage, true)
    setMetaTag('og:type', ogType, true)
    setMetaTag('og:site_name', 'Mi Farmacia', true)

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', ogTitle || title)
    setMetaTag('twitter:description', ogDescription || description)
    setMetaTag('twitter:image', ogImage)
  }, [config])
}

export default usePageMetadata