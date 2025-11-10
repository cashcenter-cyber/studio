import { NextResponse } from 'next/server';
import { requestPayout } from '@/lib/actions';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const values = await req.json();
    const result = await requestPayout(values);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Payout Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
