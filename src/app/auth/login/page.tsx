import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <section className="container max-w-sm">
      <h1 className="text-3xl font-semibold mb-4">Welcome back</h1>
      <p className="text-muted-foreground mb-10">
        Login to manage your environment.
      </p>
      <Suspense
        fallback={
          <div className="text-muted-foreground px-4 py-3 w-full text-center">
            Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </section>
  );
}
