import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardCardProps {
  card: {
    title: string;
    description: string;
    path: string;
    initial: { opacity: number; x?: number; y?: number };
    delay: number;
  };
}

const DashboardCard = ({ card }: DashboardCardProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const navigate = useNavigate();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.5, delay: card.delay },
      });
    }
  }, [isInView, controls, card.delay]);

  return (
    <motion.div
      ref={ref}
      initial={card.initial}
      animate={controls}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(card.path)}
      className="cursor-pointer min-w-0"
    >
      <div className="h-full transition-all hover:shadow-lg dark:hover:bg-gray-700/50">
        <div className="p-5">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {card.title}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 mt-3">
            {card.description}
          </p>
          <button className="mt-4 mx-auto gap-2 flex justify-center content-center text-primary-600">
            Go to {card.title.split(" ")[0]}
            <svg className="w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default DashboardCard;