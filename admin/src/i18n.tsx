import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      /* Common */
      of: 'of',
      to: 'to',
      from: 'from',
      'an error occured': 'an error occured',
      yes: 'yes',
      no: 'no',

      /* Form common */
      cancel: 'cancel',
      submit: 'submit',
      accept: 'accept',

      /* Menu */
      home: 'home',
      equipments: 'equipments',
      restaurants: 'restaurants',
      activities: 'activites',
      rates: 'rates',
      customers: 'customers',
      bookings: 'bookings',

      /* Customers */
      fullname: 'fullname',
      email: 'email',
      phone: 'phone',
      actions: 'actions',
      'add a new customer': 'add a new customer',
      'first name': 'first name',
      'last name': 'last name',
      'delete customer': 'delete customer',
      'are you sure you want to delete this customer ?':
        'are you sure you want to delete this customer ?',
      'the customer has been added': 'The customer has been added',
      'an error occured, the customer could not be add':
        'An error occured, the customer could not be add',
      'the customer has been updated': 'The customer has been updated',
      'an error occured the customer could not be updated':
        'An error occured the customer could not be updated',
      'the customer has been deleted': 'The customer has been deleted',
      'an error occured the customer could not be deleted':
        'An error occured the customer could not be deleted',
      'firstName is a required field': 'firstName is a required field',
      'lastName is a required field': 'lastName is a required field',
      'email is a required field': 'email is a required field',
      'phone is a required field': 'phone is a required field',
      'delete price': 'delete price',
      'A customer with associated booking canot be deleted':
        'A customer with associated booking canot be deleted',

      /* Rates */
      title: 'title',
      week: 'week',
      night: 'night',
      weekend: 'weekend',
      'minimum duration': 'minimum duration',
      VERY_LOW_SEASON: 'very low season',
      LOW_SEASON: 'low season',
      MIDDLE_SEASON: 'middle season',
      HIGH_SEASON: 'high season',
      'are you sure you want to delete the price':
        'Are you sure you want to delete the price',
      color: 'color',
      year: 'year',
      'add or edit price': 'add or edit price',
      'year must be a number': 'year must be a number',
      'year must be greater than or equal to 2000':
        'year must be greater than or equal to 2000',
      'color is a required field': 'color is a required field',
      'week must be a number': 'week must be a number',
      'week must be greater than or equal to 0':
        'week must be greater than or equal to 0',
      'night must be a number': 'night must be a number',
      'night must be greater than or equal to 0':
        'night must be greater than or equal to 0',
      'weekend must be a number': 'weekend must be a number',
      'weekend must be greater than or equal to 0':
        'weekend must be greater than or equal to 0',
      'minimumDuration must be a number': 'minimumDuration must be a number',
      'minimumDuration must be greater than or equal to 0':
        'minimumDuration must be greater than or equal to 0',

      /* Seasons */
      'date range': 'date range',
      season: 'season',
      'delete the season': 'Delete the season',
      'are you sure you want to delete the season from':
        'Are you sure you want to delete the season from',
      'add or edit season': 'add or edit season',
      start: 'start',
      end: 'end',
      'start is a required field': 'start is a required field',
      'end is a required field': 'end is a required field',

      'the price could not be deleted': 'the price could not be deleted',
      'the price could not be add': 'the price could not be add',
      'the price has been added': 'The price has been added',
      'the price could not be edited': 'the price could not be edited',
      'the price has been edited': 'the price has been edited',
      'the season could not be deleted': 'the season could not be deleted',
      'the season could not be added': 'the season could not be added',
      'the season has been added': 'the season has been added',
      'the season has been deleted': 'the season has been deleted',
      'The price  has been deleted': 'The price  has been deleted',

      /* Bookings */
      'The booking status has been updated':
        'The booking status has been updated',
      'The booking has been created': 'The booking has been created',
      'An error occured, the booking could not be created':
        'An error occured, the booking could not be created',
      customer: 'customer',
      status: 'status',
      date: 'date',
      duration: 'duration',
      price: 'price',
      'Nb of adult': 'Nb of adult',
      'Nb of kids': 'Nb of kids',
      Cleaning: 'Cleaning',
      message: 'message',
      'day(s)': 'day(s)',
      'add a new booking': 'add a new booking',
      'Confirm action': 'Confirm action',
      'Are you sure you want to': 'Are you sure you want to',
      'the booking from': 'the booking from',
      'for the customer': 'for the customer',
      PENDING_CONFIRMATION: 'Confirmation pending',
      WAITING_FOR_DEPOSIT: 'Waiting for deposit',
      PAID_DEPOSIT: 'Deposit paid',
      PAID_REMAINING_BOOKING: 'Booking fully paid',
      IN_RENTING: 'Tenant currently in renting',
      RENTING_FINISHED: 'Renting is finished',
      CANCELLED: 'You cancelled the renting',
      CANCELLED_BY_TENANT: 'Tenant cancelled the renting',
    },
  },
  fr: {
    translation: {
      /* Common */
      of: 'de',
      to: 'au',
      from: 'du',
      'an error occured': "Une erreur s'est produite",
      yes: 'Oui',
      no: 'Non',

      /* Form common */
      cancel: 'annuler',
      submit: 'confirmer',
      accept: 'accepter',

      /* Menu */
      home: 'accueil',
      equipments: 'équipments',
      restaurants: 'restaurants',
      activities: 'activités',
      rates: 'tarifs',
      customers: 'clients',
      bookings: 'réservations',

      /* Customers */
      fullname: 'nom et prénom',
      email: 'email',
      phone: 'téléphone',
      actions: 'actions',
      'add a new customer': 'ajouter un nouveau client',
      'first name': 'prénom',
      'last name': 'nom',
      'delete customer': 'supprimer client',
      'are you sure you want to delete this customer ?':
        'êtes-vous sûr de vouloir supprimer ce client ?',
      'the customer has been added': 'Le client a été ajouté',
      'an error occured, the customer could not be add':
        "Une erreur s'est produite, le client n'a pas pû être créé",
      'the customer has been updated': 'Le client a été mis à jour',
      'an error occured the customer could not be updated':
        "Une erreur s'est produite le client n'a pas pû être mis à jour",
      'the customer has been deleted': 'Le client a été supprimé',
      'an error occured the customer could not be deleted':
        "Une erreur s'est produite le client n'a pas pû être supprimé",
      'firstName is a required field': 'prénom est un champ requis',
      'lastName is a required field': 'nom est un champ requis',
      'email is a required field': 'email est un champ requis',
      'phone is a required field': 'téléphone est un champ requis',
      line1: 'ligne 1',
      line2: 'ligne 2',
      postalCode: 'code postal',
      city: 'ville',
      country: 'pays',
      'A customer with associated booking canot be deleted':
        'Un client avec des réservations ne peut pas être supprimé',

      /* Rates */
      title: 'titre',
      week: 'semaine',
      night: 'nuit',
      weekend: 'weekend',
      'minimum duration': 'durée mininium',
      VERY_LOW_SEASON: 'très basse saison',
      LOW_SEASON: 'basse saison',
      MIDDLE_SEASON: 'moyenne saison',
      HIGH_SEASON: 'haute saison',
      'delete price': 'Supprimer le prix',
      'are you sure you want to delete the price':
        'êtes-vous sûr de vouloir supprimer le prix',
      color: 'couleur',
      year: 'année',
      'add or edit price': 'ajouter ou éditer le tarif',
      'year must be a number': 'année doit être un nombre',
      'year must be greater than or equal to 2000':
        'année doit être plus grand ou équal à 2000',
      'color is a required field': 'couleur est un champ requis',
      'week must be a number': 'semaine doit être un nombre',
      'week must be greater than or equal to 0':
        'semaine doit être plus grand ou égal à 0',
      'night must be a number': 'nuit doit être un nombre',
      'night must be greater than or equal to 0':
        'nuit doit être plus grand ou égal à 0',
      'weekend must be a number': 'weekend doit être un nombre',
      'weekend must be greater than or equal to 0':
        'weekend doit être plus grand ou égal à 0',
      'minimumDuration must be a number': 'durée minimum doit être un nombre',
      'minimumDuration must be greater than or equal to 0':
        'durée minimum doit être plus grand ou égal à 0',

      /* Seasons */
      'date range': 'plage de dates',
      season: 'saison',
      'delete the season': 'Supprimer la saison',
      'are you sure you want to delete the season from':
        'êtes-vous sûr de vouloir supprimer la saison de',
      'add or edit season': 'ajouter ou éditer la saison',
      start: 'début',
      end: 'fin',
      'start is a required field': 'La de début est obligatoire',
      'end is a required field': 'La de fin est obligatoire',

      'the price could not be deleted': "le prix n'a pas pû être supprimé",
      'the price could not be add': "Le prix n'a pas pû être ajouté",
      'the price has been added': 'Le prix a éjé ajouté',
      'the price could not be edited': "Le prix n'a pas pû etre édité",
      'the price has been edited': 'Le prix a été édité',
      'the season could not be deleted': "La siason n'a pas pû être supprimée",
      'the season could not be added': "La saison n'a pas pû être ajoutée",
      'the season has been added': 'La saison a été ajoutée',
      'the season has been deleted': 'la saison a été supprimée',
      'The price  has been deleted': 'Le prix a été supprimé',

      /* Bookings */
      'The booking status has been updated': 'La réservation a été mise à jour',
      'The booking has been created': 'La réservation a été crée',
      'An error occured, the booking could not be created':
        "Une erreur est survenue, la réservation n'a pas pû être créée",
      customer: 'client',
      status: 'status',
      date: 'date',
      duration: 'durée',
      price: 'prix',
      'Nb of adult': "Nb d'adultes",
      'Nb of kids': "Nb of d'enfants",
      Cleaning: 'Ménage',
      message: 'message',
      refuse: 'refuser',
      'day(s)': 'jour(s)',
      'add a new booking': 'Ajouter une nouvelle réservation',
      'Confirm action': 'Confirmer votre modification',
      'Are you sure you want to': 'Etes-vous sûr de vouloir',
      'the booking from': 'la réservation du',
      'for the customer': 'pour le client',
      PENDING_CONFIRMATION: 'Confirmation en attente',
      WAITING_FOR_DEPOSIT: 'En attente de la caution',
      PAID_DEPOSIT: 'Caution payé',
      PAID_REMAINING_BOOKING: 'Réservation payé intégralement',
      IN_RENTING: 'Locataire en location',
      RENTING_FINISHED: 'Réservation terminée',
      CANCELLED: 'Vous avez annulé la réservation',
      CANCELLED_BY_TENANT: 'Le locataire a annulé la réservation',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
