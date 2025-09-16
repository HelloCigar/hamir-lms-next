'use client';
 
import { ProgressProvider } from '@bprogress/next/app';
 
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider 
      height="3px"
      color='#f59e0b'
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
 
export default Providers;