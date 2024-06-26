import { Inter } from "next/font/google";
import "./globals.css";
import NavMenu from "@/components/nav_menu";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "App OFT",
  description: "",
};

export default function RootLayout({ children }) {

  const menu = [
    { name: "Personas", path: "/personas" },
    { name: "Medicamentos", path: "/medicamentos" },
    { name: "Recetas", path: "/recetas" },
  ]

  return (
    <html lang="es">
      <body className={`${inter.className} container m-2`}>
        <Toaster />
        <main className="flex">
          <h2 className="w-full font-bold text-center">Oftalmo Vittes</h2>
        </main>
        <NavMenu menuItems={menu} />
        <div className="">
          {children}
        </div>
      </body>
    </html>
  );
}
