"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Clock, Music, Utensils, Users, Heart } from "lucide-react";
import { Fade } from "react-awesome-reveal";

import product1 from "@/assets/images/products/product1.png";
import product2 from "@/assets/images/products/product2.png";

const images = [product1, product2];

const STORAGE_KEY = "popup-closed";
const EXPIRATION_DATE = new Date("2026-10-15T23:59:59-06:00");


export default function EventPopup() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [indice, setIndice] = useState(0);



  useEffect(() => {
    setMounted(true);
    const now = new Date();
    if (now > EXPIRATION_DATE) return;
    const hasClosed = localStorage.getItem(STORAGE_KEY);
    if (!hasClosed) {
      setIsOpen(true);
    }

    const largo = images.length;

    let timerId = setInterval(() => {
      setIndice(e => e === largo - 1 ? 0 : e + 1);
    }, 3000);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[75vh] md:max-h-[90vh] overflow-y-auto bg-brand-white rounded-2xl shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-brand-dark/10 hover:bg-brand-dark/20 transition-colors z-10"
              aria-label="Close popup"
            >
              <X className="w-5 h-5 text-brand-dark" />
            </button>

            <div className="relative">
              <div className="bg-gradient-to-r from-brand-red to-brand-orange px-6 py-6">
                <h2 className="font-brand-heading text-3xl md:text-5xl font-bold text-brand-white ">
                  Wear the Cause
                </h2>
              </div>

              <div className="p-5 md:p-6 space-y-4">
                <p className="text-brand-dark/80 text-sm leading-relaxed">
                  Every purchase helps fund a national first responder suicide database, mental health support and suicide prevention efforts for first responders.

                </p>

                <div className="border-t border-brand-dark/10 pt-4">

                </div>

                <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-lg p-3">
                  <Fade key={indice}>
                    <img src={images[indice].src} className="m-auto"></img>
                  </Fade>
                </div>

                <div className="bg-brand-red/5 border border-brand-red/20 rounded-lg p-3">
                  <p className="font-brand-heading font-bold text-brand-dark text-sm text-center">
                    Help us to break the silence.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center pt-2">
                  <a
                    href="https://store.flareinitiative.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-brand-orange text-brand-white font-semibold text-sm rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-center"
                  >
                    Support Us
                  </a>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 bg-brand-dark/10 text-brand-dark font-semibold text-sm rounded-full hover:bg-brand-dark/20 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
