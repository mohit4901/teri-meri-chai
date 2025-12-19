import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiInstagram, FiYoutube } from "react-icons/fi";

import SimpleCarousel from "../components/Carousel";
import heroBg from "../assets/tmc12.webp";

const API = `${import.meta.env.VITE_API_URL}/api/reviews`;


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
    <>

      <div className="w-full overflow-hidden">

        {/* ================= HERO ================= */}
        <section
          className="relative min-h-[100svh] flex items-center justify-center"
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
            className="relative z-10 text-center text-white px-4 max-w-xl"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Ye Teri Meri Chai
            </h1>
            <p className="mb-8 text-gray-200">
              Fresh Chai • Quick Bites • Fast Delivery
            </p>
            <Link
              to="/menu"
              className="inline-block bg-black px-8 py-3 rounded-lg font-serif"
            >
              View Menu
            </Link>
          </motion.div>
        </section>

        {/* ================= OFFERS ================= */}
        <section className="py-20 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Latest Offers ✨
          </h2>
          <div className="max-w-5xl mx-auto h-[220px] sm:h-[250px]">
            <SimpleCarousel />
          </div>
        </section>

       {/* ================= FLOATING BRAND HERO ================= */}
<section className="relative w-full overflow-hidden bg-white py-32">
  {/* Center Content */}
  <div className="relative z-20 flex flex-col items-center text-center px-4">
    <h2 className="whitespace-pre-line text-[26px] font-semibold leading-tight text-red-500
                   md:text-4xl md:w-5/12
                   lg:text-6xl lg:w-8/12">
      Better place to{"\n"}hangout
    </h2>

    <p className="mt-6 max-w-[220px] text-sm font-light text-gray-500
                  md:mt-10 md:max-w-md">
     For years, Ye Teri Meri Chai has been bringing people together over freshly brewed chai, comforting flavours, and moments worth sharing — delivered with warmth and care.
    </p>
  </div>

  {/* Decorative Small Icons */}
  <img
    src="https://b.zmtcdn.com/data/o2_assets/70b50e1a48a82437bfa2bed925b862701742892555.png"
    alt=""
    className="absolute top-10 right-[70%] w-6 rotate-2"
  />

  <img
    src="https://b.zmtcdn.com/data/o2_assets/9ef1cc6ecf1d92798507ffad71e9492d1742892584.png"
    alt=""
    className="absolute top-[50%] right-8 w-6 rotate-45"
  />

  <img
    src="https://b.zmtcdn.com/data/o2_assets/9ef1cc6ecf1d92798507ffad71e9492d1742892584.png"
    alt=""
    className="absolute bottom-8 left-[10%] w-6 -rotate-2"
  />

  {/* Left Large Image (Burger style) */}
  <img
    src="https://b.zmtcdn.com/data/o2_assets/364f85b5586700f0a3f7108cedf543011739962117.png"
    alt=""
    className="absolute left-0 top-[30%] size-[90px] rounded-lg
               transition-all duration-[1500ms]
               md:left-[-20px] md:size-[293px]
               xl:left-44"
  />

  {/* Right Top Image (Dimsum style) */}
  <img
    src="https://b.zmtcdn.com/data/o2_assets/3d1b3a891e2c59fd5ae7654dd207370b1739514134.png"
    alt=""
    className="absolute right-0 top-0 h-[100px] w-[122px] rounded-lg
               transition-all duration-[1500ms]
               md:right-[5%] md:h-52 md:w-72
               xl:right-[15%]"
  />

  {/* Right Bottom Image (Pizza style) */}
  <img
    src="https://b.zmtcdn.com/data/o2_assets/c7523de995639024918c6947c4b2cdcd1742894059.png"
    alt=""
    className="absolute bottom-0 right-6 w-24 -rotate-12 rounded-lg
               transition-all duration-[1500ms]
               md:right-[5%] md:h-48 md:w-72
               xl:right-[15%]"
  />
</section>

        {/* ================= FOLLOW US ================= */}
        <section className="py-16 px-4">
          <div className="max-w-md mx-auto border rounded-2xl text-center p-8">
            <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://www.instagram.com/yeterimeri_chai/"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 border rounded-xl flex gap-2 items-center justify-center hover:bg-black hover:text-white transition"
              >
                <FiInstagram /> Instagram
              </a>
              <a
                href="https://www.youtube.com/@Ye_TMC"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-black text-white rounded-xl flex gap-2 items-center justify-center hover:opacity-80 transition"
              >
                <FiYoutube /> YouTube
              </a>
            </div>
          </div>
        </section>

        {/* ================= ZOMATO CTA ================= */}
        <section className="bg-black py-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-white text-center px-4"
          >
             <h2 className="text-[22px] sm:text-[26px] font-semibold mb-4">
            Ye Teri Meri Chai is also on 
            </h2>
             <img
              src="https://b.zmtcdn.com/web_assets/8313a97515fcb0447d2d77c276532a511583262271.png"
              alt="Order Teri Meri Chai on Zomato"
              className="h-8 w-[152px] mb-10"
            />
            <h2 className="text-[22px] sm:text-[26px] font-semibold mb-4">
            Panipat's Best Cafe
            </h2>
            <p className="text-sm text-gray-300 max-w-sm">
              Experience fast & easy online ordering from Teri Meri Chai
            </p>
            <a
              href="https://www.zomato.com/panipat/ye-teri-meri-chai-tehsil-camp"
              target="_blank"
              rel="noreferrer"
              className="w-full flex justify-center"
            >
              <button className="mt-10 w-[90vw] max-w-sm rounded-xl bg-red-600 px-5 py-3 hover:bg-red-700 transition">
                Order on App
              </button>
            </a>
          </motion.div>
        </section>

        {/* ================= LOCATION ================= */}
        <section className="py-24 px-4 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Visit Ye Teri Meri Chai ☕
              </h2>
              <p className="text-gray-600 mb-4">
                Fateh Puri Chowk, Panipat – the perfect stop for chai lovers.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>📍 Panipat, Haryana 132103</li>
                <li>⏰ Open Daily: 7 AM – 11 PM</li>
              </ul>
              <a
                href="https://www.google.com/maps?q=Ye+Teri+Meri+Chai,+Fateh+Puri+Chowk,+Panipat,+Haryana+132103"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
              >
                Get Directions
              </a>
            </div>

            <div className="w-full h-[300px] md:h-[350px] rounded-2xl overflow-hidden shadow-lg">
              <iframe
                title="Ye Teri Meri Chai Location"
                src="https://www.google.com/maps?q=Ye+Teri+Meri+Chai,+Fateh+Puri+Chowk,+Panipat,+Haryana+132103&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </motion.div>
        </section>

    {/* ================= REVIEWS ================= */}
<section className="py-20 bg-black text-white px-4 overflow-hidden">
  <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-center">

    {/* Review Form */}
    <form
      onSubmit={submitReview}
      className="bg-white text-black p-8 rounded-2xl"
    >
      <h3 className="text-2xl mb-6 font-serif">Leave a Review</h3>

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
            key={s}
            type="button"
            onClick={() => setForm({ ...form, stars: s })}
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

    {/* Infinite X-axis Reviews */}
    <div className="relative overflow-hidden w-full">
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-center">
          No reviews yet. Be the first to share your chai moment ☕
        </p>
      ) : (
        <div className="marquee gap-6">
          {[...reviews, ...reviews].map((r, i) => (
            <div
              key={i}
              className="min-w-[260px] bg-white text-black p-4 rounded-xl shadow-md"
            >
              <h4 className="font-bold">{r.name}</h4>

              <div className="text-yellow-500 mb-1">
                {"★".repeat(r.stars)}
              </div>

              <p className="text-sm text-gray-700">
                {r.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

  </div>
</section>


        {/* ================= FOOTER ================= */}
        <footer className="bg-black text-gray-300 pt-16">
          <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Ye Teri Meri Chai
              </h3>
              <p className="text-sm">Fresh chai & quick bites.</p>
            </div>

            <div>
              <h4 className="text-lg text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/cart">Order Now</Link></li>
                <li><Link to="/">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>📍 Panipat, Haryana</li>
                <li>📞 +91 870-8256259
</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg text-white mb-4">Follow</h4>
              <div className="flex gap-4">
                <FiInstagram />
                <FiYoutube />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 py-6 text-center text-sm">
            © {new Date().getFullYear()} Ye Teri Meri Chai
            <p>Designed with ❤️ by Mohit Mudgil</p>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Welcome;
