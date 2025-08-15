"use client";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ModernCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  gradient?: string;
  image?: string;
  badge?: string;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "glass" | "solid" | "gradient" | "minimal";
  hoverEffect?: "lift" | "glow" | "scale" | "rotate" | "none";
}

export default function ModernCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-teal-600",
  gradient = "from-teal-500 to-blue-500",
  image,
  badge,
  children,
  onClick,
  className = "",
  size = "md",
  variant = "glass",
  hoverEffect = "lift"
}: ModernCardProps) {
  
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const variantClasses = {
    glass: "glass border border-white/20",
    solid: "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]",
    gradient: `bg-gradient-to-br ${gradient} text-white`,
    minimal: "bg-[var(--surface)]/70 border border-[var(--border)]"
  };

  const hoverAnimations = {
    lift: { y: -10, scale: 1.02 },
    glow: { boxShadow: "0 0 30px rgba(20, 184, 166, 0.4)" },
    scale: { scale: 1.05 },
    rotate: { rotate: [0, 1, -1, 0], scale: 1.02 },
    none: {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverAnimations[hoverEffect]}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut",
        type: hoverEffect === "rotate" ? "spring" : "tween"
      }}
      onClick={onClick}
      className={`
        relative rounded-2xl overflow-hidden cursor-pointer group
        transition-all duration-300
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Background Image */}
      {image && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-300"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      {/* Gradient Overlay for Images */}
      {image && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      )}

      {/* Content */}
      <div className="relative z-10">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${variant === "gradient" 
                    ? "bg-white/20" 
                    : `bg-gradient-to-br ${gradient}`
                  }
                  group-hover:shadow-lg transition-shadow duration-300
                `}
              >
                <Icon className={`w-6 h-6 ${variant === "gradient" ? "text-white" : iconColor}`} />
              </motion.div>
            )}
            
            {badge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-medium rounded-full border border-teal-400/30"
              >
                {badge}
              </motion.span>
            )}
          </div>
        </div>

        {/* Title */}
        <motion.h3 
          className={`
            text-xl font-bold mb-3 leading-tight
            ${variant === "gradient" ? "text-white" : "text-[var(--foreground)]"}
            transition-colors duration-300
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p 
          className={`
            text-sm leading-relaxed mb-4
            ${variant === "gradient" ? "text-white/90" : "text-[var(--muted)]"}
            transition-colors duration-300
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {description}
        </motion.p>

        {/* Custom Children */}
        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {children}
          </motion.div>
        )}

        {/* Interactive Elements */}
        <div className="flex items-center justify-between mt-6">
          
          {/* Progress Bar (Example) */}
          <div className="flex-1 mr-4">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "70%" }}
                transition={{ delay: 0.5, duration: 1 }}
                className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
              />
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${variant === "gradient" 
                ? "bg-white/20 hover:bg-white/30 text-white" 
                : "bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/30"
              }
            `}
          >
            Explore
          </motion.button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-2xl`} />
      </div>

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${gradient} bg-clip-border mask`} 
             style={{ 
               WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
               WebkitMaskComposite: 'xor',
               maskComposite: 'exclude'
             }}
        />
      </div>
    </motion.div>
  );
}

// Specialized Card Variants
export function TestCard({ 
  title, 
  description, 
  category, 
  difficulty = "Medium",
  duration = "10 min",
  onClick 
}: {
  title: string;
  description: string;
  category: string;
  difficulty?: string;
  duration?: string;
  onClick?: () => void;
}) {
  return (
    <ModernCard
      title={title}
      description={description}
      badge={category}
      variant="glass"
      hoverEffect="lift"
      onClick={onClick}
    >
      <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              difficulty === "Easy" ? "bg-green-400" :
              difficulty === "Medium" ? "bg-yellow-400" : "bg-red-400"
            }`} />
            <span>{difficulty}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </ModernCard>
  );
}

export function TherapistCard({
  name,
  specialty,
  rating = 4.8,
  experience = "5+ years",
  image,
  isOnline = true,
  onClick
}: {
  name: string;
  specialty: string;
  rating?: number;
  experience?: string;
  image?: string;
  isOnline?: boolean;
  onClick?: () => void;
}) {
  return (
    <ModernCard
      title={name}
      description={specialty}
      image={image}
      variant="glass"
      hoverEffect="glow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>⭐ {rating}</span>
          <span>•</span>
          <span>{experience}</span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${isOnline ? "text-green-400" : "text-gray-500"}`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-gray-500"}`} />
          <span>{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>
    </ModernCard>
  );
}

export function ModuleCard({
  title,
  description,
  icon,
  gradient = "from-purple-500 to-pink-500",
  progress = 0,
  isLocked = false,
  onClick
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: string;
  progress?: number;
  isLocked?: boolean;
  onClick?: () => void;
}) {
  return (
    <ModernCard
      title={title}
      description={description}
      icon={icon}
      gradient={gradient}
      variant={isLocked ? "minimal" : "gradient"}
      hoverEffect={isLocked ? "none" : "scale"}
      onClick={isLocked ? undefined : onClick}
      className={isLocked ? "opacity-60 cursor-not-allowed" : ""}
    >
      {!isLocked && progress > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-2 text-[color:rgba(255,255,255,0.8)] [data-theme=light]:text-[var(--muted)]">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-white/60 rounded-full"
            />
          </div>
        </div>
      )}
      
      {isLocked && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-gray-400">
            🔒 <span>Unlock with Premium</span>
          </div>
        </div>
      )}
    </ModernCard>
  );
}
