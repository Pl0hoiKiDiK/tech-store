import React from 'react';
import logoIcon from '../assets/icons/logo-icon.svg';
import twitterIcon from '../assets/icons/twitter-icon.svg';
import facebookIcon from '../assets/icons/facebook-icon.svg';
import tiktokIcon from '../assets/icons/tiktok-icon.svg';
import instagramIcon from '../assets/icons/instagram-icon.svg';
import './footer.css';

const FOOTER_COLUMNS = [
  {
    title: 'Services',
    links: ['Bonus program', 'Gift cards', 'Credit and payment', 'Service contracts', 'Non-cash account', 'Payment'],
  },
  {
    title: 'Assistance to the buyer',
    links: ['Find an order', 'Terms of delivery', 'Exchange and return of goods', 'Guarantee', 'FAQ', 'Terms of use'],
  },
];

const SOCIALS = [
  { icon: twitterIcon, label: 'Twitter', url: 'https://twitter.com' },
  { icon: facebookIcon, label: 'Facebook', url: 'https://facebook.com' },
  { icon: tiktokIcon, label: 'TikTok', url: 'https://tiktok.com' },
  { icon: instagramIcon, label: 'Instagram', url: 'https://instagram.com' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <img src={logoIcon} alt="Cyber tech store" className="footer__logo" />
        <p className="footer__description">
          We are a residential interior design firm located in Portland. Our boutique studio offers more than.
        </p>
        <div className="footer__socials">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${s.label}`}
            >
              <img src={s.icon} alt="" />
            </a>
          ))}
        </div>
      </div>

      <nav className="footer__nav" aria-label="Footer navigation">
        {FOOTER_COLUMNS.map((col) => (
          <div className="footer__column" key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </footer>
  );
}