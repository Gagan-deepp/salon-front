'use client';
import { TrendingUp, Users, Shield, Clock } from "lucide-react";

const stats = [
  {
    value: "50,000+",
    label: "Active Users",
    icon: Users,
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    value: "500+",
    label: "Brands Managed",
    icon: TrendingUp,
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary"
  },
  {
    value: "99.9%",
    label: "Uptime Guarantee",
    icon: Shield,
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    value: "24×7",
    label: "Priority Support",
    icon: Clock,
    gradient: "from-primary/15 to-secondary/10",
    iconColor: "text-primary"
  },
];

const Stats = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses that rely on our platform for their daily operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="group relative p-8 bg-card border border-border/50 rounded-2xl backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Card gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10 text-center space-y-4">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} border border-border/20`}>
                      <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                  </div>

                  {/* Value */}
                  <div className="text-4xl md:text-5xl font-bold text-foreground group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-muted-foreground font-medium tracking-wide">
                    {stat.label}
                  </div>
                </div>

                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
