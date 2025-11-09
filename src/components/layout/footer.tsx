import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-background/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="Cash Center Logo" style={{ width: '32px', height: 'auto' }} />
              <span className="font-bold text-white">CASH CENTER</span>
            </Link>
            <p className="text-gray-400">Earn money online with the best earning platform.</p>
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

        <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Cash-Center.fun. All rights reserved.</p>
          <div className="flex items-center gap-2 bg-white text-black px-2 py-1 rounded">
            <span className="font-bold">b</span>
            <span>Made in Bolt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
