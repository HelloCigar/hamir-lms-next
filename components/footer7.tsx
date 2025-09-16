import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import Logo from '@/public/file.svg'
import Image from "next/image";


interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSocialLinks = [
  { icon: <FaGithub className="size-5" />, href: "https://github.com/HelloCigar/", label: "Github" },
  { icon: <FaLinkedin className="size-5" />, href: "https://www.linkedin.com/in/john-hamir/", label: "LinkedIn" },
  { icon: <FaFacebook className="size-5" />, href: "https://www.facebook.com/John.Hamir.5/", label: "Facebook" },
  { icon: <FaInstagram className="size-5" />, href: "https://www.instagram.com/johnhamir/", label: "Instagram" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

const Footer7 = ({
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "@/public/file.svg",
    alt: "logo",
    title: "Hamir LMS",
  },
  description = "Built with 💖 by John Hamir Karim",
  socialLinks = defaultSocialLinks,
  copyright = "© 2025 hamir-lms.netlify.app. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <section className="pt-60">
      <div className="container">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <Image src={Logo} width={32} height={32} alt="Logo"/>
              <h2 className="text-xl font-semibold">{logo.title}</h2>
            </div>
            <p className="text-muted-foreground max-w-[70%] text-sm">
              {description}
            </p>
            <ul className="text-muted-foreground flex items-center space-x-6">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="hover:text-primary font-medium">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-muted-foreground mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export { Footer7 };
