import { Suspense } from 'react';

export default function EmailVerificationVerify() {
  return (
    <Suspense
      fallback={
        <>
          <p>Loading...</p>
        </>
      }></Suspense>
  );
}
