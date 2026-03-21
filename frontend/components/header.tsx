import Link from "next/link"
import ToggleViewButton from "./toggleviewbutton"
import ThemeToggle from "./theme-toggle"
import { cookies } from "next/headers";

const Header = async () => {
    const cookiesStore = await cookies();

    const email = cookiesStore.get('email')?.value;

    return (
        <div className="border border-b flex items-center justify-between p-4 py-2 sticky top-0 z-10 bg-background">
            <div className="flex items-center justify-between w-full mx-auto max-w-7xl">
                <Link href="/" className="text-2xl font-bold">P. {email ? 'Admin' : 'User'}
                </Link>

                <div className="flex items-center gap-2">
                    <ToggleViewButton email={email || ''} />
                    {/* <ThemeToggle /> */}
                </div>
            </div>
        </div>
    )
}

export default Header