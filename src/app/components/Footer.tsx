"use client";

import { Mulish } from "next/font/google";
import { useState, useEffect } from "react";
import { socialLinks, SocialLink } from "../data/socials";
import { footerLinkGroups } from "../data/navigation";
import { WEBSITE_NAME, WEBSITE_DESCRIPTION } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const mulish = Mulish({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface FooterProps {
  backgroundImage?: string;
  backgroundOverlay?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Footer({
  backgroundImage = "/blank-sand.jpg",
  backgroundOverlay = "bg-white/90",
}: FooterProps) {
  const [imageLoaded, setImageLoaded] = useState(!backgroundImage);
  const [currentYear] = useState(new Date().getFullYear());
  const [email, setEmail] = useState("");

  // Filter out empty navigation groups (ones with no links)
  const visibleGroups = footerLinkGroups.filter(
    (group) => group.links.length > 0
  );
  const totalGroups = visibleGroups.length;

  // Compute the grid layout based on number of navigation groups
  const getGridLayoutClass = () => {
    // Always include the about section and newsletter, so count them
    const totalSections = totalGroups + 2;

    switch (totalSections) {
      case 2: // Just about and newsletter
        return "grid-cols-1 md:grid-cols-2";
      case 3: // About, one nav group, and newsletter
        return "grid-cols-1 md:grid-cols-3";
      case 4: // About, two nav groups, and newsletter
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      case 5: // About, three nav groups, and newsletter
        return "grid-cols-1 md:grid-cols-3 lg:grid-cols-5";
      default: // Fallback for more groups or fewer (shouldn't happen)
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    }
  };

  // Compute width span for about and newsletter sections
  const getSpanClass = () => {
    if (totalGroups === 0) return "col-span-1 md:col-span-1";
    return "col-span-1";
  };

  // Preload background image
  useEffect(() => {
    if (!backgroundImage) return;

    const img = new globalThis.Image();
    img.src = backgroundImage;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.error("Failed to load footer background image");
      setImageLoaded(true);
    };
  }, [backgroundImage]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Newsletter signup coming soon!");
  };

  return (
    <footer
      className={`${mulish.className} relative text-gray-800 dark:text-white py-12 mt-16 overflow-hidden`}
    >
      {/* Background with fade in effect */}
      {backgroundImage && (
        <div
          className={`absolute inset-0 w-full h-full z-0 transition-opacity duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
            quality={85}
          />
        </div>
      )}

      {/* Background overlay */}
      <div
        className={`absolute inset-0 w-full h-full z-1 ${
          backgroundImage
            ? backgroundOverlay + " dark:bg-gray-900/95"
            : "bg-gray-100 dark:bg-gray-900"
        }`}
        aria-hidden="true"
      />

      {/* Footer content */}
      <motion.div
        className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div
          className={`grid ${getGridLayoutClass()} gap-x-8 gap-y-12 pb-10 border-b border-gray-300/70 dark:border-gray-700/70`}
        >
          {/* About Section - Always present */}
          <motion.div variants={fadeInUp} className={getSpanClass()}>
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500">
              {WEBSITE_NAME}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
              {WEBSITE_DESCRIPTION}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social: SocialLink) => (
                <a
                  key={social.name}
                  href={social.url}
                  aria-label={`Connect on ${social.name}`}
                  className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gray-200/80 dark:bg-gray-800/80 flex items-center justify-center group-hover:bg-blue-500 dark:group-hover:bg-blue-600 transition-all duration-300"
                    whileHover={{
                      scale: 1.08,
                      boxShadow: "0 0 12px rgba(59, 130, 246, 0.5)",
                    }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Image
                      src={social.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="object-contain group-hover:brightness-[10] dark:group-hover:brightness-[1.5] transition-all duration-300"
                    />
                  </motion.div>

                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links - Only render groups with links */}
          {visibleGroups.map((section) => (
            <motion.div
              key={section.title}
              variants={fadeInUp}
              className={getSpanClass()}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.isExternal ? (
                      <a
                        href={link.url}
                        className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors duration-300 inline-flex items-center group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{link.name}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 ml-1 opacity-70 group-hover:translate-x-0.5 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={link.url}
                        className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors duration-300 inline-block py-0.5"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter Signup - Always present */}
          <motion.div variants={fadeInUp} className={getSpanClass()}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Sign up to receive updates on new projects, articles, and
              announcements.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/70 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row justify-between items-center pt-8 mt-4"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 md:mb-0">
            &copy; {currentYear} {WEBSITE_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <Link
              href="/privacy"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-200"
            >
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
