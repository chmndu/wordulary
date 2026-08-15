import Link from "next/link";
import { Container } from "./container";
import { LogoMark } from "../branding/logo-mark";
import { siteConfig } from "@/lib/site";

export function Footer() {
    return (
        <footer className="border-t py-10">
            <Container>
                <div className="flex flex-col gap-8 items-center md:flex-row md:justify-between">
                    <div className="flex items-center gap-3">
                        <LogoMark href="/" />

                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Wordulary. All rights reserved.
                        </p>
                    </div>

                    <nav className="flex flex-wrap gap-6 text-sm">
                        <Link
                            href="/privacy-policy"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Privacy
                        </Link>

                        <Link
                            href="/terms-of-service"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Terms
                        </Link>

                        <Link
                            href={siteConfig.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            GitHub
                        </Link>
                    </nav>
                </div>
            </Container>
        </footer>
    );
}