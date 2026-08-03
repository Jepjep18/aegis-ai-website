"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

import { Button } from "@/components/ui/button";

export default function Navbar() {

    const router = useRouter();
    
    return (
        <motion.header
            initial={{
                y: -60,
                opacity: 0,
            }}
            animate={{
                y: 0,
                opacity: 1,
            }}
            transition={{
                duration: 0.5,
            }}
            className="fixed inset-x-0 top-0 z-50 h-20 border-b border-white/5 bg-background/70 backdrop-blur-xl"    >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                <Logo />

                <DesktopNav />

                <div className="hidden items-center gap-3 lg:flex">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/sign-in")}
                    >
                        Sign In
                    </Button>

                    <Button className="rounded-xl">
                        Get Started

                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <MobileNav />
            </div>
        </motion.header>
    );
}