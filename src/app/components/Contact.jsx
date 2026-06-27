"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaPhone, FaEnvelope } from "react-icons/fa6";
import data from "../data/profile.json";

const CONTACT_CONFIG = [
  { key: "linkedin", icon: FaLinkedin, label: "LinkedIn", color: "#0A66C2", href: (v) => `https://www.linkedin.com/in/${v}` },
  { key: "github",   icon: FaGithub,   label: "GitHub",   color: "#ffffff",  href: (v) => `https://github.com/${v}` },
  { key: "phone",    icon: FaPhone,    label: "Phone",    color: "#12825F",  href: (v) => `tel:${v.replace(/\s/g, "")}` },
  { key: "email",    icon: FaEnvelope, label: "Email",    color: "#12825F",  href: (v) => `mailto:${v}` },
];

export default function Contact() {
  const contacts = CONTACT_CONFIG.map(({ key, icon, label, color, href }) => ({
    icon,
    label,
    color,
    value: data.contact[key],
    href: href(data.contact[key]),
  }));

  return (
    <motion.section
      id="contact"
      className="w-full pb-3"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
    >
      <p className="text-white/30 text-[12px] tracking-[0.25em] uppercase font-medium mb-6 text-center">
        Contact
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {contacts.map(({ icon: Icon, label, value, href, color }, idx) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 p-5 md:p-6 rounded-[18px] bg-[#18181B]/45 border border-white/5 hover:border-white/15 transition-colors duration-200 group"
          >
            <div
              className="size-10 rounded-xl flex items-center justify-center"
              style={{ background: `${color}18` }}
            >
              <Icon className="size-5" style={{ color }} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] md:text-[12px] text-white/35 font-medium tracking-wide uppercase">
                {label}
              </span>
              <span className="text-[13px] md:text-[14px] text-white/80 font-medium group-hover:text-white transition-colors duration-200 truncate">
                {value}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}
