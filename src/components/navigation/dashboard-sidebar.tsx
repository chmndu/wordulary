import { navigation } from "@/lib/navigation";
import { NavLink } from "@/components/navigation/nav-link";
import { Logo } from "@/components/branding/logo";
import { SidebarFooter } from "@/components/navigation/sidebar-footer";

export function DashboardSidebar() {
    return (
        <aside className="fixed left-0 top-0 hidden h-screen w-52 xl:w-64 border-r bg-background px-6 py-6 md:flex md:flex-col ">
            <header className="mb-8">
                <Logo href="/dashboard" />
            </header>

            <nav className="space-y-2">
                {navigation.map((item) => {

                    return (
                        <NavLink
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                        />
                    );
                })}
            </nav>

            <SidebarFooter />
        </aside>
    );
}