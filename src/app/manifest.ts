import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Wordulary",
        short_name: "Wordulary",
        description: "AI-powered vocabulary learning built for focused study.",
        start_url: "/",
        display: "standalone",
        background_color: "#F4F1DE",
        theme_color: "#81B29A",
        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}