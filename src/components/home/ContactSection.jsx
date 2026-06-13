"use client";
import { useState, useRef } from "react";
import { ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import SectionHeader from "@/components/shared/SectionHeader";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const loadTime = useRef(Date.now());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const submitData = {
      ...formData,
      timestamp: loadTime.current,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("[Contact Form] Submit failed:", err.message);
      setStatus("error");
      setErrorMessage(err.message || "Failed to send message. Please try again.");
    }
  };

  const isSuccess = status === "success";

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#f8f7f5]">
      <Fade triggerOnce duration={800}>
        <div className="container mx-auto px-6 max-w-2xl">
          <SectionHeader title="Contact Us" />

          {isSuccess ? (
            <div className="mt-10 text-center py-12 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
              <p className="text-green-700">
                Thank you for reaching out. We&apos;ll get back to you soon.
              </p>
              <p className="text-green-600 text-sm mt-2">
                We have sent you a confirmation email. If you don&apos;t see it, please check your spam folder.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm text-green-600 underline hover:text-green-800"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 mt-10" aria-label="Contact form">
              <div aria-hidden="true" className="h-0 min-h-0 overflow-hidden opacity-0 pointer-events-none" style={{ position: "fixed", top: "-100vh", left: 0 }}>
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-semibold text-brand-dark uppercase tracking-widest font-brand">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="E.g. John Doe"
                  required
                  disabled={status === "loading"}
                  className="w-full px-0 py-3 border-0 border-b border-brand-dark/20 bg-transparent text-brand-dark placeholder:text-brand-dark/30 outline-none focus:border-brand-dark font-brand text-base transition-colors duration-200 disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-brand-dark uppercase tracking-widest font-brand">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E.g. johndoe@mail.com"
                  required
                  disabled={status === "loading"}
                  className="w-full px-0 py-3 border-0 border-b border-brand-dark/20 bg-transparent text-brand-dark placeholder:text-brand-dark/30 outline-none focus:border-brand-dark font-brand text-base transition-colors duration-200 disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-sm font-semibold text-brand-dark uppercase tracking-widest font-brand">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Hello, I would like to know more about your initiative..."
                  required
                  disabled={status === "loading"}
                  className="w-full px-0 py-3 border-0 border-b border-brand-dark/20 bg-transparent text-brand-dark placeholder:text-brand-dark/30 outline-none focus:border-brand-dark font-brand text-base resize-none transition-colors duration-200 disabled:opacity-50"
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-600 text-sm py-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full px-8 py-4 bg-brand-dark text-white font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-brand-dark/40 text-center font-brand pt-2 leading-relaxed">
                Your message and email address are received to respond to your inquiry.
                Not stored or shared with third parties.
              </p>

              <div className="flex items-center justify-center gap-6 pt-4">
                <a
                  href="https://www.instagram.com/the_flare_initiative/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dark/30 hover:text-brand-dark/60 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/flare-initiative/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dark/30 hover:text-brand-dark/60 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </form>
          )}
        </div>
      </Fade>
    </section>
  );
}
