import { Place, PlaceCategory, NfcTag, CustomerCRM, AutomationRule, Reward, Achievement, WhatsAppMessage } from '../types';

export const INITIAL_CATEGORIES: PlaceCategory[] = [
  { id: 'all', name: 'Todos', icon: 'Sparkles', description: 'Explora toda la Región de Valparaíso' },
  { id: 'comer', name: 'Comer', icon: 'UtensilsCrossed', description: 'Restaurantes, picadas marinas y gastronomía local' },
  { id: 'cafe', name: 'Café', icon: 'Coffee', description: 'Cafeterías de cerro, miradores y repostería' },
  { id: 'noche', name: 'Noche', icon: 'Wine', description: 'Bares tradicionales, cervecerías y coctelería' },
  { id: 'playas', name: 'Playas', icon: 'Waves', description: 'Borde costero, Reñaca, Concón y caletas' },
  { id: 'cultura', name: 'Cultura', icon: 'Landmark', description: 'Ascensores, museos, casas de Neruda y murales' },
  { id: 'naturaleza', name: 'Naturaleza', icon: 'Trees', description: 'Parque Nacional La Campana, Olmué y miradores' },
];

export const INITIAL_PLACES: Place[] = [
  {
    id: 'place-01',
    status: 'PARTNER',
    name: 'Café Turri',
    tagline: 'La vista más emblemática de Valparaíso',
    description: 'Ubicado en el icónico Cerro Concepción, ofrece una vista deslumbrante a la bahía de Valparaíso con café de especialidad, pastelería artesanal y platos marinos gourmet.',
    category: 'cafe',
    categories: ['cafe', 'comer', 'cultura'],
    experienceTags: ['Café con vista', 'Experiencia romántica', 'Patrimonio cerro'],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 342,
    verifiedVisits: 1280,
    priceLevel: '$$$',
    location: {
      address: 'Paseo Gervasoni 161, Cerro Concepción',
      city: 'Valparaíso',
      district: 'Cerro Concepción',
      latitude: -33.0425,
      longitude: -71.6256,
      zone: 'Cerros Porteños'
    },
    openingHours: 'Lun - Dom: 09:00 - 22:00',
    phone: '+56 32 225 2091',
    nfcActive: true,
    nfcTagId: 'nfc-turri-01',
    isFeatured: true,
    currentOffer: 'Café gratis en tu 3ª visita verificada',
    menu: [
      { id: 'm1', name: 'Capuchino Turri de Vainilla', description: 'Espreso doble con leche al vapor y toque artesanal de vainilla natural.', price: 3800, category: 'Cafetería', imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80', available: true },
      { id: 'm2', name: 'Tarta de Limón & Merengue Porteño', description: 'Receta familiar con limones de la zona y merengue tostado.', price: 4200, category: 'Postres', imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80', available: true },
      { id: 'm3', name: 'Toast Avocado & Salmón Ahumado', description: 'Pan de masa madre, palta de Peumo, salmón y brotes.', price: 7900, category: 'Brunches', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  },
  {
    id: 'place-02',
    status: 'PARTNER',
    name: 'Cervecería Altamira',
    tagline: 'La cuna de la cerveza artesanal porteña',
    description: 'A los pies del Ascensor Reina Victoria, rinde homenaje al cervecero irlandés Andrew Blest. Cervezas recién tiradas, jazz en vivo y excelente ambiente.',
    category: 'noche',
    categories: ['noche', 'comer'],
    experienceTags: ['Para ir con amigos', 'Cerveza artesanal', 'Música en vivo'],
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538488881038-e252a119ece7?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 512,
    verifiedVisits: 2150,
    priceLevel: '$$',
    location: {
      address: 'El Elías 126, Pie de Ascensor Reina Victoria',
      city: 'Valparaíso',
      district: 'Cerro Alegre',
      latitude: -33.0441,
      longitude: -71.6248,
      zone: 'Cerros Porteños'
    },
    openingHours: 'Mar - Dom: 13:00 - 01:00',
    phone: '+56 32 319 3680',
    nfcActive: true,
    nfcTagId: 'nfc-altamira-01',
    isFeatured: true,
    currentOffer: 'Happy Hour de Pintas para clientes con Check-In NFC',
    menu: [
      { id: 'm4', name: 'Schop Altamira Amber Ale 500ml', description: 'Cerveza de notas acarameladas y amargor equilibrado.', price: 4500, category: 'Cervezas', imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80', available: true },
      { id: 'm5', name: 'Tabla Mestiza Valparaíso', description: 'Empanaditas de mariscos, quesos artesanales de Olmué y mechada.', price: 14900, category: 'Para Compartir', imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  },
  {
    id: 'place-03',
    status: 'RECOMMENDED',
    name: 'Mar de Amores - Caleta Higuerillas',
    tagline: 'Mariscos frescos y atardeceres de Concón',
    description: 'Especialistas en machas a la parmesana, reineta a la plancha y caldillo de congrio recién desembarcado por los pescadores de la caleta.',
    category: 'comer',
    categories: ['comer', 'playas'],
    experienceTags: ['Comida marina', 'Vista al mar', 'Atardecer único'],
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 418,
    verifiedVisits: 1890,
    priceLevel: '$$$',
    location: {
      address: 'Av. Borgoño 21100, Caleta Higuerillas',
      city: 'Concón',
      district: 'Higuerillas',
      latitude: -32.9150,
      longitude: -71.5230,
      zone: 'Borde Costero Concón'
    },
    openingHours: 'Mié - Dom: 12:30 - 20:30',
    phone: '+56 32 281 1234',
    nfcActive: true,
    nfcTagId: 'nfc-mardeamores-01',
    isFeatured: true,
    currentOffer: 'Empanada de camarón queso de cortesía al registrar visita',
    menu: [
      { id: 'm6', name: 'Machas a la Parmesana (12 un.)', description: 'Machas vivas horneadas con vino blanco mantecoso y queso de fundo.', price: 13500, category: 'Entradas', imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80', available: true },
      { id: 'm7', name: 'Reineta Cancato a la Parrilla', description: 'Filete de reineta relleno con tomate, queso mantecoso y orégano.', price: 11900, category: 'Fondos', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  },
  {
    id: 'place-04',
    status: 'DISCOVERED',
    name: 'Empanadas Delicias de la Costa',
    tagline: 'Las mejores empanadas fritas de Reñaca y Viña',
    description: 'Más de 35 variedades de empanadas fritas de masa crujiente. Desde la clásica pino hasta queso marisco y jaiba cheddar.',
    category: 'comer',
    categories: ['comer', 'playas'],
    experienceTags: ['Paso rápido', 'Experiencia económica', 'Playa Reñaca'],
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.6,
    reviewCount: 289,
    verifiedVisits: 980,
    priceLevel: '$',
    location: {
      address: 'Av. Borgoño 14500, Sector 4',
      city: 'Viña del Mar',
      district: 'Reñaca',
      latitude: -32.9680,
      longitude: -71.5540,
      zone: 'Borde Costero Viña'
    },
    openingHours: 'Lun - Dom: 10:30 - 21:00',
    phone: '+56 32 297 8811',
    nfcActive: true,
    nfcTagId: 'nfc-empanadas-01',
    currentOffer: 'Bebida gratis por la compra de 2 empanadas de mariscos',
    menu: [
      { id: 'm8', name: 'Empanada Camarón Queso', description: 'Masa crocante repleta de camarones ecuatorianos y queso fundido.', price: 3900, category: 'Empanadas', imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80', available: true },
      { id: 'm9', name: 'Empanada Jaiba Mantecoso', description: 'Carne de jaiba limpia con suave queso mantecoso de Chiloé.', price: 4500, category: 'Empanadas', imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  },
  {
    id: 'place-05',
    status: 'RECOMMENDED',
    name: 'Paseo & Ascensor 21 de Mayo',
    tagline: 'Patrimonio y artesanía sobre la bahía',
    description: 'Uno de los paseos miradores más tradicionales de Valparaíso en Cerro Artillería. Mercado de artesanía en madera, cuero y vista panorámica a los buques.',
    category: 'cultura',
    categories: ['cultura', 'naturaleza'],
    experienceTags: ['Lugar secreto', 'Patrimonio cerro', 'Vista al mar'],
    imageUrl: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 620,
    verifiedVisits: 3100,
    priceLevel: '$',
    location: {
      address: 'Paseo 21 de Mayo s/n, Cerro Artillería',
      city: 'Valparaíso',
      district: 'Cerro Artillería',
      latitude: -33.0330,
      longitude: -71.6310,
      zone: 'Cerros Porteños'
    },
    openingHours: 'Lun - Dom: 08:00 - 20:00',
    phone: '+56 32 293 0000',
    nfcActive: false,
    nfcTagId: '',
    isFeatured: false,
    menu: []
  },
  {
    id: 'place-06',
    status: 'DISCOVERED',
    name: 'Parque Nacional La Campana & El Patagual',
    tagline: 'Reserva de la Biósfera y tradición campesina',
    description: 'Ubicado en Olmué, famoso por sus senderos de palmas chilenas ancestrales y la calidez de su gastronomía criolla en el valle.',
    category: 'naturaleza',
    categories: ['naturaleza', 'comer'],
    experienceTags: ['Naturaleza pura', 'Familiar', 'Experiencia económica'],
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 195,
    verifiedVisits: 840,
    priceLevel: '$$',
    location: {
      address: 'Sector Granizo s/n',
      city: 'Olmué',
      district: 'Granizo',
      latitude: -32.9900,
      longitude: -71.1200,
      zone: 'Valle del Marga Marga'
    },
    openingHours: 'Mar - Dom: 08:30 - 17:30',
    phone: '+56 33 244 1122',
    nfcActive: true,
    nfcTagId: 'nfc-olmue-01',
    menu: [
      { id: 'm10', name: 'Pastel de Choclo Criollo', description: 'Horneado en greda con pino de pavo, huevo duro, aceituna y pasas.', price: 8900, category: 'Tradición', imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  },
  {
    id: 'place-07',
    status: 'RECOMMENDED',
    name: 'El Cardenal Café & Mirador',
    tagline: 'Café de especialidad con terraza secreta hacia la bahía',
    description: 'En lo alto de Cerro Alegre, un rincón rodeado de murales y enredaderas con café filtrado de origen y pastelería de autor.',
    category: 'cafe',
    categories: ['cafe', 'cultura'],
    experienceTags: ['Café con vista', 'Lugar secreto', 'Experiencia romántica'],
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 184,
    verifiedVisits: 620,
    priceLevel: '$$',
    location: {
      address: 'Paseo Dimalow 260',
      city: 'Valparaíso',
      district: 'Cerro Alegre',
      latitude: -33.0435,
      longitude: -71.6260,
      zone: 'Cerros Porteños'
    },
    openingHours: 'Mié - Dom: 10:00 - 20:00',
    phone: '+56 32 291 4455',
    nfcActive: false,
    nfcTagId: '',
    isFeatured: true,
    menu: [
      { id: 'm11', name: 'Flat White Cerro Alegre', description: 'Espreso doble de origen colombiano con leche texturizada sedosa.', price: 3400, category: 'Cafetería', imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  },
  {
    id: 'place-08',
    status: 'DISCOVERED',
    name: 'Bar La Playa',
    tagline: 'El bar más antiguo en funcionamiento de Valparaíso',
    description: 'Fundado en 1908 en el histórico Barrio Puerto. Barra de madera tallada, terremotos tradicionales y música en vivo.',
    category: 'noche',
    categories: ['noche', 'cultura'],
    experienceTags: ['Bares tradicionales', 'Patrimonio cerro', 'Música en vivo'],
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 310,
    verifiedVisits: 1450,
    priceLevel: '$',
    location: {
      address: 'Serrano 568',
      city: 'Valparaíso',
      district: 'Barrio Puerto',
      latitude: -33.0360,
      longitude: -71.6290,
      zone: 'Barrio Puerto Historic'
    },
    openingHours: 'Lun - Sáb: 17:00 - 02:00',
    phone: '+56 32 225 9988',
    nfcActive: false,
    nfcTagId: '',
    menu: [
      { id: 'm12', name: 'Terremoto Porteño Tradicional 1L', description: 'Vino pipeño, helado de piña artesanal y granadina.', price: 4900, category: 'Coctelería', imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  },
  {
    id: 'place-09',
    status: 'PARTNER',
    name: 'Emporio La Rosa - Castillo Wulff',
    tagline: 'Heladería artesanal junto al mar de Viña del Mar',
    description: 'Ubicado en la avenida Marina frente al emblemático Castillo Wulff. Famoso por sus helados de miel de ulmo, rosa y chocolate amargo.',
    category: 'cafe',
    categories: ['cafe', 'playas'],
    experienceTags: ['Heladería artesanal', 'Vista al mar', 'Familiar'],
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 520,
    verifiedVisits: 2890,
    priceLevel: '$$',
    location: {
      address: 'Av. Marina 50',
      city: 'Viña del Mar',
      district: 'Castillo Wulff',
      latitude: -33.0230,
      longitude: -71.5580,
      zone: 'Borde Costero Viña'
    },
    openingHours: 'Lun - Dom: 11:00 - 21:00',
    phone: '+56 32 268 4400',
    nfcActive: true,
    nfcTagId: 'nfc-emporio-01',
    isFeatured: true,
    currentOffer: 'Cono doble al precio de simple en tu 1ª visita NFC',
    menu: [
      { id: 'm13', name: 'Helado Barquillón 2 Sabores', description: 'Rosa natural y Chocolate Amargo 70%.', price: 3900, category: 'Helados', imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  },
  {
    id: 'place-10',
    status: 'RECOMMENDED',
    name: 'La Caperucita y el Lobo',
    tagline: 'Gastronomía de autor en una casona vintage de cerro',
    description: 'En Cerro Florida, cerca de La Sebastiana. Cocina íntima, terraza romántica y pescados del día preparados con técnicas contemporáneas.',
    category: 'comer',
    categories: ['comer', 'cultura'],
    experienceTags: ['Experiencia romántica', 'Gastronomía de autor', 'Lugar secreto'],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 260,
    verifiedVisits: 940,
    priceLevel: '$$$$',
    location: {
      address: 'Ferrari 471',
      city: 'Valparaíso',
      district: 'Cerro Florida',
      latitude: -33.0470,
      longitude: -71.6180,
      zone: 'Cerros Porteños'
    },
    openingHours: 'Mar - Sáb: 19:30 - 23:30',
    phone: '+56 32 320 0212',
    nfcActive: false,
    nfcTagId: '',
    menu: [
      { id: 'm14', name: 'Atún Sellado en Sésamo & Risotto de Mariscos', description: 'Atún fresco de bahía sobre cremoso risotto de mariscos y salicornia.', price: 16900, category: 'Platos de Autor', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  },
  {
    id: 'place-11',
    status: 'PARTNER',
    name: 'Restobar El Chiringuito Concón',
    tagline: 'Pescados y coctelería tropical sobre las rocas de Concón',
    description: 'Famoso por su terraza volada sobre el océano. Pisco sour con receta propia, ostras vivas y reineta a la mantequilla de alcaparras.',
    category: 'comer',
    categories: ['comer', 'playas', 'noche'],
    experienceTags: ['Comida marina', 'Vista al mar', 'Para ir con amigos'],
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 480,
    verifiedVisits: 2310,
    priceLevel: '$$$',
    location: {
      address: 'Av. Borgoño 24000',
      city: 'Concón',
      district: 'Concón Costero',
      latitude: -32.9080,
      longitude: -71.5200,
      zone: 'Borde Costero Concón'
    },
    openingHours: 'Lun - Dom: 12:00 - 00:00',
    phone: '+56 32 281 9900',
    nfcActive: true,
    nfcTagId: 'nfc-chiringuito-01',
    isFeatured: true,
    currentOffer: 'Pisco Sour de bienvenida gratis en tu 1ª visita NFC',
    menu: [
      { id: 'm15', name: 'Ceviche Mixto El Chiringuito', description: 'Corvina, camarones y machas en leche de tigre de ají amarillo.', price: 12900, category: 'Entradas', imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  },
  {
    id: 'place-12',
    status: 'DISCOVERED',
    name: 'Café de la Poesía',
    tagline: 'Libros, café y ambiente literario en Cerro Alegre',
    description: 'Espacio cultural independiente repleto de estantes de libros antiguos, música jazz suave y tostados artesanales de café de altura.',
    category: 'cafe',
    categories: ['cafe', 'cultura'],
    experienceTags: ['Café de especialidad', 'Cultura', 'Ambiente relajado'],
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 142,
    verifiedVisits: 510,
    priceLevel: '$',
    location: {
      address: 'Almirante Montt 420',
      city: 'Valparaíso',
      district: 'Cerro Alegre',
      latitude: -33.0440,
      longitude: -71.6250,
      zone: 'Cerros Porteños'
    },
    openingHours: 'Mar - Dom: 11:00 - 19:30',
    phone: '+56 32 291 7722',
    nfcActive: false,
    nfcTagId: '',
    menu: [
      { id: 'm16', name: 'Espreso Nerudiano & Muffin de Arándanos', description: 'Café cargado estilo italiano servido con muffin recién horneado.', price: 3600, category: 'Cafetería', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80', available: true }
    ]
  }
];

export const INITIAL_NFC_TAGS: NfcTag[] = [
  {
    id: 'nfc-turri-01',
    placeId: 'place-01',
    placeName: 'Café Turri',
    locationLabel: 'Entrada Principal (Paseo Gervasoni)',
    tokenSecret: 'TURRI-NFC-8823-VALPO',
    status: 'active',
    dailyScansLimit: 200,
    totalScans: 412,
    lastScannedAt: 'Hace 12 min'
  },
  {
    id: 'nfc-turri-02',
    placeId: 'place-01',
    placeName: 'Café Turri',
    locationLabel: 'Mesa Mirador Terraza 2',
    tokenSecret: 'TURRI-MESA2-VALPO',
    status: 'active',
    dailyScansLimit: 100,
    totalScans: 198,
    lastScannedAt: 'Hace 45 min'
  },
  {
    id: 'nfc-altamira-01',
    placeId: 'place-02',
    placeName: 'Cervecería Altamira',
    locationLabel: 'Barra Principal de Pintas',
    tokenSecret: 'ALTAMIRA-BARRA-9901',
    status: 'active',
    dailyScansLimit: 300,
    totalScans: 856,
    lastScannedAt: 'Hace 5 min'
  },
  {
    id: 'nfc-mardeamores-01',
    placeId: 'place-03',
    placeName: 'Mar de Amores - Caleta Higuerillas',
    locationLabel: 'Acceso Comedor Caleta',
    tokenSecret: 'MARAMORES-CONCON-2026',
    status: 'active',
    dailyScansLimit: 150,
    totalScans: 310,
    lastScannedAt: 'Hace 1 hora'
  }
];

export const INITIAL_CUSTOMERS: CustomerCRM[] = [
  {
    id: 'cust-101',
    userId: 'user-01',
    name: 'Valentina Silva',
    phone: '+56987654321',
    email: 'valentina.silva@email.cl',
    birthday: '1995-10-14',
    firstVisitDate: '2026-06-12',
    lastVisitDate: '2026-09-28',
    totalVisits: 8,
    totalSpent: 142000,
    averageTicket: 17750,
    loyaltyTier: 'Oro',
    consent: {
      marketingWhatsApp: true,
      birthdayOffers: true,
      postVisitSurveys: true,
      reactivationMessages: true,
      updatedAt: '2026-06-12'
    },
    notes: 'Cliente habitual de fin de semana. Prefiere terraza exterior y vino blanco.',
    tags: ['Amante del Café', 'Frecuente Terraza', 'Residente Viña']
  },
  {
    id: 'cust-102',
    userId: 'user-02',
    name: 'Matías Oyarzún',
    phone: '+56911223344',
    email: 'matias.o@email.cl',
    birthday: '1990-04-20',
    firstVisitDate: '2026-08-01',
    lastVisitDate: '2026-08-25',
    totalVisits: 3,
    totalSpent: 48500,
    averageTicket: 16166,
    loyaltyTier: 'Plata',
    consent: {
      marketingWhatsApp: true,
      birthdayOffers: true,
      postVisitSurveys: true,
      reactivationMessages: true,
      updatedAt: '2026-08-01'
    },
    notes: 'Turista frecuente de Santiago. Le interesan catas de cervezas.',
    tags: ['Turista Nacional', 'Fan Cerveza']
  },
  {
    id: 'cust-103',
    userId: 'user-03',
    name: 'Camila Morales',
    phone: '+56955443322',
    email: 'camila.m@gmail.com',
    birthday: '1998-11-02',
    firstVisitDate: '2026-09-05',
    lastVisitDate: '2026-09-29',
    totalVisits: 11,
    totalSpent: 210000,
    averageTicket: 19090,
    loyaltyTier: 'VIP Porteño',
    consent: {
      marketingWhatsApp: true,
      birthdayOffers: true,
      postVisitSurveys: true,
      reactivationMessages: true,
      updatedAt: '2026-09-05'
    },
    notes: 'Influencer regional. Muy activa registrando check-ins NFC en cerros.',
    tags: ['Pasaporte Completo', 'VIP', 'Residente Valpo']
  }
];

export const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule-01',
    code: 'RULE_01',
    title: 'Bienvenida Primera Visita',
    description: 'Envía un saludo cálido por WhatsApp inmediatamente después del primer Check-in NFC en el establecimiento.',
    triggerEvent: 'first_visit == true',
    condition: 'consent.marketingWhatsApp == true',
    actionMessageTemplate: '¡Hola {{nombre}}! 🌊 Bienvenido/a a {{lugar}}. Gracias por registrar tu primera visita con NFC. Hoy acumulaste {{puntos}} puntos. ¡Disfruta la experiencia!',
    enabled: true,
    executionsCount: 142
  },
  {
    id: 'rule-02',
    code: 'RULE_02',
    title: 'Encuesta Post-Consumo & Review',
    description: 'Solicita feedback 2 horas después de pagar un pedido. Si califica 4-5★ invita a Google; si 1-3★ abre chat privado.',
    triggerEvent: 'order.status == PAID',
    condition: 'consent.postVisitSurveys == true',
    actionMessageTemplate: 'Hola {{nombre}}, ¿cómo estuvo tu visita hoy en {{lugar}}? ☕ Valora tu experiencia aquí: {{link_encuesta}}',
    enabled: true,
    executionsCount: 389
  },
  {
    id: 'rule-03',
    code: 'RULE_03',
    title: 'Regalo de Cumpleaños (7 Días Antes)',
    description: 'Envía un cupón de postre o copa de espumante gratis 7 días antes del cumpleaños registrado.',
    triggerEvent: 'birthday == today + 7 days',
    condition: 'consent.birthdayOffers == true',
    actionMessageTemplate: '¡Se acerca tu cumpleaños {{nombre}}! 🎂 En {{lugar}} queremos celebrarlo contigo. Tienes un postre artesanal de regalo mostrando este mensaje.',
    enabled: true,
    executionsCount: 45
  },
  {
    id: 'rule-04',
    code: 'RULE_04',
    title: 'Reactivación por Inactividad (30 días)',
    description: 'Incentiva a volver a clientes que no visitan el local en más de 30 días con una promoción exclusiva.',
    triggerEvent: 'days_since_last_visit >= 30',
    condition: 'consent.reactivationMessages == true',
    actionMessageTemplate: '¡Te echamos de menos {{nombre}}! ⚓ Hace un mes no nos visitas en {{lugar}}. Te dejamos 20% de descuento en tu próxima visita con check-in NFC.',
    enabled: true,
    executionsCount: 88
  },
  {
    id: 'rule-05',
    code: 'RULE_05',
    title: 'Recompensa Cliente Fiel (10 Visitas)',
    description: 'Al alcanzar la visita número 10 verificada, premia al usuario con nivel VIP y consumo gratis.',
    triggerEvent: 'visit_count == 10',
    condition: 'true',
    actionMessageTemplate: '🏆 ¡Felicidades {{nombre}}! Has alcanzado 10 visitas en {{lugar}}. Te has convertido en Cliente VIP Porteño. Tienes una tabla para compartir gratis.',
    enabled: true,
    executionsCount: 23
  },
  {
    id: 'rule-06',
    code: 'RULE_06',
    title: 'Notificación de Nuevas Ofertas',
    description: 'Avisa a clientes frecuentes de una categoría cuando el local lanza un nuevo plato o evento.',
    triggerEvent: 'new_offer_published == true',
    condition: 'segment == frecuentes',
    actionMessageTemplate: '✨ ¡Novedad en {{lugar}}! {{nombre}}, lanzamos nuestra nueva carta de primavera. Ven a probarla este fin de semana.',
    enabled: false,
    executionsCount: 12
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-01',
    title: 'Explorador de los Cerros',
    category: 'Cafés',
    description: 'Completa 3 check-ins NFC en cafeterías de Cerro Alegre o Concepción.',
    icon: 'Coffee',
    requiredVisits: 3,
    currentProgress: 2,
    unlocked: false,
    badgeUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'ach-02',
    title: 'Guardián del Borde Costero',
    category: 'Costa',
    description: 'Registra visitas en Concón Higuerillas, Reñaca y Viña del Mar.',
    icon: 'Waves',
    requiredVisits: 3,
    currentProgress: 3,
    unlocked: true,
    badgeUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'ach-03',
    title: 'Catador de Mariscos & Picadas',
    category: 'Patrimonio',
    description: 'Prueba gastronomía marina verificada en 2 locales costeros.',
    icon: 'Fish',
    requiredVisits: 2,
    currentProgress: 2,
    unlocked: true,
    badgeUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew-01',
    placeId: 'place-01',
    placeName: 'Café Turri',
    title: 'Café de Especialidad Gratis',
    description: 'Canjeable en tu próxima visita con Check-In NFC.',
    pointsCost: 300,
    code: 'TURRI-FREE-CAFE',
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80',
    expiresAt: '2026-12-31'
  },
  {
    id: 'rew-02',
    placeId: 'place-02',
    placeName: 'Cervecería Altamira',
    title: 'Pinta Amber Ale de Regalo',
    description: 'Por tu 5ª visita en el local.',
    pointsCost: 450,
    code: 'ALTAMIRA-PINTA',
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80',
    expiresAt: '2026-11-30'
  }
];
