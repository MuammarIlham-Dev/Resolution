import { BookOpen, Pen, Users, Heart, Mail } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-full mb-6">
            <BookOpen className="h-10 w-10 text-[#C9A227]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6">
            About Resolution
          </h1>
          <p className="text-xl text-[#5D6D7E] dark:text-[#B8B8B8] max-w-2xl mx-auto">
            A literary blog designed like a digital book, offering a serene reading experience
            for those who appreciate the art of storytelling.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="bg-white dark:bg-[#16213E] rounded-2xl p-8 md:p-12 border border-[#E8E4DC] dark:border-[#2D2D44]">
            <h2 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6">
              Our Mission
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
                Resolution was born from a simple belief: in an age of fleeting content and
                endless scrolling, there remains a place for thoughtful, well-crafted writing.
                We aim to create a digital sanctuary where stories can breathe, ideas can flourish,
                and readers can immerse themselves in meaningful narratives.
              </p>
              <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
                Our platform is designed with the reader in mind—clean typography, distraction-free
                reading, and a book-like aesthetic that honors the timeless tradition of storytelling.
                Whether you&apos;re here for a quick read or a deep dive into a subject, Resolution
                offers content that informs, inspires, and entertains.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-8 text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:gap-10 gap-6">
            <div className="bg-white dark:bg-[#16213E] rounded-xl p-6 border border-[#E8E4DC] dark:border-[#2D2D44] text-center">
              <div className="w-12 h-12 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Pen className="h-6 w-6 text-[#C9A227]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
                Quality Writing
              </h3>
              <p className="text-sm text-[#5D6D7E] dark:text-[#B8B8B8]">
                Carefully curated content from passionate writers and storytellers
              </p>
            </div>

            <div className="bg-white dark:bg-[#16213E] rounded-xl p-6 border border-[#E8E4DC] dark:border-[#2D2D44] text-center">
              <div className="w-12 h-12 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-[#C9A227]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
                Community
              </h3>
              <p className="text-sm text-[#5D6D7E] dark:text-[#B8B8B8]">
                Engage with fellow readers through comments and discussions
              </p>
            </div>

            <div className="bg-white dark:bg-[#16213E] rounded-xl p-6 border border-[#E8E4DC] dark:border-[#2D2D44] text-center">
              <div className="w-12 h-12 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-[#C9A227]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
                Made with Love
              </h3>
              <p className="text-sm text-[#5D6D7E] dark:text-[#B8B8B8]">
                Built by readers, for readers, with attention to every detail
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-[#2C3E50] to-[#5D6D7E] dark:from-[#16213E] dark:to-[#1A1A2E] rounded-2xl p-8 md:p-12">
            <Mail className="h-10 w-10 text-[#C9A227] mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-white/70 mb-6 max-w-lg mx-auto">
              Have a story to share or want to collaborate? We&apos;d love to hear from you.
              Reach out to us and let&apos;s create something beautiful together.
            </p>
            <a
              href="mailto:hello@resolution.blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A227] text-[#1A1A2E] font-medium rounded-lg hover:bg-[#b8941f] transition-colors"
            >
              <Mail className="h-4 w-4" />
              hello@resolution.blog
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
