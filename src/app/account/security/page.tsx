import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { isAuthenticated } from '@/lib/auth';
import EnableTwoFactorSwitch from './EnableTwoFactorSwitch';
import AddTwoFactorMethod from './AddTwoFactorMethod';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getAllTOTP } from '@/actions/totp';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Format from '@/utils/Format';
import RemoveTwoFactorMethod from './RemoveTwoFactorMethod';
import ResetPasswordForm from './ResetPasswordForm';

export default async function SecurityPage() {
  await isAuthenticated();

  const response = await getAllTOTP();

  return (
    <div className="container max-w-2xl flex flex-col gap-8">
      <div className="grid gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/account">Profile</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Security</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-medium">Security</h1>
        <p className="text-muted-foreground">
          Edit security details linked to your account
        </p>
      </div>
      <section className="grid gap-6">
        <h4 className="text-xl font-medium">Two-Factor methods</h4>
        {!response.success ? (
          <Alert variant="destructive">
            <AlertTitle>
              Error fetching two-factor methods, try refreshing
            </AlertTitle>
            <AlertDescription>{response.error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <EnableTwoFactorSwitch />
            <ItemGroup className="gap-6">
              {response.totpTokens.map((totpToken) => (
                <Item key={totpToken.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>TOTP</ItemTitle>
                    <ItemDescription>
                      <span>
                        Authenticator app linked on&nbsp;
                        {Format.date(totpToken.createdAt).dateTime}
                      </span>
                      {totpToken.lastUsedAt && (
                        <span>
                          ,&nbsp;last used&nbsp;
                          {Format.date(totpToken.lastUsedAt).dateTime}
                        </span>
                      )}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <RemoveTwoFactorMethod totpTokenId={totpToken.id} />
                  </ItemActions>
                </Item>
              ))}
              <AddTwoFactorMethod />
            </ItemGroup>
          </>
        )}
      </section>
      <section className="grid gap-6">
        <h4 className="text-xl font-medium">Reset password</h4>
        <ResetPasswordForm />
      </section>
    </div>
  );
}
