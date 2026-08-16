"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  CalendarBlank,
  Clock,
  Heart,
  MapPin,
  MusicNotes,
  Pause,
  Sparkle,
} from "@phosphor-icons/react";
import type { InvitationData } from "@/types/invitation";
import Image from "next/image";

interface StandardInvitationProps {
  data: InvitationData;
}

export default function StandardInvitation({
  data,
}: StandardInvitationProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [attending, setAttending] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const target = new Date(data.dateTime);

    const updateTimer = () => {
      const difference = target.getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(
          difference / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
          (difference / (1000 * 60)) % 60
        ),
        seconds: Math.floor(
          (difference / 1000) % 60
        ),
      });
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [data.dateTime]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Аты-жөніңізді енгізіңіз");
      return;
    }

    if (attending === null) {
      setMessage("Жауабыңызды таңдаңыз");
      return;
    }

    if (!data.clientEmail) {
      setMessage("Email табылмады");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientEmail: data.clientEmail,
          name: name.trim(),
          guests,
          attending,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Қате орын алды"
        );
      }

      setMessage(
        "Рақмет! Жауабыңыз қабылданды ❤️"
      );

      setName("");
      setGuests(1);
      setAttending(null);
    } catch (error) {
      console.error("RSVP error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Жауапты жіберу мүмкін болмады"
      );
    } finally {
      setLoading(false);
    }
  }

  const toggleMusic = () => {
    const audio = document.getElementById(
      "standard-music"
    ) as HTMLAudioElement | null;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        console.log(
          "Музыканы ойнату мүмкін болмады."
        );
      });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5ef] text-[#29251f]">
      {/* MUSIC */}
      <audio
        id="standard-music"
        loop
        preload="metadata"
      >
        <source
          src="/music/toy.mp3"
          type="audio/mpeg"
        />
      </audio>

      <button
        type="button"
        onClick={toggleMusic}
        aria-label="Музыканы қосу немесе өшіру"
        className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white shadow-lg backdrop-blur-xl transition duration-300 hover:scale-110"
      >
        {isPlaying ? (
          <Pause size={18} weight="bold" />
        ) : (
          <MusicNotes size={18} weight="bold" />
        )}
      </button>

      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={data.coverImage}
            alt={`${data.groom} мен ${data.bride}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        {/* decorative frame */}
        <div className="absolute inset-5 z-10 border border-white/25 sm:inset-8" />

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="relative z-20 px-6 text-center text-white"
        >
          <div className="mb-7 flex items-center justify-center gap-3 text-white/70">
            <span className="h-px w-10 bg-white/40" />

            <Sparkle
              size={15}
              weight="thin"
            />

            <span className="h-px w-10 bg-white/40" />
          </div>

          <p className="font-body text-[10px] font-medium uppercase tracking-[0.5em] text-white/80">
            Тойға шақыру
          </p>

          <h1 className="mt-7 font-wedding text-6xl leading-[0.95] sm:text-7xl md:text-9xl">
            <span className="block">
              {data.groom}
            </span>

            <span className="my-2 block font-serif text-3xl font-light italic opacity-80 sm:text-4xl">
              &
            </span>

            <span className="block">
              {data.bride}
            </span>
          </h1>

          <div className="mx-auto mt-9 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-white/50" />

            <p className="font-body text-xs font-medium uppercase tracking-[0.35em]">
              {data.date}
            </p>

            <span className="h-px w-16 bg-white/50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-white/70"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-body text-[9px] uppercase tracking-[0.3em]">
              Төмен жылжытыңыз
            </span>

            <ArrowDown
              size={20}
              weight="thin"
              className="animate-bounce"
            />
          </div>
        </motion.div>
      </section>

      {/* INTRO */}
      <section className="relative px-6 py-28 sm:py-36">
        <div className="absolute left-1/2 top-0 h-20 w-px -translate-x-1/2 bg-[#d8d0c4]" />

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#d8d0c4]">
            <Heart
              size={25}
              weight="thin"
            />
          </div>

          <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#81796d]">
            Құрметті қонақтар!
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-6xl">
            Сіздерді қуанышымызға
            <br />
            ортақтасуға шақырамыз
          </h2>

          <p className="mx-auto mt-8 max-w-xl font-body text-sm leading-8 text-[#70695f]">
            Өміріміздегі ең маңызды күндердің
            бірін сіздермен бірге атап өтуді
            асыға күтеміз. Ақ тілектеріңізбен
            бірге тойымыздың қадірлі қонағы
            болыңыздар!
          </p>

          <div className="mt-10 font-wedding text-3xl">
            {data.groom} & {data.bride}
          </div>
        </motion.div>
      </section>

      {/* COUNTDOWN */}
      <section className="relative overflow-hidden bg-[#29251f] px-6 py-24 text-white sm:py-32">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full border border-white/5" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full border border-white/5" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="font-body text-[10px] uppercase tracking-[0.45em] text-white/45">
            Үлкен күнге дейін
          </p>

          <h2 className="mt-5 font-serif text-4xl sm:text-6xl">
            Қуанышты күнге
            <br />
            санаулы сәт
          </h2>

          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-4 gap-2 sm:gap-5">
            <CountdownItem
              value={timeLeft.days}
              label="КҮН"
            />

            <CountdownItem
              value={timeLeft.hours}
              label="САҒАТ"
            />

            <CountdownItem
              value={timeLeft.minutes}
              label="МИНУТ"
            />

            <CountdownItem
              value={timeLeft.seconds}
              label="СЕКУНД"
            />
          </div>
        </div>
      </section>

      {/* EVENT INFO */}
      <section className="bg-[#f1ede5] px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Маңызды ақпарат"
            title="Тойымыздың мекені"
          />

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <InfoCard
              icon={
                <CalendarBlank
                  size={26}
                  weight="thin"
                />
              }
              title="Күні"
              value={data.date}
            />

            <InfoCard
              icon={
                <Clock
                  size={26}
                  weight="thin"
                />
              }
              title="Басталуы"
              value={data.time}
            />

            <InfoCard
              icon={
                <MapPin
                  size={26}
                  weight="thin"
                />
              }
              title="Мекенжай"
              value={data.venue}
              description={data.address}
            />
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Той бағдарламасы"
            title="Бірге өткізетін кеш"
          />

          <div className="relative mt-16">
            <div className="absolute bottom-0 left-[31px] top-0 w-px bg-[#ded8ce]" />

            {data.events.map(
              (event, index) => (
                <motion.div
                  key={`${event.time}-${index}`}
                  initial={{
                    opacity: 0,
                    x: -25,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className="relative flex gap-7 pb-10 last:pb-0"
                >
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#d6cec1] bg-[#f8f5ef] font-serif text-sm">
                    {index + 1}
                  </div>

                  <div className="flex-1 rounded-2xl border border-[#ded8ce] bg-white/50 p-5 sm:p-6">
                    <p className="font-serif text-xl">
                      {event.title}
                    </p>

                    <p className="mt-2 font-body text-xs uppercase tracking-[0.2em] text-[#81796d]">
                      {event.time}
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-[#24211d] px-6 py-28 text-white sm:py-36">
        <SectionHeading
          eyebrow="Біздің естеліктер"
          title="Бақытты сәттер"
          dark
        />

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {data.gallery.map(
            (image, index) => {
              const featured =
                index === 0 ||
                index === 5;

              return (
                <motion.div
                  key={image}
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.06,
                  }}
                  className={`group relative overflow-hidden ${
                    featured
                      ? "col-span-2 aspect-[16/9]"
                      : "aspect-square"
                  }`}
                >
                  <Image
                    src={image}
                    alt="Естелік сурет"
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />
                </motion.div>
              );
            }
          )}
        </div>
      </section>

      {/* LOCATION */}
      <section className="px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d8d0c4]">
            <MapPin
              size={28}
              weight="thin"
            />
          </div>

          <p className="mt-8 font-body text-[10px] uppercase tracking-[0.4em] text-[#81796d]">
            Той өтетін мекен
          </p>

          <h2 className="mt-5 font-serif text-4xl sm:text-6xl">
            {data.venue}
          </h2>

          <p className="mx-auto mt-5 max-w-lg font-body text-sm leading-7 text-[#70695f]">
            {data.address}
          </p>

          <a
            href={`https://2gis.kz/search/${encodeURIComponent(
              `${data.venue}, ${data.address}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-3 rounded-full border border-[#29251f] px-8 py-4 font-body text-[10px] uppercase tracking-[0.25em] transition duration-300 hover:bg-[#29251f] hover:text-white"
          >
            <MapPin size={16} />
            Картаны ашу
          </a>
        </div>
      </section>

      {/* RSVP */}
      <section className="bg-[#f1ede5] px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-xl text-center">
          <Heart
            size={27}
            weight="thin"
            className="mx-auto"
          />

          <p className="mt-7 font-body text-[10px] uppercase tracking-[0.4em] text-[#81796d]">
            Қатысуыңызды растаңыз
          </p>

          <h2 className="mt-5 font-serif text-4xl sm:text-6xl">
            Тойға келесіз бе?
          </h2>

          <p className="mt-6 font-body text-sm leading-7 text-[#70695f]">
            Келетініңізді алдын ала хабарлауыңызды
            сұраймыз.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-12 space-y-4 text-left"
          >
            <div className="rounded-2xl border border-[#d8d0c4] bg-white/50 p-1">
              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Аты-жөніңіз"
                className="w-full bg-transparent px-5 py-4 font-body text-sm outline-none placeholder:text-[#938b80]"
              />
            </div>

            <div className="rounded-2xl border border-[#d8d0c4] bg-white/50 p-1">
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) =>
                  setGuests(Number(e.target.value))
                }
                placeholder="Қонақтар саны"
                className="w-full bg-transparent px-5 py-4 font-body text-sm outline-none placeholder:text-[#938b80]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setAttending(true)
                }
                className={`rounded-2xl border px-4 py-4 font-body text-[10px] uppercase tracking-[0.15em] transition ${
                  attending === true
                    ? "border-[#29251f] bg-[#29251f] text-white"
                    : "border-[#d0c7ba] bg-white/30 hover:bg-[#29251f] hover:text-white"
                }`}
              >
                Иә, келемін
              </button>

              <button
                type="button"
                onClick={() =>
                  setAttending(false)
                }
                className={`rounded-2xl border px-4 py-4 font-body text-[10px] uppercase tracking-[0.15em] transition ${
                  attending === false
                    ? "border-[#29251f] bg-[#29251f] text-white"
                    : "border-[#d0c7ba] bg-white/30 hover:bg-[#29251f] hover:text-white"
                }`}
              >
                Келе алмаймын
              </button>
            </div>

            {message && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="py-2 text-center font-body text-sm text-[#70695f]"
              >
                {message}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#29251f] px-6 py-5 font-body text-[10px] uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-[#403a33] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Жіберілуде..."
                : "Жауапты жіберу"}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#24211d] px-6 py-24 text-center text-white">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/15">
          <Heart
            size={20}
            weight="thin"
          />
        </div>

        <p className="mt-7 font-wedding text-4xl">
          {data.groom} & {data.bride}
        </p>

        <div className="mx-auto my-7 h-px w-16 bg-white/20" />

        <p className="font-body text-[10px] uppercase tracking-[0.35em] text-white/50">
          Тойымызда жүздескенше!
        </p>

        <p className="mt-10 font-body text-[9px] uppercase tracking-[0.2em] text-white/25">
          {data.date}
        </p>
      </footer>
    </main>
  );
}

function CountdownItem({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-6 backdrop-blur-sm sm:px-6 sm:py-8">
      <div className="font-serif text-3xl sm:text-5xl">
        {String(value).padStart(2, "0")}
      </div>

      <div className="mt-3 font-body text-[8px] tracking-[0.25em] text-white/40 sm:text-[10px]">
        {label}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="rounded-3xl border border-[#ded8ce] bg-white/50 p-8 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d8d0c4]">
        {icon}
      </div>

      <p className="mt-6 font-body text-[9px] uppercase tracking-[0.3em] text-[#81796d]">
        {title}
      </p>

      <p className="mt-3 font-serif text-xl">
        {value}
      </p>

      {description && (
        <p className="mt-2 font-body text-xs text-[#81796d]">
          {description}
        </p>
      )}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="mb-5 flex items-center justify-center gap-3">
        <span
          className={`h-px w-8 ${
            dark
              ? "bg-white/20"
              : "bg-[#d8d0c4]"
          }`}
        />

        <Sparkle
          size={14}
          weight="thin"
          className={
            dark
              ? "text-white/40"
              : "text-[#81796d]"
          }
        />

        <span
          className={`h-px w-8 ${
            dark
              ? "bg-white/20"
              : "bg-[#d8d0c4]"
          }`}
        />
      </div>

      <p
        className={`font-body text-[10px] uppercase tracking-[0.4em] ${
          dark
            ? "text-white/45"
            : "text-[#81796d]"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-5 font-serif text-4xl sm:text-6xl ${
          dark
            ? "text-white"
            : "text-[#29251f]"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

