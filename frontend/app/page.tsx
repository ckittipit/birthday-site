"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef,  useState } from "react";
import CaspiaBouquet from "@/app/components/CaspiaBouquet";

type GreetingResponse = {
  title: string;
  message: string;
  signature: string;
  accent: string;
};

const particles = Array.from({ length: 20 }).map((_, index) => ({
  id: index,
  left: `${Math.random() * 100}%`,
  size: 8 + Math.random() * 14,
  delay: Math.random() * 9,
  duration: 10 + Math.random() * 8,
}));

export default function HomePage() {
  const [data, setData] = useState<GreetingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBouquet, setShowBouquet] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Unable to play audio:", error);
    }
  };

  useEffect(() => {
    const loadGreeting = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

        const response = await fetch(`${apiBaseUrl}/api/greeting`, {
          cache: "no-store",
        });
        const json = (await response.json()) as GreetingResponse;
        setData(json);
      } catch {
        setData({
          title: "Happy Birthday to You",
          message:
            "ขอให้ปีนี้เป็นปีที่เต็มไปด้วยรอยยิ้ม ความสำเร็จ และโมเมนต์น่ารัก ๆ เหมือนช่อดอกแคสเปียที่พลิ้วไหวอยู่ตรงหน้า",
          signature: "from someone who adores you",
          accent: "ดอกแคสเปียสีม่วง",
        });
      } finally {
        setLoading(false);
      }
    };

    void loadGreeting();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(241,228,255,0.92),_rgba(214,190,255,0.88),_rgba(125,84,192,0.88))] px-6 py-10 text-[--color-midnight]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.22),transparent_35%,rgba(255,255,255,0.08)_60%,transparent)]" />

      {particles.map((particle) => (
        <span
          key={particle.id}
          className="pointer-events-none absolute rounded-full bg-white/70 blur-[1px] animate-drift"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-4 py-2 text-sm backdrop-blur-md">
            <span className="inline-block h-2.5 w-2.5 animate-twinkle rounded-full bg-rose-500" />
            To Ratcha
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">
            {loading ? "Loading magic..." : data?.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[--color-midnight]/80 md:text-xl">
            {loading
              ? "กำลังเตรียมเซอร์ไพรส์วันเกิดให้หวานละมุนพร้อมอนิเมชันและช่อดอกไม้..."
              : data?.message}
          </p>

          {/* <div className="mt-8 flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-[--color-midnight] px-6 py-3 font-semibold text-white shadow-[--shadow-bloom]"
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
            >
              ดูคำอวยพรด้านล่าง
            </motion.button>

            <div className="rounded-full border border-white/60 bg-white/45 px-6 py-3 font-medium backdrop-blur-md">
              ไฮไลต์: {data?.accent ?? "ช่อดอกแคสเปีย"}
            </div>
          </div> */}

          {/* <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Sparkle Motion", "พื้นหลังและละอองแสงเคลื่อนไหวตลอดเวลา"],
              ["Bouquet Focus", "ช่อดอกแคสเปียแบบวาดด้วย CSS และ motion"],
              ["Go API Ready", "ดึงข้อความอวยพรจาก backend ได้ทันที"],
            ].map(([title, desc]) => (
              <motion.div
                key={title}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-white/50 bg-white/35 p-5 backdrop-blur-md shadow-[--shadow-bloom]"
              >
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-[--color-plum]">
                  {title}
                </div>
                <div className="mt-2 text-sm leading-6 text-[--color-midnight]/75">
                  {desc}
                </div>
              </motion.div>
            ))}
          </div> */}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />

          <div className="relative rounded-[2rem] border border-white/45 bg-white/20 p-6 shadow-[--shadow-bloom] backdrop-blur-md">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={async () => {
                setShowBouquet((prev) => !prev);

                const audio = audioRef.current;
                if (audio && !isPlaying) {
                  try {
                    await audio.play();
                    setIsPlaying(true);
                  } catch (error) {
                    console.error(error);
                  }
                }
              }}
              className="mx-auto mb-6 block rounded-full bg-[--color-midnight] px-6 py-3 font-semibold text-black shadow-[--shadow-bloom] cursor-pointer"
            >
              {showBouquet ? "Hide" : "Press here gently"}
            </motion.button>

            <AnimatePresence>
              {showBouquet && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <CaspiaBouquet />
                </motion.div>
              )}
            </AnimatePresence>

            {showBouquet && (
              <div className="mx-auto max-w-sm rounded-[2rem] border border-white/50 bg-white/45 p-5 text-center backdrop-blur-sm">
                <div className="text-sm uppercase tracking-[0.25em] text-[--color-plum]">
                  Wish Note
                </div>
                <p className="mt-3 text-base leading-7 text-[--color-midnight]/80">
                  สุขสันต์วันเกิดนะบิ้ว ขอให้ทุกวันหลังจากนี้มีแต่เรื่องดี ๆ คนดี ๆ
                  และความฝันที่ค่อย ๆ ผลิบานเหมือนดอกแคสเปียในช่อนี้
                </p>
                <div className="mt-4 text-sm font-semibold">
                  — {data?.signature ?? "Your secret admirer"}
                </div>
              </div>
            )}
            
          </div>
        </motion.section>
      </div>
      <audio ref={audioRef} loop preload="auto">
        <source src="/dieWithASmile.mp3" type="audio/mpeg" />
      </audio>

      {/* <section className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-white/40 bg-white/25 p-8 shadow-[--shadow-bloom] backdrop-blur-md">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-[--color-plum]">
              Personalize
            </div>
            <h2 className="mt-3 text-3xl font-black">
              ปรับเว็บนี้ให้เป็นของคนพิเศษได้ทันที
            </h2>
            <p className="mt-4 text-base leading-7 text-[--color-midnight]/80">
              แก้ข้อความอวยพร ชื่อผู้รับ สีของดอกไม้ เพิ่มเพลง
              หรือเปลี่ยนเป็นแบบหน้าเดียวสำหรับส่งลิงก์ก็ได้
              โครงนี้รองรับการต่อยอดทั้งฝั่ง frontend และ backend แล้ว
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "เปลี่ยนข้อความได้จาก Go API",
              "เพิ่มเพลงวันเกิดหรือเสียง ambience ได้",
              "ต่อยอดใส่แกลเลอรีรูปภาพและข้อความเซอร์ไพรส์ได้",
              "เหมาะกับ deploy แยก frontend/backend หรือผ่าน reverse proxy",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/50 bg-white/45 px-5 py-4 font-medium backdrop-blur-sm"
              >
                ✦ {item}
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </main>
  );
}