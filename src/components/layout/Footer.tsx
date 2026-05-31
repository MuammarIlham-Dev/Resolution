import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Github, Heart } from 'lucide-react';

const authorProfile = {
  name: 'Mohammad Mahbub Alam',
  role: 'Assistant Professor, Trainer & Guest Faculty of English',
  affiliations:
    "Rajdhani Girls' College; SAIC Teachers' Training College; CARe Nursing College, Dhaka",
  academicHeading: 'Academic Achievements & Progress',
  academicAchievements: [
    'PGD in International Relations',
    'M.A. (English); NTRCA (English)',
    'M.A. (Religious Science)',
    'LL.M. in Human Rights (Enrollee)',
  ],
  focus:
    "Researcher in Human Resource Development & Experienced in Students' Counseling Psychology",
  phone: '01708371302 / 01615635243',
  email: 'mahbubalam002021@gmail.com',
} as const;

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E8E4DC] bg-[#FDFBF7] dark:bg-[#1A1A2E] dark:border-[#2D2D44] relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 xl:gap-16">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center group w-fit pb-2 transition-opacity hover:opacity-80">
              <div className="flex items-baseline flex-wrap gap-x-1.5 leading-none">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#C9A227]">
                  Conflict Resolution Institute
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

          {/* Explore, Legal & About Author */}
          <div className="flex flex-col gap-10 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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

            {/* About Author */}
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6 relative w-fit">
                About Author
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#C9A227]" />
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Column 1 */}
                <div className="space-y-3 text-sm leading-relaxed">
                  <p className="font-serif text-base font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
                    {authorProfile.name}
                  </p>
                  <p className="text-[#8B4513] dark:text-[#C9A227]">
                    {authorProfile.role}
                  </p>
                  <p className="text-[#2C3E50] dark:text-[#E8E8E8]">
                    {authorProfile.affiliations}
                  </p>
                  <p className="pt-2 font-medium text-[#8B4513] dark:text-[#C9A227]">
                    {authorProfile.academicHeading}
                  </p>
                  <ul className="space-y-1 text-[#2C3E50] dark:text-[#E8E8E8]">
                    {authorProfile.academicAchievements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Column 2 */}
                <div className="space-y-4 text-sm leading-relaxed">
                  <p className="text-[#8B4513] dark:text-[#C9A227]">
                    {authorProfile.focus}
                  </p>
                  <div className="space-y-2 text-[#2C3E50] dark:text-[#E8E8E8]">
                    <p>
                      <span className="font-medium">Cell Phone No:</span>{' '}
                      <span className="text-[#8B4513] dark:text-[#C9A227]">
                        {authorProfile.phone}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">E-mail:</span>{' '}
                      <a
                        href={`mailto:${authorProfile.email}`}
                        className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {authorProfile.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-16 pt-8 border-t border-[#E8E4DC] dark:border-[#2D2D44] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs tracking-widest uppercase text-[#2C3E50] dark:text-[#E8E8E8]">
            &copy; {currentYear} Conflict Resolution Institute  &middot; All Rights Reserved
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
