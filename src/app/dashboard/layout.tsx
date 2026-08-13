import { ReactNode } from "react";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { MobileHeader } from "@/components/navigation/mobile-header";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <>
            <DashboardSidebar />

            <MobileHeader />

            <main className="min-h-screen px-6 pb-24 pt-20 md:ml-52 xl:ml-64 md:py-6">
                {children}
            </main>

            <MobileBottomNav />
        </>
    );
}