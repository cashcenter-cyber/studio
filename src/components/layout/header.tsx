'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  LogOut,
  LayoutDashboard,
  LogIn,
  ChevronDown,
  HelpCircle,
  Users,
  Wallet,
  Gift,
  Trophy,
  MessageSquare,
} from 'lucide-react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { useAuthService } from '@/firebase';
import { ThemeSwitcher } from './theme-switcher';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, userProfile, isUserLoading } = useUser();
  const auth = useAuthService();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const loggedInNavItems = [
    { href: '/dashboard/offers', label: 'Offers', icon: Wallet },
    { href: '/dashboard/rewards', label: 'Rewards', icon: Gift },
    { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: Trophy },
    { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  ];

  const commonNavItems = [
    {
      href: '#',
      label: 'FAQ',
      icon: HelpCircle,
    },
    {
      href: '#',
      label: 'Affiliate',
      icon: Users,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="container flex h-20 items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Cash-Center Logo"
              width={40}
              height={40}
              className="rounded-full animate-glow"
            />
            <span className="font-bold text-xl text-white">
              CASH<span className="text-primary">CENTER</span>
            </span>
          </Link>
          <ThemeSwitcher />
        </div>
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 text-sm font-medium text-gray-300">
           {user && loggedInNavItems.map((item) => (
             <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
           ))}
          {commonNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href!}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center justify-end space-x-4">
            {isUserLoading ? null : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage
                        src={user.photoURL ?? ''}
                        alt={userProfile?.username ?? ''}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userProfile?.username
                          ?.charAt(0)
                          .toUpperCase() ??
                          user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 glass-card"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userProfile?.username ?? 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/auth">
                            Login
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth">
                           Sign Up
                        </Link>
                    </Button>
                </div>

            )}
        </div>
      </div>
    </header>
  );
}
