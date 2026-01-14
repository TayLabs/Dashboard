import SignupForm from './SignUpForm';

export default function SignUpPage() {
  return (
    <section className="container max-w-sm">
      <h1 className="text-3xl font-semibold mb-4">Create an account</h1>
      <p className="text-muted-foreground mb-10">
        Signup with a new account to view your application as a guest user.
      </p>
      <SignupForm />
    </section>
  );
}
