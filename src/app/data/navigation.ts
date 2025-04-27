// src/data/navigation.ts

export interface NavigationLink {
  name: string;
  url: string;
  isExternal?: boolean;
}

export interface NavigationGroup {
  title: string;
  links: NavigationLink[];
}

// Main navigation links used in both navbar and footer
export const mainNavLinks: NavigationLink[] = [{ name: "Home", url: "/" }];

// Additional links for footer only
export const resourceLinks: NavigationLink[] = [
  { name: "Blog", url: "/blog" },
  { name: "Portfolio", url: "/projects" },
  { name: "Resume", url: "/resume", isExternal: true },
];

// Organized footer link groups
export const footerLinkGroups: NavigationGroup[] = [
  {
    title: "Navigation",
    links: mainNavLinks,
  },
  {
    title: "Resources",
    links: resourceLinks,
  },
];
