'use client';

import Link from 'next/link';
import Image from 'next/image';
import { InfoDialog } from './info-dialog';

export function Footer() {
  const companyLinks = [
    { title: 'About', content: 'Cash-Center.fun is a platform dedicated to helping users earn money online through various activities like completing surveys and testing apps.' },
    { title: 'Business', content: 'For partnership and business inquiries, please contact us at business@cash-center.fun. We are open to collaborations with offer walls and advertisers.' },
    { title: 'Contact', content: 'For general questions, you can reach our team at contact@cash-center.fun. For account or technical issues, please use the support contact.' },
    { title: 'Affiliate', content: 'Refer new users to Cash-Center.fun and earn 2% of their earnings for life! Share your unique referral code and start building your income stream.' },
  ];

  const legalLinks = [
      { title: 'Terms of Service', content: 'By using our services, you agree to be bound by these Terms of Service. You must be at least 18 years old to create an account. You are responsible for all activities that occur under your account. Prohibited activities include using automated scripts, impersonating others, fraudulent activity, and violating any laws. We may terminate your access to our services at any time for any reason. Our liability is limited to the fullest extent permitted by law.'},
      { title: 'Privacy Policy', content: 'We collect personal data you provide (name, email) and derivative data (IP address, browser type) to manage your account and improve our service. We may share your information with third-party service providers for tasks like payment processing and data analysis, or if required by law. We use security measures to protect your information, but no method is 100% secure.'},
      { title: 'Cookie Policy', content: 'Our website uses essential cookies to ensure basic functionality like user sessions and security. We do not use third-party tracking or advertising cookies. By using our site, you consent to the use of these necessary cookies.'},
  ]

  const supportLinks = [
    { title: 'FAQ', content: 'How do I earn money? By completing offers from our partners. How do I get paid? You can request a payout via PayPal, crypto, or gift cards once you reach the minimum threshold. Is it free? Yes, joining and earning on Cash-Center.fun is completely free.' },
    { title: 'Help Center', content: 'For detailed guides on how to complete offers, request payouts, or resolve common issues, please visit our dedicated Help Center section (Coming Soon).' },
    { title: 'Contact Support', content: 'If you are facing technical issues or have a problem with your account, please contact our support team directly at support@cash-center.fun for assistance.' },
  ];

  return (
    <footer className="w-full border-t border-white/10 bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Cash-Center Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-bold text-lg text-white">
                CASH<span className="text-primary">CENTER</span>
              </span>
            </Link>
            <p className="text-gray-400">
              Earn money online with the best earning platform.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-gray-400">
              {companyLinks.map(link => (
                <li key={link.title}>
                  <InfoDialog title={link.title} content={link.content} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-gray-400">
              {legalLinks.map(link => (
                <li key={link.title}>
                  <InfoDialog title={link.title} content={link.content} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider">Support</h3>
            <ul className="space-y-3 text-gray-400">
               {supportLinks.map(link => (
                <li key={link.title}>
                  <InfoDialog title={link.title} content={link.content} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Cash-Center.fun. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
