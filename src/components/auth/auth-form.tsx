'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useAuthService } from '@/firebase';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createUserProfile } from '@/lib/firestore'; // Importez la fonction
import { useFirestore } from '@/firebase'; // Importez useFirestore


const signUpSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  referralCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function AuthForm() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuthService();
  const db = useFirestore();

  const handleAuthSuccess = () => {
    router.push('/dashboard');
    toast({
      title: 'Welcome!',
      description: "You've successfully logged in.",
    });
  };

  const handleAuthError = (error: any) => {
    toast({
      variant: 'destructive',
      title: 'Authentication Error',
      description: error.message || 'An unknown error occurred.',
    });
  };

  const handleGoogleSignIn = async () => {
    setLoading('google');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // La création du profil sera gérée par le provider central.
      // On redirige simplement après le succès de la connexion.
      handleAuthSuccess();
    } catch (error: any) {
        handleAuthError(error);
    } finally {
      setLoading(null);
    }
  };

  const LoginForm = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
      setLoading('login');
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        handleAuthSuccess();
      } catch (error) {
        handleAuthError(error);
      } finally {
        setLoading(null);
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" className="w-full" disabled={!!loading}>{loading === 'login' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Login</Button>
        </form>
      </Form>
    );
  };
  
  const SignUpForm = () => {
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { username: '', email: '', password: '', referralCode: '' },
      });
  
    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        setLoading('signup');
        try {
          // On passe les infos au provider via la session storage,
          // car le onAuthStateChanged est le seul point de vérité.
          sessionStorage.setItem('signupUsername', values.username);
          sessionStorage.setItem('signupReferralCode', values.referralCode || '');
          await createUserWithEmailAndPassword(auth, values.email, values.password);
          handleAuthSuccess();
        } catch (error: any) {
          handleAuthError(error);
        } finally {
          // Le nettoyage se fait maintenant dans le provider après lecture
          setLoading(null);
        }
      };

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="username" render={({ field }) => (
            <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="YourUsername" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="referralCode" render={({ field }) => (
            <FormItem><FormLabel>Referral Code (Optional)</FormLabel><FormControl><Input placeholder="Got a referral code?" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" className="w-full" disabled={!!loading}>{loading === 'signup' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Create Account</Button>
        </form>
      </Form>
    )
  }

  return (
    <div className="space-y-6">
       <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={!!loading}>
        {loading === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.5l-62.7 62.7C337 97 294.6 80 248 80c-82.8 0-150.4 66.6-150.4 148.4s67.6 148.4 150.4 148.4c97.1 0 134-63.5 138.3-95.3H248v-70.7h235.5c4.3 23.7 6.5 47.8 6.5 72.7z"></path></svg>}
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="mt-4">
          <LoginForm />
        </TabsContent>
        <TabsContent value="signup" className="mt-4">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
