import React from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';

const SocialLink: React.FC<{ href: string; icon: React.ReactNode }> = ({ href, icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
    {icon}
  </a>
);

interface FooterProps {
    onBookMeetingClick: () => void;
    onTrackOrderClick: () => void;
    onWarrantyClick: () => void;
    onShippingGuideClick: () => void;
    onProductAuthClick: () => void;
    onAboutClick: () => void;
    onTermsClick: () => void;
    onPrivacyClick: () => void;
    onCareersClick: () => void;
}

const FooterLink: React.FC<{ href?: string; onClick?: () => void; children: React.ReactNode }> = ({ href, onClick, children }) => {
    const commonClasses = "text-gray-400 hover:text-white transition-colors cursor-pointer";
    if (onClick) {
        return <button onClick={onClick} className={`${commonClasses} text-left`}>{children}</button>
    }
    return <a href={href || '#'} className={commonClasses}>{children}</a>
};

export const Footer: React.FC<FooterProps> = ({ 
    onBookMeetingClick, 
    onTrackOrderClick, 
    onWarrantyClick,
    onShippingGuideClick,
    onProductAuthClick,
    onAboutClick,
    onTermsClick,
    onPrivacyClick,
    onCareersClick,
}) => {
  return (
    <footer className="bg-gray-800 mt-12 border-t border-gray-700">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* About Section */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-2xl font-bold text-green-400">Buyflex</h3>
            <p className="mt-2 text-gray-400 text-sm max-w-sm">Your one-stop shop for the latest and greatest tech accessories. Quality you can trust, prices you'll love.</p>
            <div className="mt-4 flex space-x-4">
              <SocialLink href="https://facebook.com" icon={<FacebookIcon />} />
              <SocialLink href="https://instagram.com" icon={<InstagramIcon />} />
              <SocialLink href="https://youtube.com" icon={<YouTubeIcon />} />
              <SocialLink href="https://linkedin.com" icon={<LinkedInIcon />} />
              <SocialLink href="https://whatsapp.com" icon={<WhatsAppIcon />} />
            </div>
          </div>

          {/* About Buyflex Section */}
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase">About Buyflex</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><FooterLink onClick={onAboutClick}>About Us</FooterLink></li>
              <li><FooterLink onClick={onTermsClick}>Terms of Use</FooterLink></li>
              <li><FooterLink onClick={onPrivacyClick}>Privacy Policy</FooterLink></li>
              <li><FooterLink onClick={onCareersClick}>Careers</FooterLink></li>
            </ul>
          </div>

          {/* Get Help Section */}
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase">Get Help</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><FooterLink onClick={onTrackOrderClick}>Track Your Order</FooterLink></li>
              <li><FooterLink onClick={onWarrantyClick}>Warranty & Support</FooterLink></li>
              <li><FooterLink onClick={onShippingGuideClick}>Online Shipping Guide</FooterLink></li>
              <li><FooterLink onClick={onProductAuthClick}>Product Authentication</FooterLink></li>
              <li><FooterLink onClick={onBookMeetingClick}>Book a Meeting</FooterLink></li>
            </ul>
          </div>
          
          {/* Customer Service Section */}
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase">Customer Service</h4>
            <address className="mt-4 space-y-2 text-sm text-gray-400 not-italic">
                <p>123 Tech Lane, Silicon Valley, CA 94000</p>
                <p>Email: <a href="mailto:support@buyflex.com" className="hover:text-white">support@buyflex.com</a></p>
                <p>Phone: <a href="tel:+1234567890" className="hover:text-white">(123) 456-7890</a></p>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Buyflex. All Rights Reserved.</p>
          <p className="mt-1">Super Admin Login: `super@buyflex.com` / `super123`</p>
        </div>
      </div>
    </footer>
  );
};