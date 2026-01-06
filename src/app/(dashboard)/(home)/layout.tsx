import { SideMenuProvider } from '@/contexts/SideMenuContext';
import Header from './components/Header';
import SideMenu from '@/app/(dashboard)/(home)/components/SideMenu';

export default function DashboardHomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SideMenuProvider>
        <div className="grid grid-cols-[min-content_1fr] grid-rows-[auto_1fr] h-screen">
          <Header />
          <SideMenu />
          <main>{children}</main>
        </div>
      </SideMenuProvider>
    </>
  );
}
