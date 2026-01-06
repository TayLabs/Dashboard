import { SideMenuProvider } from '@/contexts/SideMenuContext';
import SideMenu from './components/SideMenu';
import Header from './components/Header';

export default function DashboardManagementLayout({
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
