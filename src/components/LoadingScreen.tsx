import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '@react-three/drei'

export function LoadingScreen() {
    const { active } = useProgress()
    const [show, setShow] = useState(true)
    const messages = useMemo(() => [
        'Charting the route…',
        'Catching a good wind…',
        'Hoisting sails…',
        'Docking components on the island…',
    ], [])
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        if (!active) {
            const t = setTimeout(() => setShow(false), 300)
            return () => clearTimeout(t)
        } else {
            setShow(true)
        }
    }, [active])

    useEffect(() => {
        if (!show) return
        const i = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length)
        }, 2500)
        return () => clearInterval(i)
    }, [show, messages.length])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="ocean">
                        <div className="wave" />
                        <motion.div
                            className="boat"
                            initial={{ y: 0 }}
                            animate={{ y: [0, -6, 0, -4, 0], rotate: [0, -4, 0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        >
                            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path d="M10 58 L110 58 L95 70 L25 70 Z" fill="#7a4d2a" />
                                    <rect x="58" y="16" width="4" height="44" fill="#5b3a21" />
                                    <path d="M60 18 L60 56 L22 56 Z" fill="#e9f6ff" />
                                    <path d="M60 18 L60 56 L98 56 Z" fill="#bfe7ff" />
                                    <circle cx="60" cy="14" r="3" fill="#5b3a21" />
                                </g>
                            </svg>
                        </motion.div>
                        <div className="loading-copy">
                            <div className="loading-title">{messages[messageIndex]}</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}


