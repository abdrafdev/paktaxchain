import React from 'react';
import i18n from '../lib/i18n';

const LanguageSwitcher = () => {
  const currentLanguage = i18n.getLanguage();
  const availableLanguages = i18n.getAvailableLanguages();

  const handleLanguageChange = (language) => {
    i18n.setLanguage(language);
    // Force page reload to apply language changes
    window.location.reload();
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {i18n.getLanguageName(lang)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher; 