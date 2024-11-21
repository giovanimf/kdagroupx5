"use client";

import { useState } from "react";
import { FaHome, FaInfoCircle, FaTrophy, FaGamepad } from "react-icons/fa";
import { FiList } from "react-icons/fi";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

const nav_itens: NavItem[] = [
  { name: 'Home', href: '/', icon: <FaHome /> },
  { name: 'Ranking', href: '/ranking', icon: <FaTrophy /> },
  { name: 'Criar x5', href: '/criarx5', icon: <FaGamepad /> },
  { name: 'Cadastrar jogador', href: '/cadastrar-jogador', icon: <FaInfoCircle /> },
  { name: 'Partidas', href: '/partidas', icon: <FiList /> },
];


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <nav className="flex items-center justify-between md:p-0 p-4 h-20 max-w-screen-xl mx-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <span className="text-2xl font-semibold font-chakra text-titlebase2 hover:text-colorMintGreen">
          KDA GROUP - X5
        </span>
      </Link>

      {/* Botões para mobile */}
      <div className="flex items-center md:hidden gap-4">
        {!isAuthenticated ? (
          <Link href="/login" type="button" className="text-white bg-gradient-to-br from-green-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center">
            Login
          </Link>
        ) : (
          <Link href="/api/auth/signout" type="button" className="text-white bg-gradient-to-br from-green-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center">
            Sair
          </Link>
        )}

        {/* Botão de menu mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="p-2 w-10 h-10 text-gray-300 rounded-lg hover:bg-gray-100 hover:text-black"
          aria-controls="navbar-sticky"
          aria-expanded={isMenuOpen}
        >
          <AiOutlineMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Links do menu para Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {nav_itens.map((item) => {
          if (item.name === "Criar x5" && !isAuthenticated) return null;
          if (item.name === "Cadastrar jogador" && !isAuthenticated) return null;
          return (
            <Link key={item.name} href={item.href} className="text-base font-medium text-white hover:text-colorMintGreen">
              {item.name}
            </Link>
          );
        })}
        {/* Botão login/minha conta para Desktop */}
        {!isAuthenticated ? (
          <Link href="/login" type="button" className="text-white bg-gradient-to-br from-green-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center">
            Login
          </Link>
        ) : (
          <Link href="/api/auth/signout" type="button" className="text-white bg-gradient-to-br from-green-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center">
            Sair
          </Link>
        )}
      </div>
      {/* Menu lateral deslizante para mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Background para clicar e fechar o menu */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="w-1/4 fixed inset-0 bg-black opacity-80 z-40"
          />
          {/* Menu deslizante */}
          <div className="relative w-3/4 max-w-xs bg-[#110e0f] h-[100vh] shadow-lg z-50 flex flex-col gap-4">
            {/* Botão para fechar o menu */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-white my-0 hover:border-colorMintGreen">
              <Link href="/" className="flex items-center">
                <span className="self-center text-2xl font-semibold font-chakra text-titlebase2 hover:text-colorMintGreen">
                  KDA GROUP - X5
                </span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="focus:outline-none text-white hover:text-colorMintGreen"
              >
                <AiOutlineClose className="w-6 h-6" />
              </button>
            </div>
            {/* Itens do menu */}
            <ul className="flex flex-col px-6 gap-4">
              {nav_itens.map((item) => {
                if (item.name === "Criar x5" && !isAuthenticated) return null;
                if (item.name === "Cadastrar jogador" && !isAuthenticated) return null;
                return (
                  <Link key={item.name} href={item.href} className="text-base font-medium text-white hover:text-colorMintGreen">
                    {item.name}
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
