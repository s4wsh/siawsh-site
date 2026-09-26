// Safe extraction for localized fields.
// Handles: { en, fa } objects, plain strings, and legacy paired fields (field + fieldFa).

export const getLocalizedString = (field, lang = 'en') => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field['en'] || field['fa'] || '';
};

// Picks the correct member of a legacy field pair, e.g. (project, 'subtitle', 'fa')
// RULE: in 'fa' mode the Fa variant ALWAYS wins if it exists;
//       then the {en, fa} object's .fa; the English primary field is last resort.
export const pickLocalized = (source, baseKey, lang = 'en') => {
  if (!source) return '';
  const faKey = `${baseKey}Fa`;

  if (lang === 'fa') {
    // 1) Legacy Fa pair (subtitleFa, contextParagraphFa, taglineFa, labelFa, specsFa.client, ...)
    const faPair = getLocalizedString(source[faKey], 'fa');
    if (faPair) return faPair;

    // 2) Localized object's .fa (title: { en, fa } → title.fa)
    const primary = source[baseKey];
    if (primary && typeof primary === 'object' && typeof primary.fa === 'string') {
      return primary.fa;
    }

    // 3) Last resort: primary even if English (better than empty)
    return getLocalizedString(primary, 'fa');
  }

  // 'en' mode: primary field, then the {en, fa} object's .en
  return getLocalizedString(source[baseKey], 'en') || '';
};

// Array safety helper for tags
export const safeArray = (value) => (Array.isArray(value) ? value : []);