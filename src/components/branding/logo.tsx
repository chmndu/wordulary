"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

type LogoProps = {
    href?: string;
    className?: string;
    priority?: boolean;
};

const emptySubscribe = () => () => { };

export function Logo({
    href = "/",
    className,
    priority = false,
}: LogoProps) {
    const { resolvedTheme } = useTheme();

    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    if (!mounted) {
        return null;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <Link
            href={href}
            className={cn("inline-flex", className)}
        >
            <Image
                src={
                    isDark
                        ? "/branding/logo-dark.svg"
                        : "/branding/logo.svg"
                }
                alt="Wordulary"
                loading="eager"
                width={170}
                height={29}
                sizes="170px"
                priority={priority}
            />
        </Link>
    );
}