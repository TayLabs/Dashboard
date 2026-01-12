import Header from '@/components/Header';
import SideMenu from '@/components/SideMenu';
import { SideMenuProvider } from '@/contexts/SideMenuContext';

export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SideMenuProvider>
      <div className="grid grid-cols-[min-content_1fr] grid-rows-[auto_1fr] h-screen">
        <Header />
        <SideMenu />
        <main className="flex justify-center items-start py-8 px-4">
          {children}
        </main>
      </div>
    </SideMenuProvider>
  );
}
