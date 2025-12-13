"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import { useCart } from "@/context/CartContext";
import { getAccessToken } from "@/lib/api";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/auth";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [hasToken, setHasToken] = useState(false);
  const isScrollingRef = useRef(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { toggleCart, cartCount } = useCart();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const router = useRouter();

  // Check for token on mount and when it changes
  useEffect(() => {
    const token = getAccessToken();
    setHasToken(!!token);
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Home", href: "/#home", id: "home" },
    { label: "About Us", href: "/#about", id: "about" },
    { label: "Shop", href: "/shop", id: "shop" },
    { label: "Reviews", href: "/#reviews", id: "reviews" },
    { label: "Gallery", href: "/#gallery", id: "gallery" },
  ];

  const pathname = usePathname();

  useEffect(() => {
    // If we are on the shop page, set active section to 'shop'
    if (pathname.startsWith("/shop")) {
      setActiveSection("shop");
      return;
    }

    // If we are not on the homepage, don't run scroll spy
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      // Skip scroll detection if we're in the middle of a click navigation
      if (isScrollingRef.current) return;
      
      const sections = navLinks.map(link => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (id: string) => {
    // Lock scroll detection during navigation
    isScrollingRef.current = true;
    setActiveSection(id);
    setIsMenuOpen(false);
    
    // Unlock after smooth scroll completes (matches CSS scroll-behavior duration)
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logoutMutation.mutate();
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-md transition-all duration-300 border-b border-white/20 supports-[backdrop-filter]:bg-white/60">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold tracking-tight text-primary">
            ZEN<span className="font-light text-gray-400">GLOW</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => handleNavClick(link.id)}
                className={`text-xs font-bold tracking-wide transition-colors hover:text-primary ${
                  activeSection === link.id
                    ? "bg-accent px-5 py-2 text-primary"
                    : "text-gray-500"
                }`}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center border-r border-gray-200 pr-6">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="flex items-center text-xs font-bold text-gray-500 hover:text-black transition-colors"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                  >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  SEARCH
                </button>
            </div>

            <div className="flex items-center gap-4">
               {/* Account Icon with Dropdown */}
               <div className="relative hidden md:block" ref={profileDropdownRef}>
                 {hasToken ? (
                   <>
                     <button 
                       onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                       className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors"
                     >
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                       <ChevronDown size={14} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                     </button>
                     
                     {/* Dropdown Menu */}
                     {isProfileDropdownOpen && (
                       <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 shadow-xl z-50 overflow-hidden">
                         <div className="px-4 py-3 bg-accent/50 border-b border-gray-100">
                           <p className="text-sm font-bold text-primary truncate">{user?.full_name || 'Welcome'}</p>
                           <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                         </div>
                         <Link 
                           href="/profile"
                           onClick={() => setIsProfileDropdownOpen(false)}
                           className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-accent hover:text-primary transition-colors"
                         >
                           <User size={16} />
                           My Profile
                         </Link>
                         <Link 
                           href="/orders"
                           onClick={() => setIsProfileDropdownOpen(false)}
                           className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-accent hover:text-primary transition-colors"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                           My Orders
                         </Link>
                         <div className="border-t border-gray-100">
                           <button
                             onClick={handleLogout}
                             className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                           >
                             <LogOut size={16} />
                             Sign Out
                           </button>
                         </div>
                       </div>
                     )}
                   </>
                 ) : (
                   <Link href="/login" className="text-gray-500 hover:text-black transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                   </Link>
                 )}
               </div>

               {/* Cart Icon */}
               <button onClick={toggleCart} className="text-gray-500 hover:text-black transition-colors relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-primary text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-primary">
                          {cartCount}
                      </span>
                  )}
               </button>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2 text-gray-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <span className="sr-only">Open menu</span>
                <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
                </svg>
            </button>
          </div>
        </div>
      </Container>
      
      {/* Search Dropdown */}
      <div className={`absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
         <Container>
            <div className="flex items-center h-20">
               <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 mr-6"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="SEARCH FOR..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 h-full text-xl uppercase tracking-widest font-medium placeholder:text-gray-300 border-none focus:outline-none bg-transparent"
                  autoFocus={isSearchOpen}
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-gray-400 hover:text-black transition-colors"
                >
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                   </svg>
                </button>
            </div>
         </Container>
      </div>
      
       {/* Mobile Menu */}
       {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <Container>
            <nav className="flex flex-col py-4 gap-4">
              {navLinks.map((link) => (
                 <Link
                 key={link.label}
                 href={link.href}
                 onClick={() => handleNavClick(link.id)}
                 className={`text-sm font-medium px-4 py-2 ${
                   activeSection === link.id
                     ? "bg-accent text-primary w-fit" 
                     : "text-gray-600"
                 }`}
               >
                 {link.label.toUpperCase()}
               </Link>
              ))}
              <div className="flex flex-col gap-2 mt-2 px-4 border-t border-gray-100 pt-4">
                <button 
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 py-2 text-sm font-medium text-gray-600"
                >
                    Search
                </button>
                {hasToken ? (
                  <>
                    <Link 
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm font-medium text-gray-600 hover:text-primary"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        logoutMutation.mutate();
                      }}
                      className="flex items-center gap-2 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 text-sm font-medium text-gray-600 hover:text-primary"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 text-sm font-medium text-gray-600 hover:text-primary"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
