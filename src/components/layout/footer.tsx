import Link from 'next/link';
import Image from 'next/image';
import { InfoDialog } from './info-dialog';

export function Footer() {
  const companyLinks = [
    { title: 'About', content: 'Cash-Center.fun is a platform dedicated to helping users earn money online through various activities.' },
    { title: 'Business', content: 'For business inquiries, please contact us at business@cash-center.fun.' },
    { title: 'Contact', content: 'You can reach our support team at support@cash-center.fun.' },
  ];

  const supportLinks = [
    { title: 'FAQ', content: 'Find answers to frequently asked questions here. (Content coming soon)' },
    { title: 'Help Center', content: 'Visit our help center for detailed guides. (Content coming soon)' },
    { title: 'Contact Support', content: 'Contact our support team for any issues. (Content coming soon)' },
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
               <li><Link href="#" className="hover:text-primary transition-colors">Affiliate</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li>
                <InfoDialog title="Cookie Policy" content="Our website uses cookies to enhance your experience. (Detailed content coming soon)" />
              </li>
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