'use client';

import dynamic from 'next/dynamic';

// Dynamically import the client-side component and disable Server-Side Rendering (SSR)
const AnimatedBackgroundClient = dynamic(() => import('./animated-background-client'), {
  ssr: false,
});

const AnimatedBackground = () => {
  return <AnimatedBackgroundClient />;
};

export default AnimatedBackground;
