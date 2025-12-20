import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiInstagram, FiYoutube } from "react-icons/fi";

import SimpleCarousel from "../components/Carousel";
import heroBg from "../assets/tmc12.webp";
import api from "../services/api"; // ✅ FIXED (IMPORTANT)

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Welcome = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", stars: 5, text: "" });

  // ================= FETCH REVIEWS =================
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/api/reviews");
        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Review Fetch Error:", err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, []);

  // ================= SUBMIT REVIEW =================
  const submitReview = async (e) => {
    e.preventDefault();
    if (!form.name || !form.text) return;

    try {
      const res = await api.post("/api/reviews", form);
      setReviews((prev) => [res.data, ...prev]);
      setForm({ name: "", stars: 5, text: "" });
    } catch (err) {
      console.error("Submit Review Error:", err);
    }
  };

  return (
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

      {/* ================= REVIEWS ================= */}
      <section className="py-20 bg-black text-white px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-center">

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
                    <p className="text-sm text-gray-700">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Welcome;

