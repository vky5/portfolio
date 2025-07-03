"use client"

import { motion } from "framer-motion"
// Use React Icons for GitHub and LinkedIn
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { Mail, Phone, MapPin, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContactSlide() {
  const socialLinks = [
    { Icon: FaGithub, url: "https://github.com/yourusername", label: "GitHub" },
    { Icon: FaLinkedin, url: "https://linkedin.com/in/yourprofile", label: "LinkedIn" },
    { Icon: Globe, url: "https://yourwebsite.com", label: "Website" },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-light text-gray-800 mb-4">
          Let's <span className="text-orange-500">Build</span>
        </h1>
        <p className="text-lg text-gray-600">
          Ready to architect scalable solutions? Reach out below!
        </p>
      </motion.div>

      {/* Contact Info + Socials */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="flex items-center space-x-4">
            <Mail className="text-orange-500" />
            <span className="text-gray-700">hello@yourname.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="text-orange-500" />
            <span className="text-gray-700">+91 98765‑43210</span>
          </div>
          <div className="flex items-center space-x-4">
            <MapPin className="text-orange-500" />
            <span className="text-gray-700">Pauri, Uttarakhand, India</span>
          </div>

          {/* Social Links */}
          <motion.div
            className="flex space-x-6 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {socialLinks.map(({ Icon, url, label }, idx) => (
              <motion.a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-orange-500 text-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          className="bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-md space-y-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Input placeholder="Your Name" />
          <Input type="email" placeholder="Your Email" />
          <Textarea rows={4} placeholder="Your Message" />
          <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">
            Send Message
          </Button>
        </motion.form>
      </div>
    </div>
  )
}
