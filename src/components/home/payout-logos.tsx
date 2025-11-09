const payoutMethods = [
  'PayPal', 'Bitcoin', 'Ethereum', 'Amazon', 'Steam', 'Google Play', 'Roblox'
];

export function PayoutLogos() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold font-headline text-center mb-2">Flexible Payout Options</h2>
      <p className="text-center text-muted-foreground mb-12">Get your rewards your way. We support a variety of payout methods.</p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {payoutMethods.map((method) => (
          <div key={method} className="text-center">
            <div className="flex items-center justify-center h-16 w-32 glass-card p-4 transition-all duration-300 hover:border-primary hover:scale-105">
              <span className="text-lg font-semibold text-gray-300">{method}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
