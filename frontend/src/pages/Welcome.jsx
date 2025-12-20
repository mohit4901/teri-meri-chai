import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiInstagram, FiYoutube } from "react-icons/fi";

import SimpleCarousel from "../components/Carousel";
import heroBg from "../assets/tmc12.webp";
import { api } from "../utils/api"; // ✅ axios instance

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
      setReviews([res.data, ...reviews]);
      setForm({ name: "", stars: 5, text: "" });
    } catch (err) {
      console.error("Submit Review Error:", err);
    }
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
          <div className="relative z-20 flex flex-col items-center text-center px-4">
            <h2 className="whitespace-pre-line text-[26px] font-semibold leading-tight text-red-500 md:text-4xl md:w-5/12 lg:text-6xl lg:w-8/12">
              Better place to{"\n"}hangout
            </h2>

            <p className="mt-6 max-w-[220px] text-sm font-light text-gray-500 md:mt-10 md:max-w-md">
              For years, Ye Teri Meri Chai has been bringing people together over
              freshly brewed chai, comforting flavours, and moments worth
              sharing — delivered with warmth and care.
            </p>
          </div>

          <img
            src="https://b.zmtcdn.com/data/o2_assets/364f85b5586700f0a3f7108cedf543011739962117.png"
            alt=""
            className="absolute left-0 top-[30%] size-[90px] rounded-lg md:left-[-20px] md:size-[293px] xl:left-44"
          />

          <img
            src="https://b.zmtcdn.com/data/o2_assets/3d1b3a891e2c59fd5ae7654dd207370b1739514134.png"
            alt=""
            className="absolute right-0 top-0 h-[100px] w-[122px] rounded-lg md:right-[5%] md:h-52 md:w-72 xl:right-[15%]"
          />

          <img
            src="https://b.zmtcdn.com/data/o2_assets/c7523de995639024918c6947c4b2cdcd1742894059.png"
            alt=""
            className="absolute bottom-0 right-6 w-24 -rotate-12 rounded-lg md:right-[5%] md:h-48 md:w-72 xl:right-[15%]"
          />
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
    </>
  );
};

export default Welcome;

