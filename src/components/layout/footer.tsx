import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
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
              <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Business</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Affiliate</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider">Support</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Support</Link></li>
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
