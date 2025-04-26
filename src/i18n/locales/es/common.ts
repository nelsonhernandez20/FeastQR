import { type Resources } from "../types";

const messages: Resources["common"] = {
  login: {
    title: "Iniciar sesión",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    submitButton: "Iniciar sesión",
    forgotPasswordButton: "¿Olvidaste tu contraseña?",
    registerButton: "Registrarse",
  },
  register: {
    title: "Registrarse",
    submitButton: "Registrarse",
    loginButton: "Iniciar sesión",
    checkYourEmailForConfirmation: "Revisa tu correo electrónico para confirmar tu cuenta",
  },
  resetPassword: {
    title: "Restablecer contraseña",
    emailLabel: "Correo electrónico",
    resetButton: "Restablecer",
    checkYourEmailToReset: "Revisa tu correo electrónico para restablecer tu contraseña",
    checkYourEmail: "Revisa tu correo electrónico",
    passwordChangedSuccesfully: "Contraseña cambiada exitosamente",
  },
  commonValidation: {
    required: "Este campo es obligatorio",
    email: "Este campo debe ser una dirección de correo electrónico válida",
    passwordConfirm: "Las contraseñas deben coincidir",
  },
  common: {
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    passwordConfirmLabel: "Confirmar contraseña",
    backButton: "Volver",
    noTranslation: "Sin traducción",
    passwordSpecialCharacterValidation:
      "La contraseña debe contener un carácter especial",
    passwordLengthValidation: "La contraseña debe tener al menos 8 caracteres",
    passwordUppercaseValidation: "La contraseña debe contener una letra mayúscula",
    passwordLowercaseValidation: "La contraseña debe contener una letra minúscula",
    passwordConfirmationValidation: "Las contraseñas deben coincidir",
    confirmYourEmail: "Confirma tu correo electrónico",
  },
  dashboard: {
    title: "Menú",
    headingText: "Crea y gestiona tus menús.",
    createMenu: "Crear Menú",
    noMenusCreated: "No hay menús creados",
    noMenusCreatedDescription: "Aún no has creado ningún menú",
  },
  dashboardSidenav: {
    menus: "Menú",
    billing: "Facturación",
    affiliates: "Afiliados",
    settings: "Configuración",
  },
  settingsPage: {
    headerDescription: "Gestiona la configuración de tu cuenta",
  },
  createMenu: {
    header: "Crear",
    title: "Crea tu Restaurante",
  },
  editMenu: {
    header: "Editar",
    title: "Edita tu Restaurante",
  },
  menuOperations: {
    editMenu: "Editar Menú",
    deleteMenu: "Eliminar Menú",
    areYouSureYouWantToDeleteThisMenu:
      "¿Estás seguro de que quieres eliminar este menú?",
    itCannotBeUndone: "Esta operación no se puede deshacer",
    cancel: "Cancelar",
    delete: "Eliminar",
    open: "Abrir",
    menuDeleted: "Menú Eliminado",
    menuDeletedDescription: "Tu menú ha sido eliminado exitosamente",
  },
  addCategoryButton: {
    addCategory: "Añadir Categoría",
    editCategory: "Editar Categoría",
    edit: "Editar",
  },
  addDishButton: {
    addDish: "Añadir Plato",
    editDish: "Editar Plato",
    edit: "Editar",
  },
  categoryForm: {
    save: "Guardar",
  },
  deleteDishButton: {
    delete: "Eliminar",
    deleteDish: "Eliminar Plato",
    areYouSureYouWantToDeleteThisDish:
      "¿Estás seguro de que quieres eliminar este plato?",
    cancel: "Cancelar",
  },
  deleteVariantButton: {
    delete: "Eliminar",
    deleteVariant: "Eliminar Variante",
    areYouSureYouWantToDeleteThisVariant:
      "¿Estás seguro de que quieres eliminar esta variante?",
    cancel: "Cancelar",
  },
  dishForm: {
    descriptionPlaceholder: "Pierogi ruskie con cebolla frita y tocino.",
    dishName: "Nombre del Plato",
    dishDescription: "Descripción del Plato",
    priceInUSD: "Precio (USD)",
    dishPhoto: "Foto del Plato",
    categoryLabel: "Categoría",
    macronutrientsButton: "Macronutrientes",
    calories: "Calorías",
    protein: "Proteína (g)",
    carbs: "Carbohidratos (g)",
    fat: "Grasas (g)",
    weight: "Peso (g)",
    macronutrientsDescription:
      "Estos campos son opcionales. ¡Los usuarios lo agradecerían!",
    tagsLabel: "Etiquetas",
  },
  menuForm: {
    save: "Guardar",
    menuLogoImage: "Logo del Restaurante",
    backgroundImage: "Imagen de Fondo del Restaurante",
    nameOfRestaurant: "Nombre del Restaurante",
    city: "Ciudad",
    streetAndNumber: "Calle y Número",
    phoneNumber: "Número de Teléfono",
  },
  userAccountNav: {
    dashboard: "Panel de Control",
    settings: "Configuración",
    billing: "Facturación",
    logout: "Cerrar Sesión",
  },
  navbar: {
    login: "Iniciar Sesión",
    home: "Inicio",
    dashboard: "Panel de Control",
  },
  menuCreator: {
    changeLanguage: "Cambiar Idioma",
    noDishes: "Sin Platos",
    noDishesDescription:
      "Aún no has creado ningún plato para esta categoría.",
    AddDishesToCategory: "Añadir Platos a la Categoría",
    noCategory: "Sin Categoría",
    dishesList: "Lista de Platos",
    categoryNotTranslated: "Categoría sin traducir",
    dishNotTranslated:
      "Plato sin traducir. Por favor, añade traducciones para todos los idiomas antes de publicar el menú.",
    variantsNotTranslated: "Una de las variantes no está traducida",
    variantNotTranslated: "Variante sin traducir",
    variants: "Variantes",
  },
  menuPdfGenerator: {
    menu: "MENÚ",
    generatePDFToPrint: "Generar PDF para Imprimir",
  },
  languageSelector: {
    saved: "Guardado",
    changesSaved: "Los cambios han sido guardados",
    save: "Guardar",
  },
  sidebar: {
    menu: "Menú",
    restaurant: "Restaurante",
    QRMenu: "Menú QR",
    edit: "Editar",
  },
  restaurantDashboard: {
    menuNotFound: "Menú No Encontrado",
    restaurant: "Restaurante",
    publish: "Publicar",
    unpublish: "Despublicar",
    manageMenu: "Gestionar Tarjeta de Menú",
    settings: "Configuración",
    availableLanguages: "Idiomas Disponibles del Menú:",
    yourQRCode: "Tu Código QR",
    menuPreview: "Vista Previa del Menú",

    menuPublished: "publicado",
    menuNotPublished: "no publicado",
    defaultLanguage: "Idioma predeterminado del menú",
    upgradeAccount: "Suscríbete a un plan para activar tu menú",
    menuUnpublishedNotification: "El menú ha sido despublicado",
    menuUnpublishedNotificationDescription:
      "Tu menú ha sido despublicado. Los usuarios no podrán ver tu menú.",
    menuPublishedNotification: "El menú ha sido publicado",
    menuPublishedNotificationDescription: "Tu menú ha sido publicado. Los usuarios podrán ver tu menú.", 
    restaurantInfo: "Información del restaurante",
    infoPlaceholder: "Escribe aquí la información del restaurante...",
    saveInfo: "Guardar información",
    saving: "Guardando...",
    infoSaved: "Información guardada",
    infoSavedDescription: "La información del restaurante se guardó correctamente.",
    errorSavingInfo: "Error al guardar",
    errorSavingInfoDescription: "Hubo un problema al guardar la información.",
  },
  languageToggle: {
    toggleLanguage: "Cambiar Idioma",
  },
  imageUploadInput: {
    restore: "Restaurar",
  },
  cropImageModal: {
    adjustImage: "Ajustar Imagen",
    close: "Cerrar",
  },
  colorModeToggle: {
    toggleTheme: "Cambiar Tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
  },
  landingPage: {
    backgroundAlt: "Imagen de fondo de la página de inicio",
    section1: {
      header: "Menú en Línea",
      headerHighlight: "Innovador",
      headerSuffix: "para tu Restaurante",
      description:
        "Crea y personaliza menús en línea y obtén tus propios códigos QR para brindar a tus clientes comodidad y pedidos rápidos",
      getStarted: "Comenzar",
      learnMore: "Saber Más",
      featuredOn: "Destacado en",
      productHunt: "Product Hunt",
      heroImageAlt: "Imagen principal",
      credit: "Hecho por",
    },
    section2: {
      showcaseAlt: "Imagen de muestra",
      featuresTitle: "Nuestras Potentes Características...",
      restaurantSuccess: "¡El Éxito de tu Restaurante!",
      discoverWhy:
        "Descubre por qué nuestro proyecto es la solución perfecta para tu restaurante",
      createCustomize: "Crea y personaliza",
      onlineMenus: "menús en línea",
      onlineMenusDescription:
        "Crea atractivos menús en línea en pocos pasos. Personalízalos según tu estilo y cambios estacionales del menú, sin necesidad de conocimientos técnicos.",
      generateQR: "Genera",
      qrCodes: "códigos QR",
      streamlinedOrders: "para pedidos eficientes",
      qrCodesDescription:
        "Genera códigos QR únicos que permiten a tus clientes escanear el menú y realizar pedidos sin contacto. Esto acelera el servicio y mejora la seguridad.",
      easyMenu: "Fácil gestión de menú",
      priceManagement: "y precios",
      menuPriceManagementDescription:
        "Controla tu menú y precios desde cualquier lugar. Actualízalos en tiempo real, respondiendo a cambios del mercado y estacionales.",
      manageOnlineOrders: "Gestiona pedidos en línea",
      manageOnlineOrdersDescription:
        "Al recopilar datos sobre pedidos y preferencias de los clientes, puedes personalizar menús, ofertas promocionales y servicios según sus necesidades, lo que lleva a la lealtad y ganancias.",
      enhanceCustomerService: "Mejora el servicio al cliente",
      enhanceCustomerServiceDescription:
        "Mejora la calidad del servicio con un menú en línea más fácil e intuitivo. Tus clientes obtienen acceso más rápido y personalizado a los platos.",
      showcaseMobileAlt: "Imagen de muestra móvil",
    },
    section3: {
      pricingTitle: "Planes de precios",
      planPro: "Plan Pro",
      oneMonthFree: "(1 mes de prueba gratis)",
      enterprise: "Empresarial",
      contactUs: "(Contáctanos)",
    },
    pricing: {
      toggle: {
        monthly: "Mensual",
        annually: "Anual",
      },
      standard: {
        name: "Estándar",
        description: "Innovar tu experiencia gastronómica con menús en línea.",
        feature1: "Crea menú para tu restaurante",
        feature2: "Muestra macronutrientes, alérgenos y más",
        feature3: "Traducciones de Menú",
      },
      enterprise: {
        name: "Empresarial",
        price: "Contáctanos",
        yearlyPrice: "Contáctanos",
        description:
          "Gestiona todos los restaurantes con nuestras potentes características e integraciones.",
        feature1: "Dominio personalizado",
        feature2: "Marca personalizada",
        feature3: "Soporte 24/7",
        extraBenefits: "Todo en el plan gratuito, más",
      },
    },
  },
  defaultLanguageSelector: {
    changeSavedTitle: "Guardado",
    changeSavedDescription: "Los cambios han sido guardados",
    save: "Guardar",
  },
  notFound: {
    title: "Página no encontrada",
    goBack: "Volver a la página principal",
  },
  errorPage: {
    title: "Ha Ocurrido un Error",
    description: "¡Nos disculpamos! Si el problema persiste, por favor contáctanos en",
    tryAgain: "Intentar de Nuevo",
    goBack: "Volver a la página principal",
  },
  tags: {
    keto: "Keto",
    vegan: "Vegano",
    vegetarian: "Vegetariano",
    glutenFree: "Sin Gluten",
    lactoseFree: "Sin Lactosa",
    lowCarb: "Bajo en Carbohidratos",
    highProtein: "Alto en Proteínas",
    lowFat: "Bajo en Grasas",
    highFiber: "Alto en Fibra",
    sugarFree: "Sin Azúcar",
    organic: "Orgánico",
  },
  dishVariantForm: {
    variantName: "Nombre de la Variante",
    variantDescription: "Descripción de la Variante",
    priceInUSD: "Precio (USD)",
    variantNamePlaceholder: "Combo",
    variantDescriptionPlaceholder: "El combo incluye papas fritas y una bebida.",
  },
  addDishVariantButton: {
    edit: "Editar",
    addVariant: "Añadir Variante",
    editVariant: "Editar Variante",
  },
  globalMetadata: {
    title: "Menú en Línea para tu Restaurante",
    description:
      "Crea y personaliza menús en línea y genera tus propios códigos QR para brindar a tus clientes comodidad y pedidos rápidos.",
    keywords:
      "menú, restaurante, en línea, QR, pedidos, comida, restaurantes, restaurante, gastronomía",
    category: "Restaurante",
    openGraph: {
      title: "Menú en Línea para tu Restaurante",
      description:
        "Crea y personaliza menús en línea y genera tus propios códigos QR para brindar a tus clientes comodidad y pedidos rápidos.",
      type: "website",
      url: "https://www.feastqr.com/",
      image: "https://www.feastqr.com/og-image.png",
      siteName: "FeastQR - crea tu menú en línea",
      locale: "es_ES",
    },
    twitter: {
      title: "Menú en Línea para tu Restaurante",
      description:
        "Crea y personaliza menús en línea y genera tus propios códigos QR para brindar a tus clientes comodidad y pedidos rápidos.",
    },
  },
  googleReviewGuideModal: {
    title: "¿Cómo añadir un enlace de reseña de Google a tu menú?",
    step: "Paso {step}",
    description:
      "Crea un enlace a la reseña de Google para tu restaurante y añádelo a tu menú. Esto permitirá a tus clientes dejar una reseña de tu restaurante en Google.",
    googleMaps: {
      name: "Google Maps",
      step1: "1. Encuentra tu restaurante en Google Maps",
      step2: "2. Haz clic en 'Escribir una reseña'",
      step3:
        "3. Copia el enlace de la barra de direcciones y pégalo en el campo 'Enlace de Reseña de Google' en la pestaña 'Restaurante' del editor de menú",
    },
    googleDashboard: {
      name: "Panel de Google My Business",
      step1: "Ve al panel de Google My Business",
      step2:
        "Si tienes múltiples ubicaciones, selecciona la ubicación a la que deseas añadir un enlace de reseña.",
      step3: "Haz clic en 'Inicio' en el menú izquierdo",
      step4: "Haz clic en 'Obtener más reseñas'",
      step5: "Copia el enlace de la barra de direcciones. ",
      step6:
        "Pega el enlace en el campo 'Enlace de Reseña de Google' en la pestaña 'Restaurante' del editor de menú",
    },
    ready: "¡Listo!",
  },
  socialMediaForm: {
    title: "Redes Sociales",
    facebookPlaceholder: "Enlace de Facebook",
    instagramPlaceholder: "Enlace de Instagram",
    googlePlaceholder: "Enlace de Reseña de Google",
    save: "Guardar",
    description:
      "Añade enlaces a tus redes sociales para aumentar el alcance de tu restaurante.",
    updatedToastTitle: "Enlaces de redes sociales actualizados",
    updatedToastDescription:
      "Tus enlaces de redes sociales han sido actualizados exitosamente",
  },
  toastCommon: {
    errorTitle: "Error",
    errorDescription: "Algo salió mal",
  },
  menuPrintCreator: {
    title: "Creador de Tarjeta de Código QR",
    socialMediaLabel: "Redes Sociales",
    socialMediaDescription:
      "Añade tus redes sociales a tu menú para aumentar tus seguidores.",
    instagramHandlePlaceholder: "Usuario de Instagram",
    facebookHandlePlaceholder: "Usuario de Facebook",
    wifiPasswordLabel: "Contraseña de Wifi",
    wifiPasswordDescription:
      "Si tienes una contraseña de wifi, añádela a tu menú para facilitar a tus clientes la conexión.",
    wifiPasswordPlaceholder: "Tu contraseña de wifi",
    restaurantNameLabel: "Añadir Nombre del Restaurante",
    qrCodeEnabledLabel: "Incluir Logo en el Código QR",
  },
  billing: {
    heading: "Facturación",
    description: "Gestiona tu información de facturación y plan de suscripción.",
    cancel: "Cancelar",
    areYouSureYouWantToCancelSubscription:
      "¿Estás seguro de que quieres cancelar tu suscripción?",
    sadToSeeYouGo:
      "Nos entristece verte partir :(, si tienes algún comentario que pueda ayudarnos a mejorar, por favor escríbenos a: support@feastqr.com",
    continue: "Continuar",
    subscriptionPlan: "Plan de Suscripción",
    subscriptionDescription:
      "Menú en línea y Código QR para que tus clientes escaneen.",
    youAreCurrentlyOn: {
      firstPart: "Tu plan: ",
      premium: "premium",
      free: "gratuito",
    },
    customerPortal: {
      goTo: "Ve a tu portal de cliente para gestionar tu suscripción.",
      description:
        "Ver historial de pagos, descargar facturas y gestionar suscripciones y métodos de pago.",
      title: "Portal de cliente",
    },
  },
  contactUsCard: {
    title: `Proporciónanos tu menú actual y nos encargaremos de todo, desde el diseño y la integración hasta la configuración.`,
    subtitle:
      "Nuestro equipo está listo para ayudarte. Confía en nuestro servicio de Creador de Menú QR; lo haremos todo por ti, creando la experiencia de menú definitiva con integración perfecta de QR y actualizaciones en tiempo real.",
    contactUs: "Contáctanos:",
  },
  affiliates: {
    title: "Afiliados",
    description: "Gestiona tu sistema de afiliados",
    comingSoon: "¡Próximamente!",
  },
  notifications: {
    menuNotFound: "Menú no encontrado",
    subscriptionCancelled: "Suscripción cancelada",
    subscriptionCancelledDescription:
      "¡Déjanos saber cómo podemos mejorar! support@feastqr.com",
    somethingWentWrong: "Algo salió mal.",
    tryAgainLater: "Inténtalo de nuevo más tarde.",
    newOrder: "Nuevo pedido",
  },
};

export default messages; 