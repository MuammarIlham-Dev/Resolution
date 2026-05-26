import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Github, Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E8E4DC] bg-[#FDFBF7] dark:bg-[#1A1A2E] dark:border-[#2D2D44] relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-24">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center group w-fit pb-2 transition-opacity hover:opacity-80">
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline flex-wrap gap-x-1.5 leading-none">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#C9A227]">
                    Peace-building
                  </span>
                  <span className="font-serif text-sm sm:text-base text-[#2C3E50] dark:text-[#E8E8E8]">
                    and Conflict Resolution
                  </span>
                </div>
                <span className="text-[0.65rem] sm:text-[0.75rem] tracking-[0.25em] text-[#C9A227] font-medium uppercase mt-1.5">
                  Institute
                </span>
              </div>
            </Link>
            <p className="text-[#2C3E50] dark:text-[#E8E8E8] leading-relaxed italic">
              "Articulating thoughts through a digital book experience. We believe in serene reading and the power of well-crafted stories."
            </p>
            <div className="flex items-center gap-5">
              {[
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Facebook, href: 'https://facebook.com' },
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Github, href: 'https://github.com' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2C3E50] hover:text-[#C9A227] dark:text-[#E8E8E8] dark:hover:text-[#C9A227] transition-all hover:-translate-y-1"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore & Legal — 2 columns on sm/md, separate cols on lg+ */}
          <div className="grid grid-cols-2 gap-8 lg:contents">
            {/* Explore Section */}
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6 relative w-fit">
                Explore
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#C9A227]" />
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'All Categories', to: '/category/all' },
                  { label: 'Courses', to: '/courses' },
                  { label: 'Seminars', to: '/seminars' },
                  { label: 'About the Project', to: '/about' },
                  { label: 'Author Portal', to: '/author/login' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[#2C3E50] hover:text-[#C9A227] dark:text-[#E8E8E8] transition-colors flex items-center gap-2 group text-sm"
                    >
                      <span className="h-1 w-0 bg-[#C9A227] transition-all group-hover:w-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6 relative w-fit">
                Legal
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#C9A227]" />
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'Privacy Policy', to: '#' },
                  { label: 'Terms of Service', to: '#' },
                  { label: 'Cookie Policy', to: '#' },
                  { label: 'Copyright Info', to: '#' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[#2C3E50] hover:text-[#C9A227] dark:text-[#E8E8E8] transition-colors flex items-center gap-2 group text-sm"
                    >
                      <span className="h-1 w-0 bg-[#C9A227] transition-all group-hover:w-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-16 pt-8 border-t border-[#E8E4DC] dark:border-[#2D2D44] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs tracking-widest uppercase text-[#2C3E50] dark:text-[#E8E8E8]">
            &copy; {currentYear} Peace-building and Conflict Resolution Institute  &middot; All Rights Reserved
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E8E4DC]/30 dark:bg-[#2D2D44]/50 rounded-full">
              Crafted for readers <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
            </span>
          </div>
        </div>
      </div>

      {/* Aesthetic flourish */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227] opacity-[0.03] blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A227] opacity-[0.02] blur-3xl -ml-32 -mb-32 pointer-events-none" />
    </footer>
  );
};
