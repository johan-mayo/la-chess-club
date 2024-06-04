import clsx from "clsx";
import Image from "next/image";

export function Photos() {
  let rotations = [
    "rotate-2",
    "-rotate-2",
    "rotate-2",
    "rotate-2",
    "-rotate-2",
  ];

  return (
    <div className="mt-16">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {[
          "https://dajocode-cloud-storage-api.com/api/read?key=la-chess-club/402360bf4d1c488582c5f1a5706fb4e4",
          "https://dajocode-cloud-storage-api.com/api/read?key=la-chess-club/32ea2ef8f739466786c39743137ed56a",
          "https://dajocode-cloud-storage-api.com/api/read?key=la-chess-club/ed3bfa3c62ae4305b0008f2f3fa188ca",
          "https://dajocode-cloud-storage-api.com/api/read?key=la-chess-club/29a2da24efbd45f4af63039659e694fe",
          "https://dajocode-cloud-storage-api.com/api/read?key=la-chess-club/5039e080e3fa475fa87605e60a66c514",
        ].map((image, imageIndex) => (
          <div
            key={image}
            className={clsx(
              "relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800",
              rotations[imageIndex % rotations.length],
            )}
          >
            <Image
              src={image}
              alt=""
              width={100}
              height={100}
              sizes="(min-width: 640px) 18rem, 11rem"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
