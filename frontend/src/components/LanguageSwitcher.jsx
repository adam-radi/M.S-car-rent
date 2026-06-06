import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.css';

const LANGUAGES = [
  {
    code: 'en',
    short: 'EN',
    labelKey: 'languageSwitcher.en',
    flagUrl: 'https://flagcdn.com/w40/gb.png',
    flagAlt: 'United Kingdom',
  },
  {
    code: 'fr',
    short: 'FR',
    labelKey: 'languageSwitcher.fr',
    flagUrl: 'https://flagcdn.com/w40/fr.png',
    flagAlt: 'France',
  },
  {
    code: 'ar',
    short: 'AR',
    labelKey: 'languageSwitcher.ar',
    flagUrl: 'https://flagcdn.com/w40/ma.png',
    flagAlt: 'Morocco',
  },
];

const FlagImg = ({ lang, className }) => (
  <img
    src={lang.flagUrl}
    alt={lang.flagAlt}
    className={className}
    width={22}
    height={16}
    loading="lazy"
  />
);

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const activeCode = (i18n.language || 'en').split('-')[0];
  const active = LANGUAGES.find((l) => l.code === activeCode) || LANGUAGES[0];

  useEffect(() => {
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const select = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="language-switcher" ref={rootRef}>
      <button
        type="button"
        className="language-switcher-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('languageSwitcher.aria')}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="language-switcher-flag-wrap" aria-hidden>
          <FlagImg lang={active} className="language-switcher-flag-img" />
        </span>
        <span className="language-switcher-short">{active.short}</span>
        <span className={`language-switcher-chevron ${open ? 'open' : ''}`} aria-hidden>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <ul className="language-switcher-menu" role="listbox">
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === activeCode;
            return (
              <li key={lang.code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  className={`language-switcher-item ${isActive ? 'active' : ''}`}
                  onClick={() => select(lang.code)}
                >
                  <span className="language-switcher-flag-wrap" aria-hidden>
                    <FlagImg lang={lang} className="language-switcher-flag-img" />
                  </span>
                  <span className="language-switcher-item-text">
                    <span className="language-switcher-item-name">{t(lang.labelKey)}</span>
                    <span className="language-switcher-item-code">{lang.short}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
