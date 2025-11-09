'use client';

import { useState, useEffect } from 'react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function TermsPage() {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="prose prose-invert max-w-4xl mx-auto">
                    <h1 className="font-headline text-4xl text-primary">Terms of Service</h1>
                    <p className="lead">Last updated: {currentDate}</p>

                    <h2>1. Agreement to Terms</h2>
                    <p>By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the services.</p>

                    <h2>2. User Accounts</h2>
                    <p>You must be at least 18 years old to create an account. You are responsible for safeguarding your account and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>

                    <h2>3. Prohibited Conduct</h2>
                    <p>You agree not to engage in any of the following prohibited activities:</p>
                    <ul>
                        <li>Using automated scripts to collect information or otherwise interact with the services.</li>
                        <li>Impersonating any person or entity or falsely stating or otherwise misrepresenting your affiliation with a person or entity.</li>
                        <li>Violating any applicable local, state, national, or international law.</li>
                        <li>Using the service for any fraudulent activity.</li>
                    </ul>
                    
                    <h2>4. Termination</h2>
                    <p>We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                    
                    <h2>5. Limitation of Liability</h2>
                    <p>In no event shall Cash-Center.fun, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

                    <h2>6. Governing Law</h2>
                    <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is based, without regard to its conflict of law provisions.</p>
                    
                    <h2>7. Changes to Terms</h2>
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice before any new terms taking effect.</p>
                    
                    <h2>8. Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us at support@cash-center.fun.</p>
                </div>
            </main>
            <Footer />
        </div>
    )
}
