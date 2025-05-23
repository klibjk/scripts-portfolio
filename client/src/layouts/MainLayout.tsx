import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="font-sans antialiased bg-gray-50 dark:bg-dark-800 transition-colors duration-200 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
