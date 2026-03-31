"use client";

import { motion } from "framer-motion";

const stems = [
    { left: "50%", height: 220, rotate: -2 },
    { left: "42%", height: 210, rotate: -11 },
    { left: "58%", height: 212, rotate: 12 },
    { left: "34%", height: 190, rotate: -20 },
    { left: "66%", height: 194, rotate: 20 },
    { left: "27%", height: 170, rotate: -28 },
    { left: "73%", height: 172, rotate: 28 },
];

const blossomGroups = [
    { left: "28%", top: "14%", scale: 0.9 },
    { left: "38%", top: "8%", scale: 1.1 },
    { left: "50%", top: "4%", scale: 1.2 },
    { left: "61%", top: "10%", scale: 1.05 },
    { left: "73%", top: "18%", scale: 0.92 },
    { left: "20%", top: "23%", scale: 0.8 },
    { left: "80%", top: "26%", scale: 0.78 },
];

function MiniBloom({ delay = 0 }: { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.5, 1, 0.75], scale: [0.95, 1.08, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, delay }}
            className="relative h-5 w-5"
        >
            <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/90 blur-[1px]" />
            <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-lilac/95" />
            <span className="absolute right-0 top-1.5 h-2.5 w-2.5 rounded-full bg-violet-200/95" />
            <span className="absolute bottom-0 left-1.5 h-2.5 w-2.5 rounded-full bg-purple-200/95" />
            <span className="absolute bottom-0 right-1.5 h-2.5 w-2.5 rounded-full bg-fuchsia-200/95" />
            <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white/95" />
        </motion.div>
    );
}

export default function CaspiaBouquet() {
    return (
        <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative mx-auto h-[420px] w-[280px] animate-sway"
        >
        <div className="absolute inset-x-0 top-6 h-[250px]">
            {stems.map((stem, index) => (
            <span
                key={index}
                className="absolute bottom-0 block w-[3px] origin-bottom rounded-full bg-gradient-to-t from-emerald-700 via-emerald-500 to-emerald-300"
                style={{
                left: stem.left,
                height: stem.height,
                transform: `translateX(-50%) rotate(${stem.rotate}deg)`,
                }}
            />
            ))}

            {blossomGroups.map((group, index) => (
            <div
                key={index}
                className="absolute grid grid-cols-3 gap-1"
                style={{
                left: group.left,
                top: group.top,
                transform: `translateX(-50%) scale(${group.scale})`,
                }}
            >
                {Array.from({ length: 6 }).map((_, miniIndex) => (
                <MiniBloom
                    key={miniIndex}
                    delay={miniIndex * 0.18 + index * 0.15}
                />
                ))}
            </div>
            ))}
        </div>

        <div className="absolute bottom-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-b-[90px] rounded-t-[30px] bg-gradient-to-b from-violet-100 via-white to-violet-200 shadow-bloom" />
        <div className="absolute bottom-24 left-1/2 h-40 w-48 -translate-x-1/2 rounded-b-[100px] rounded-t-[18px] border border-white/60 bg-white/55 backdrop-blur-sm" />
        <div className="absolute bottom-24 left-1/2 h-10 w-52 -translate-x-1/2 rounded-full bg-white/30 blur-md" />
        <div className="absolute bottom-[108px] left-1/2 h-6 w-32 -translate-x-1/2 rounded-full bg-violet-200/80" />
        <div className="absolute bottom-[112px] left-1/2 h-8 w-8 -translate-x-1/2 rotate-45 rounded-sm bg-fuchsia-400 shadow-lg" />
        <div className="absolute bottom-[114px] left-[46%] h-12 w-12 rotate-[12deg] border-b-[24px] border-l-[18px] border-r-[18px] border-b-fuchsia-300 border-l-transparent border-r-transparent" />
        <div className="absolute bottom-[114px] left-[50%] h-12 w-12 -translate-x-1/2 -rotate-[12deg] border-b-[24px] border-l-[18px] border-r-[18px] border-b-violet-300 border-l-transparent border-r-transparent" />
        </motion.div>
    );
}