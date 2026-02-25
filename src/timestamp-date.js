/**
 * Plugin Zyllio - Timestamp en date lisible
 * Version: 1.0.0
 * Auteur: Hikaru-ufo
 *
 * Fonctions disponibles :
 *  - datetime-now        : Retourne la date/heure actuelle au format JJ/MM/AAAA HH:MM:SS
 *  - datetime-from-date  : Retourne une date Zyllio au format JJ/MM/AAAA HH:MM:SS
 */

const PLUGIN_INFO = {
    name: "Timestamp Date Lisible",
    version: "1.0.0",
    author: "Hikaru-ufo",
    buildDate: "2026-02-25"
};

console.log('========================================');
console.log(`CHARGEMENT PLUGIN: ${PLUGIN_INFO.name} v${PLUGIN_INFO.version}`);
console.log('========================================');

const DatetimeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/><path d="M11 17H13V11H11V17M11 9H13V7H11V9Z"/></svg>`;

// ─────────────────────────────────────────
// UTILITAIRE : formater une date JS en JJ/MM/AAAA HH:MM:SS (heure locale)
// ─────────────────────────────────────────
function formatDate(date) {
    const pad = n => String(n).padStart(2, '0');
    const jj   = pad(date.getDate());
    const mm   = pad(date.getMonth() + 1);
    const aaaa = date.getFullYear();
    const hh   = pad(date.getHours());
    const min  = pad(date.getMinutes());
    const ss   = pad(date.getSeconds());
    return `${jj}/${mm}/${aaaa} ${hh}:${min}:${ss}`;
}

// ─────────────────────────────────────────
// FONCTION 1 : Date/heure actuelle
// ─────────────────────────────────────────
class DatetimeNowFunction {
    async execute(properties, listItem) {
        try {
            const result = formatDate(new Date());
            console.log('[datetime-now] Retourne:', result);
            return result;
        } catch (error) {
            console.error('[datetime-now] Erreur:', error);
            return '';
        }
    }
}

const DatetimeNowMetadata = {
    id: 'datetime-now',
    icon: DatetimeIcon,
    label: 'Date heure maintenant',
    category: 'Date',
    format: 'text',
    properties: [{
        id: 'dummy',
        name: 'Info',
        type: 'text',
        tooltip: 'Retourne la date et heure actuelle au format JJ/MM/AAAA HH:MM:SS',
        default: 'now'
    }],
    translations: [{
        lang: 'fr',
        label: 'Date heure maintenant',
        category: 'Date',
        properties: [{
            id: 'dummy',
            name: 'Info'
        }]
    }]
};

// ─────────────────────────────────────────
// FONCTION 2 : Date lisible depuis une date Zyllio
// ─────────────────────────────────────────
class DatetimeFromDateFunction {
    async execute(properties, listItem) {
        try {
            const dateProp = properties.find(p => p.id === 'date');

            if (!dateProp || !dateProp.value) {
                console.log('[datetime-from-date] Pas de date fournie');
                return '';
            }

            const dateString = await zySdk.services.dictionary.getValue(dateProp.value, listItem);
            console.log('[datetime-from-date] Date reçue:', dateString);

            if (!dateString) return '';

            const date = new Date(Date.parse(dateString));

            if (isNaN(date.getTime())) {
                console.log('[datetime-from-date] Date invalide:', dateString);
                return '';
            }

            const result = formatDate(date);
            console.log('[datetime-from-date] Retourne:', result);
            return result;

        } catch (error) {
            console.error('[datetime-from-date] Erreur:', error);
            return '';
        }
    }
}

const DatetimeFromDateMetadata = {
    id: 'datetime-from-date',
    icon: DatetimeIcon,
    label: 'Date heure depuis une date',
    category: 'Date',
    format: 'text',
    properties: [{
        id: 'date',
        name: 'Date',
        type: 'date',
        tooltip: 'Date à afficher au format JJ/MM/AAAA HH:MM:SS',
        default: '',
        main: true
    }],
    translations: [{
        lang: 'fr',
        label: 'Date heure depuis une date',
        category: 'Date',
        properties: [{
            id: 'date',
            name: 'Date'
        }]
    }]
};

// ─────────────────────────────────────────
// ENREGISTREMENT
// ─────────────────────────────────────────
if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.registry) {
    zySdk.services.registry.registerFunction(DatetimeNowMetadata, new DatetimeNowFunction());
    console.log('[Plugin] "datetime-now" enregistrée');

    zySdk.services.registry.registerFunction(DatetimeFromDateMetadata, new DatetimeFromDateFunction());
    console.log('[Plugin] "datetime-from-date" enregistrée');

    console.log(`[Plugin] ${PLUGIN_INFO.name} v${PLUGIN_INFO.version} chargé !`);
} else {
    console.error('[Plugin] zySdk indisponible');
}

if (typeof window !== 'undefined') {
    window.ZYLLIO_DATETIME_PLUGIN_INFO = PLUGIN_INFO;
}
