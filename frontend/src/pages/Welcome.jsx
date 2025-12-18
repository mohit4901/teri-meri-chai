import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiInstagram, FiYoutube } from "react-icons/fi";
import SimpleCarousel from "../components/Carousel";

import heroBg from "../assets/tmc12.webp";


const API = "http://localhost:4000/api/reviews";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Welcome = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", stars: 5, text: "" });

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then(setReviews)
      .catch(console.error);
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!form.name || !form.text) return;

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setReviews([data, ...reviews]);
    setForm({ name: "", stars: 5, text: "" });
  };

  return (
    <div className="w-full overflow-hidden">

      {/* HERO */}
      <section
        className="min-h-[100svh] flex mb-[100px] items-center justify-center relative"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
          YE TERI MERI CHAI
          </h1>
          <p className="mb-8 text-gray-200">
            Fresh • Delicious • Fast Delivery
          </p>
          <Link
            to="/menu"
            className="bg-black px-8 py-3 rounded-lg font-serif"
          >
            View Menu
          </Link>
        </motion.div>
      </section>

      {/* MID CAROUSEL */}
      <section className="w-[95%] ml-[12px]">
      <h1 className="text-3xl md:text-3xl ml-[135px] font-bold mb-4">
          Latest Offers✨
          </h1>
        <div className="max-w-5xl mx-auto h-[250px]">
          <SimpleCarousel />
        </div>
      </section>



      {/* SOCIAL */}
      <section className="mt-[50px] py-10 border rounded-2xl w-[25rem] ml-[3rem] text-center mb-[50px]">
        <h2 className="text-3xl font-bold mb-6">
          Follow Us
        </h2>
        <div className="flex justify-center gap-6">
          <a className="px-6 py-3 border rounded-xl flex gap-2 items-center">
            <FiInstagram /> Instagram
          </a>
          <a className="px-6 py-3 bg-black text-white rounded-xl flex gap-2 items-center">
            <FiYoutube /> YouTube
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6">

          {/* FORM */}
          <form
            onSubmit={submitReview}
            className="bg-white text-black p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-serif mb-6">
              Leave a Review
            </h3>

            <input
              className="w-full border p-3 mb-4 rounded"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() =>
                    setForm({ ...form, stars: s })
                  }
                  className={
                    s <= form.stars
                      ? "text-yellow-500 text-xl"
                      : "text-gray-400 text-xl"
                  }
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full border p-3 mb-4 rounded"
              placeholder="Your Review"
              rows="4"
              value={form.text}
              onChange={(e) =>
                setForm({ ...form, text: e.target.value })
              }
            />

            <button className="bg-black text-white px-6 py-3 rounded">
              Submit Review
            </button>
          </form>

          {/* INFINITE SCROLLER */}
          <div className="overflow-hidden">
            <div className="flex gap-6 animate-scroll">
              {[...reviews, ...reviews].map((r, i) => (
                <div
                  key={i}
                  className="min-w-[260px] bg-white text-black p-4 rounded-xl"
                >
                  <h4 className="font-bold">{r.name}</h4>
                  <div className="text-yellow-500">
                    {"★".repeat(r.stars)}
                  </div>
                  <p className="text-sm">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
      {/* ================= FOOTER ================= */}
<footer className="bg-black text-gray-300 pt-16">
  <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-4">

    {/* Brand */}
    <div>
      <h3 className="text-2xl font-serif font-bold text-white mb-4">
        Teri Meri Chai
      </h3>
      <p className="text-sm leading-relaxed">
        Authentic Chinese cuisine made with premium ingredients,
        bold flavours and fast delivery.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-lg font-serif font-bold text-white mb-4">
        Quick Links
      </h4>
      <ul className="space-y-2 text-sm">
        <li>
          <Link to="/menu" className="hover:text-white transition">
            Menu
          </Link>
        </li>
        <li>
          <Link to="/cart" className="hover:text-white transition">
            Order Now
          </Link>
        </li>
        <li>
          <Link to="/" className="hover:text-white transition">
            About Us
          </Link>
        </li>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h4 className="text-lg font-serif font-bold text-white mb-4">
        Contact
      </h4>
      <ul className="space-y-2 text-sm">
        <li>📍 Haryana, India</li>
        <li>📞 +91 99999 88888</li>
        <li>✉️ support@terimerichai.com</li>
      </ul>
    </div>

    {/* Social */}
    <div>
      <h4 className="text-lg font-serif font-bold text-white mb-4">
        Follow Us
      </h4>
      <div className="flex gap-4">
        <a
          href="https://www.instagram.com/yourpage"
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:bg-white hover:text-black transition"
        >
          <FiInstagram />
        </a>
        <a
          href="https://www.youtube.com/@yourchannel"
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:bg-white hover:text-black transition"
        >
          <FiYoutube />
        </a>
      </div>
    </div>

  </div>

  {/* Bottom Bar */}
  <div className="border-t border-gray-700 mt-12 py-6 text-center text-sm text-gray-400">
    © {new Date().getFullYear()} Teri Meri Chai. All rights reserved.
  </div>
  <div className="pb-6 text-center text-sm text-gray-400">
    Designed with ❤️ by Mohit Mudgil
  </div>
</footer>

    </div>
  );
};

export default Welcome;
