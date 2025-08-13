import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  img: string; // public path or URL
  href: string;
};

export default function TestCard({ title, description, img, href }: Props) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 shadow-lg overflow-hidden max-w-[200px] w-full">
      {/* Image keeps intrinsic ratio; bigger, no crop, no fixed height */}
      <Image
        src={img}
        alt={title}
        width={0}
        height={0}
        sizes="(min-width:1024px) 33vw, 100vw"
        className="w-full h-auto rounded-t-2xl"
        priority
      />

      {/* Content sits lower under the image */}
      <div className="p-3 space-y-2">
        <h3 className="text-lg font-semibold leading-tight text-gray-100">{title}</h3>
        <p className="text-xs text-slate-300">{description}</p>

        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:opacity-90 transition"
        >
          Start Test →
        </Link>
      </div>
    </div>
  );
}


