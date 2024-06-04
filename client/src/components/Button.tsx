import Link from "next/link";
import clsx from "clsx";

const variantStyles = {
  primary:
    "bg-red-800 border border-black shadow-md font-semibold text-gray-50 hover:bg-red-700 active:bg-red-800 active:text-gray-100/70 dark:bg-red-700 dark:hover:bg-red-600 dark:active:bg-red-700 dark:active:text-red-100/70",
};

type ButtonProps = {
  variant?: keyof typeof variantStyles;
} & (
  | (React.ComponentPropsWithoutRef<"button"> & { href?: undefined })
  | React.ComponentPropsWithoutRef<typeof Link>
);

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  className = clsx(
    "inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none",
    variantStyles[variant],
    className,
  );

  return typeof props.href === "undefined" ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  );
}
