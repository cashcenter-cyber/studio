'use client';

import type { LeaderboardUser } from '@/app/dashboard/leaderboards/page';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';

export function LeaderboardTable({ users }: { users: LeaderboardUser[] }) {
    
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-orange-400';
      default:
        return 'text-muted-foreground';
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16 text-center">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">Earnings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
              No data available yet. Start completing offers to appear here!
            </TableCell>
          </TableRow>
        )}
        {users.map((user) => (
          <TableRow key={user.uid}>
            <TableCell className="text-center">
                <Trophy className={`mx-auto h-6 w-6 ${getMedalColor(user.rank)}`} fill="currentColor" />
                <span className="font-bold text-lg">{user.rank}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/50">
                   <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.username}</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-headline text-lg font-semibold text-primary">
              {user.earnings.toLocaleString()} CASH
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
