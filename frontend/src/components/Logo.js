import logo from "../assets/personalplanner.png"

export function Logo({ className = "h-10", showText = true }) {
  return (
    <div className="flex items-center gap-3">
      <img 
        src={logo} 
        alt="PersonalPlanner Logo"
        className={className}
      />
      {showText && (
        <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
          PersonalPlanner
        </span>
      )}
    </div>
  )
}
