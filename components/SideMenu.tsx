import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SideMenuProps {
    onSelect: (item: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { label: 'Together Forever', id: 'slideshow' },
        { label: 'Journey of Love', id: 'journey' },
        { label: 'Our Memories', id: 'memories' },
        { label: 'Future Dreams', id: 'dreams' },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="fixed top-4 right-4 z-50 md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white"
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Desktop Menu / Mobile Drawer */}
            <AnimatePresence>
                {(isOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                        className={`fixed inset-y-0 right-0 z-40 w-64 bg-black/40 backdrop-blur-xl border-l border-white/10 p-6 pt-20 md:pt-6 
              ${isOpen ? 'block' : 'hidden md:block'} md:translate-x-0`}
                    >
                        <div className="flex flex-col gap-6">
                            <h3 className="text-xl font-romantic text-rose-300 border-b border-white/10 pb-4">
                                Forever Menu
                            </h3>
                            <nav className="flex flex-col gap-6">
                                {menuItems.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => {
                                            onSelect(item.id);
                                            setIsOpen(false);
                                        }}
                                        whileHover={{ scale: 1.1, x: 20, color: '#fb7185' }} // rose-400
                                        className="text-left text-white/80 transition-colors duration-300 font-medium text-2xl"
                                    >
                                        {item.label}
                                    </motion.button>
                                ))}
                            </nav>
                        </div>

                        {/* Footer Section */}
                        <div className="absolute bottom-8 left-6 right-6 border-t border-white/10 pt-6">
                            <p className="text-white/40 text-sm font-light text-center">
                                Made with ❤️ for Priyanka
                            </p>
                            <p className="text-white/20 text-xs text-center mt-2">
                                &copy; 2024 Forever Love
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SideMenu;
