'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      discover_deals: 'Discover Deals',
      search_placeholder: 'Search deals, brands, or categories...',
      all_categories: 'All Categories',
      buy_now: 'Buy Now',
      verified_merchant: 'Verified Merchant',
      saved_deals: 'Saved Deals',
      language: 'Language',
      country: 'Country',
      select_country: 'Select Country',
      global: 'Global',
      physical_product: 'Physical Product',
      local_service: 'Local Service',
      digital_software: 'Digital/Software',
      checkout: 'Checkout',
      order_summary: 'Order Summary',
      quantity: 'Quantity',
      demand_box: 'demandBOX Insights',
      stock_recommendation: 'Stock & Fulfillment Advice',
      payout_split: 'Payout Split',
      reviews: 'Reviews',
      rating: 'Rating',
      description: 'Product Description'
    }
  },
  es: {
    translation: {
      discover_deals: 'Descubrir Ofertas',
      search_placeholder: 'Buscar ofertas, marcas o categorías...',
      all_categories: 'Todas las categorías',
      buy_now: 'Comprar ahora',
      verified_merchant: 'Vendedor verificado',
      saved_deals: 'Ofertas guardadas',
      language: 'Idioma',
      country: 'País',
      select_country: 'Seleccionar país',
      global: 'Global',
      physical_product: 'Producto físico',
      local_service: 'Servicio local',
      digital_software: 'Digital/Software',
      checkout: 'Pagar',
      order_summary: 'Resumen del pedido',
      quantity: 'Cantidad',
      demand_box: 'Insights de demandBOX',
      stock_recommendation: 'Consejo de stock y logística',
      payout_split: 'División del pago',
      reviews: 'Reseñas',
      rating: 'Calificación',
      description: 'Descripción del producto'
    }
  },
  fr: {
    translation: {
      discover_deals: 'Découvrir les Offres',
      search_placeholder: 'Rechercher des offres, des marques ou des catégories...',
      all_categories: 'Toutes les catégories',
      buy_now: 'Acheter maintenant',
      verified_merchant: 'Marchand vérifié',
      saved_deals: 'Offres enregistrées',
      language: 'Langue',
      country: 'Pays',
      select_country: 'Sélectionner le pays',
      global: 'Global',
      physical_product: 'Produit physique',
      local_service: 'Service local',
      digital_software: 'Numérique/Logiciel',
      checkout: 'Passer la commande',
      order_summary: 'Résumé de la commande',
      quantity: 'Quantité',
      demand_box: 'Analyses de demandBOX',
      stock_recommendation: 'Conseil de stock et logistique',
      payout_split: 'Division du paiement',
      reviews: 'Avis clients',
      rating: 'Évaluation',
      description: 'Description du produit'
    }
  }
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en', // Default language
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false // react already safes from xss
      }
    })
}

export default i18n
