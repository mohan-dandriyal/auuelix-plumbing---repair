
import Image from "next/image";
import type { HeaderType } from "@/types/template.type";

export default function Brand({ logo }: { logo: HeaderType["logo"] }) {
  return (
    <Image
      src={logo.src}
      alt={logo.logoAlt}
      width={2172}
      height={724}
      sizes="(min-width: 1024px) 25vw, 200px"
      className="h-auto w-[5.2em]"
    />
  );
}
