'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Gift, ShieldCheck, UserCog, BarChart3, Wallet, ListPlus, Trophy, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/offers', icon: Wallet, label: 'Offers' },
  { href: '/dashboard/rewards', icon: Gift, label: 'Rewards' },
  { href: '/dashboard/leaderboards', icon: Trophy, label: 'Leaderboards' },
  { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat' },
];

const adminNavItems = [
    { href: '/dashboard/admin/stats', icon: BarChart3, label: 'Stats' },
    { href: '/dashboard/admin/offers', icon: ListPlus, label: 'Offers' },
  { href: '/dashboard/payouts/admin', icon: ShieldCheck, label: 'Payouts' },
  { href: '/dashboard/users/admin', icon: UserCog, label: 'Users' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-primary/10 bg-sidebar/50 p-4">
      <nav className="flex flex-col gap-2">
        <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Menu</p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              pathname === item.href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
        {userProfile?.role === 'admin' && (
           <>
             <p className="mt-4 px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Admin</p>
             {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    pathname.startsWith(item.href) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
             ))}
           </>
        )}
      </nav>
    </aside>
  );
}
