import { Link } from 'react-router-dom';
import { Heart, Mail, Phone } from 'lucide-react';

const authorProfile = {
  name: 'Mohammad Mahbub Alam',
  role: 'Assistant Professor, Trainer & Guest Faculty of English',
  affiliations: [
    "SAIC Teachers' Training College, Dhaka",
    'CARe Nursing College, Dhaka',
  ],
  academicHeading: 'Academic Achievements',
  academicAchievements: [
    'M.A. (English); NTRCA (English)',
    'M.A. (Religious Science)',
    'Post Graduate Diploma in International Relations',
    'LL.M. in Human Rights (Enrollee)',
  ],
  focus: "Researcher in HRD & Students' Counseling Psychology",
  phone: '01708371302',
  email: 'mahbubalam002021@gmail.com',
} as const;

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E8E4DC] bg-[#FDFBF7] dark:bg-[#1A1A2E] dark:border-[#2D2D44] relative overflow-hidden text-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 lg:gap-x-10 xl:gap-x-12">
          {/* Column 1: Brand Identity + Explore */}
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1 min-w-0">
            <div className="flex flex-col gap-4">
              <Link to="/" className="group w-fit transition-opacity hover:opacity-80">
                <span className="font-serif text-xl font-bold text-[#C9A227] tracking-tight block leading-snug">
                  Conflict Resolution Institute
                </span>
              </Link>
              <p className="text-[#2C3E50]/90 dark:text-[#E8E8E8]/90 italic leading-relaxed text-sm">
                &ldquo;Resolving Conflicts, Restoring Humanity&rdquo;
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2 pt-6 border-t border-[#E8E4DC]/60 dark:border-[#2D2D44]/60">
              <h4 className="font-serif text-base font-bold text-[#2C3E50] dark:text-[#E8E8E8] relative w-fit pb-1 shrink-0">
                Explore
                <span className="absolute -bottom-0.5 left-0 w-8 h-0.5 bg-[#C9A227]" />
              </h4>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'All Categories', to: '/category/all' },
                  { label: 'Courses', to: '/courses' },
                  { label: 'Seminars', to: '/seminars' },
                  { label: 'About', to: '/about' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[#2C3E50]/90 hover:text-[#C9A227] dark:text-[#E8E8E8]/90 dark:hover:text-[#C9A227] transition-colors text-sm whitespace-nowrap"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Author Brief */}
          <div className="flex flex-col gap-3 min-w-0">
            <h4 className="font-serif text-base font-bold text-[#2C3E50] dark:text-[#E8E8E8] relative w-fit pb-1">
              About Author
              <span className="absolute -bottom-0.5 left-0 w-8 h-0.5 bg-[#C9A227]" />
            </h4>
            <div>
              <p className="font-serif font-bold text-[#2C3E50] dark:text-[#E8E8E8] text-base">
                {authorProfile.name}
              </p>
              <p className="text-[#8B4513] dark:text-[#C9A227] font-medium mt-1 leading-snug text-sm">
                {authorProfile.role}
              </p>
            </div>
            <div className="text-[#2C3E50]/90 dark:text-[#E8E8E8]/90 leading-relaxed text-sm space-y-0.5">
              {authorProfile.affiliations.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="text-[#8B4513]/90 dark:text-[#C9A227]/90 italic pt-2 border-t border-[#E8E4DC]/60 dark:border-[#2D2D44]/60 text-sm leading-relaxed">
              {authorProfile.focus}
            </p>
          </div>

          {/* Column 3: Qualifications & Contact */}
          <div className="flex flex-col gap-3 min-w-0">
            <h4 className="font-serif text-base font-bold text-[#2C3E50] dark:text-[#E8E8E8] relative w-fit pb-1">
              {authorProfile.academicHeading}
              <span className="absolute -bottom-0.5 left-0 w-8 h-0.5 bg-[#C9A227]" />
            </h4>
            <ul className="space-y-1.5 text-[#2C3E50]/90 dark:text-[#E8E8E8]/90 list-disc list-inside text-sm leading-relaxed">
              {authorProfile.academicAchievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="space-y-2 pt-2 border-t border-[#E8E4DC]/60 dark:border-[#2D2D44]/60 text-[#2C3E50]/90 dark:text-[#E8E8E8]/90 text-sm">
              <p className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-[#8B4513] dark:text-[#C9A227] shrink-0 mt-0.5" />
                <span className="leading-snug">{authorProfile.phone}</span>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-[#8B4513] dark:text-[#C9A227] shrink-0 mt-0.5" />
                <a
                  href={`mailto:${authorProfile.email}`}
                  className="hover:text-[#C9A227] hover:underline break-all leading-snug"
                >
                  {authorProfile.email}
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#E8E4DC] dark:border-[#2D2D44] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-wide text-[#2C3E50]/70 dark:text-[#E8E8E8]/70 text-center sm:text-left">
            &copy; {currentYear} Conflict Resolution Institute &middot; All Rights Reserved
          </p>
          <div className="flex items-center text-xs text-[#2C3E50]/70 dark:text-[#E8E8E8]/70">
            <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#E8E4DC]/30 dark:bg-[#2D2D44]/50 rounded-full">
              Crafted for readers <Heart className="h-2.5 w-2.5 text-red-500 fill-red-500 animate-pulse" />
            </span>
          </div>
        </div>

      </div>

      {/* Scaled-down ambient background blobs to match compact height */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A227] opacity-[0.02] blur-3xl -mr-24 -mt-24 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227] opacity-[0.01] blur-3xl -ml-24 -mb-24 pointer-events-none" />
    </footer>
  );
};