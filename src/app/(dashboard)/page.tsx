import Heading from './components/Heading';
import DialogAddServiceForm from './components/DialogRegisterServiceForm';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  return (
    <div className="container max-w-4xl mx-auto p-6 flex flex-col gap-8">
      <Heading />
      <section>
        <h4 className="text-xl font-semibold mb-4">Your linked services</h4>
        <p className="text-muted-foreground">
          You have not linked any services yet.
        </p>
        <DialogAddServiceForm>
          <Button className="mt-4">Add Service</Button>
        </DialogAddServiceForm>
      </section>
    </div>
  );
}
