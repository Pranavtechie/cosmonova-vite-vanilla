import "../styles/landing-page.css";
import { motion } from "framer-motion";
import { FaRocket, FaGlobeAmericas, FaSun } from "react-icons/fa";

export default function Home() {
	return (
		<div className="landing-container">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
				className="hero"
			>
				<h2>Explore the Universe</h2>
				<p>Embark on an interstellar adventure with us.</p>
				<div className="button-container">
					<a className="orbit-button" href="/orbit.html">
						<FaGlobeAmericas /> View Earth Orbit
					</a>
					<a className="orbit-button" href="/solar-system.html">
						<FaSun /> View Solar System
					</a>
				</div>
			</motion.div>
			<div className="stars"></div>
		</div>
	);
}
