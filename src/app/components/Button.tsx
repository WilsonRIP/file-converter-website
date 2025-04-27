"use client";

import { motion, Transition } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import { Poetsen_One } from "next/font/google";

const poetsen = Poetsen_One({
  weight: "400",
  subsets: ["latin"],
});

// simple size presets (padding + base font size)
const sizeStyles: Record<"sm" | "md" | "lg", string> = {
  sm: "py-2 px-4 text-sm",
  md: "py-4 px-8 text-base",
  lg: "py-6 px-12 text-lg",
};

export type ButtonProps = {
  /** If provided, renders as a link */
  href?: string;
  /** onClick handler (ignored if href is set) */
  onClick?: () => void;
  /** Button contents */
  children: ReactNode;

  /** Size preset: controls padding + font-size */
  size?: keyof typeof sizeStyles;

  /** Background color (Tailwind class, e.g. "bg-green-300") */
  bgClass?: string;
  /** Text color (Tailwind class, e.g. "text-white") */
  textClass?: string;
  /** Border radius (Tailwind class, e.g. "rounded-lg") */
  radiusClass?: string;

  /** Hover / Tap scales */
  hoverScale?: number;
  tapScale?: number;

  /** Transition config */
  transitionType?: "tween" | "spring";
  transitionDuration?: number; // in seconds

  /** Additional custom classes */
  className?: string;
  /** Extra inline styles */
  styleOverrides?: React.CSSProperties;

  /** Native button type (ignored if href is set) */
  type?: "button" | "submit" | "reset";
};

export default function Button({
  href,
  onClick,
  children,
  size = "md",
  bgClass = "bg-green-300",
  textClass = "text-gray-800",
  radiusClass = "rounded-lg",
  hoverScale = 1.2,
  tapScale = 0.95,
  transitionType = "spring",
  transitionDuration = 0.3,
  className = "",
  styleOverrides = {},
  type = "button",
}: ButtonProps) {
  // Build the Framer Motion transition object
  const transition: Transition =
    transitionType === "spring"
      ? {
          type: "spring",
          duration: transitionDuration,
          stiffness: 300,
          damping: 20,
        }
      : { type: "tween", duration: transitionDuration };

  // Decide which tag to render
  const MotionTag = href ? motion(Link) : motion.button;

  // Common props for Link vs button
  const tagProps = href ? { href } : { onClick, type };

  return (
    <MotionTag
      {...tagProps}
      className={`
        ${poetsen.className}
        inline-block
        font-semibold
        cursor-pointer
        transition-transform
        duration-200

        ${sizeStyles[size]}
        ${bgClass}
        ${textClass}
        ${radiusClass}

        ${className}
      `}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={transition}
      style={styleOverrides}
    >
      {children}
    </MotionTag>
  );
}
