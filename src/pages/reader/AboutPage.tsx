import type { ComponentType, ReactNode } from 'react';
import {
  BookOpen,
  Target,
  Eye,
  GraduationCap,
  Users,
  Mail,
} from 'lucide-react';

const learningOutcomes = [
  'To develop knowledge, skills, values, attitudes, and practical competencies that enable them to manage and transform conflicts peacefully and constructively.',
  'To foster mutual respect, tolerance, and cooperation among people of different religions, cultures, ethnicities, and social backgrounds irrespective of nationalities.',
  'To uphold justice, compassion, reconciliation, and peaceful dialogue across the world and to fulfill the requirements of sustainable development goals (especially SDG-16).',
] as const;

const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) => (
  <section className="bg-white dark:bg-[#16213E] rounded-2xl p-8 md:p-10 border border-[#E8E4DC] dark:border-[#2D2D44]">
    <div className="flex items-start gap-4 mb-6">
      <div className="shrink-0 w-11 h-11 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-lg flex items-center justify-center">
        <Icon className="h-5 w-5 text-[#C9A227]" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] pt-1">
        {title}
      </h2>
    </div>
    {children}
  </section>
);

export const AboutPage = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-full mb-6">
            <BookOpen className="h-10 w-10 text-[#C9A227]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6">
            About Conflict Resolution Institute
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#C9A227] italic max-w-3xl mx-auto">
            &ldquo;Resolving Conflicts, Restoring Humanity&rdquo;
          </p>
        </div>

        <div className="space-y-10">
          {/* Mission */}
          <SectionCard title="Mission" icon={Target}>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] leading-relaxed text-lg">
              To advance peaceful &amp; constructive conflict resolution through education,
              training, research, and community engagement by developing skilled mediators,
              promoting dialogue, and supporting sustainable peace at local, national, and
              global levels.
            </p>
          </SectionCard>

          {/* Vision */}
          <SectionCard title="Vision" icon={Eye}>
            <div className="space-y-6 text-[#5D6D7E] dark:text-[#B8B8B8] leading-relaxed">
              <p className="text-lg">
                To be a globally recognized center of excellence in peace-building, mediation,
                and conflict transformation, fostering a just, harmonious, and peaceful society.
              </p>
            </div>
          </SectionCard>

          {/* Learning Outcomes */}
          <SectionCard title="Learning Outcomes" icon={GraduationCap}>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] leading-relaxed mb-6">
              The learning outcomes of this Conflict Resolution Institute are designed so that
              learners will be able to:
            </p>
            <ol className="space-y-4 list-none">
              {learningOutcomes.map((outcome, index) => (
                <li
                  key={outcome}
                  className="flex gap-4 text-[#5D6D7E] dark:text-[#B8B8B8] leading-relaxed"
                >
                  <span className="shrink-0 font-serif font-bold text-[#C9A227] w-6">
                    {['i', 'ii', 'iii'][index]}.
                  </span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ol>
          </SectionCard>

          {/* Eligible Candidates */}
          <SectionCard title="Eligible Candidates/Participants" icon={Users}>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] leading-relaxed text-lg">
              To equip students, teachers, NGO workers, volunteers, leaders, professionals, administrators
              and civil communities i.e. global citizens with theoretical and empirical knowledge of conflict-prevention-management and conflict transformation skills.
            </p>
          </SectionCard>
        </div>

        {/* Contact */}
        <section className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#2C3E50] to-[#5D6D7E] dark:from-[#16213E] dark:to-[#1A1A2E] rounded-2xl p-8 md:p-12">
            <Mail className="h-10 w-10 text-[#C9A227] mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-white/70 mb-6 max-w-lg mx-auto">
              Interested in our seminars, courses, or peace-building programs? We would be glad
              to hear from you.
            </p>
            <a
              href="mailto:mahbubalam002021@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A227] text-[#1A1A2E] font-medium rounded-lg hover:bg-[#b8941f] transition-colors"
            >
              <Mail className="h-4 w-4" />
              mahbubalam002021@gmail.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
