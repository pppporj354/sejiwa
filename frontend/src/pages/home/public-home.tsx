import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SubscriptionButton from "@/components/subscription-button"
import type { Category as CategoryType } from "@/types/api"
import { Lock } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { listCategories } from "@/services/categories"
import {
  Users,
  MessageCircle,
  Shield,
  Heart,
  Smile,
  Leaf,
  UserPlus,
  Search,
  MessageSquare,
  ArrowRight,
} from "lucide-react"

export default function PublicHomePage() {
  return (
    <div className="min-h-dvh">
      <Hero />
      <Features />
      <CommunityShowcase />
      <HowItWorks />
      <Guidelines />
      <ExploreCategories />
      <ReadWithoutAccount />
      <CTA />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_-20%,oklch(0.98_0.02_160),transparent)]" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Mental wellness community
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              A safe, caring space for mental wellness
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
              Sejiwa is an anonymous, moderated community to share, listen, and
              find support—without judgment.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="px-6">
                <Link to="/register">Join now</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="px-6">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Anonymous by default</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Active moderation</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>Safe discussions</span>
              </div>
            </div>
          </div>

          <div className="relative z-0">
            {/* Main illustration placeholder */}
            <div className="relative rounded-2xl border bg-card/70 backdrop-blur shadow-xl p-6 sm:p-8 overflow-hidden">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

              {/* Image placeholder with mental health themes */}
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                  <Smile className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                  Community Support
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  [Image: People supporting each other in a safe, welcoming
                  environment]
                </p>

                {/* Decorative elements representing community features */}
                <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const items = [
    {
      title: "Anonymous & safe",
      desc: "Use a unique username. Share only what you're comfortable with.",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Active moderation",
      desc: "Report harmful content. Our moderators keep the space healthy.",
      icon: Shield,
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
    },
    {
      title: "Supportive topics",
      desc: "Discuss anxiety, depression, relationships, and more.",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
    },
  ] as const

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Why choose Sejiwa?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Built with mental health in mind, our platform prioritizes safety,
          anonymity, and genuine human connection.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="group relative rounded-xl border bg-white/70 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon
                  className={`w-6 h-6 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                  style={{
                    filter: "drop-shadow(0 0 0 rgb(59, 130, 246))",
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </div>
          )
        })}
      </div>
    </section>
  )
}

function CommunityShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Real stories, real support
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Every day, people in our community find the courage to share their
            stories and support others on their mental health journey.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 backdrop-blur-sm border">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-700 italic">
                  "This community helped me realize I wasn't alone in my
                  struggles with anxiety. The anonymous support here is
                  incredible."
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  — Community member
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 backdrop-blur-sm border">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                <Smile className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-700 italic">
                  "The moderation here makes me feel safe to be vulnerable and
                  share my experiences without fear of judgment."
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  — Community member
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Image placeholder for community/mental health illustration */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center p-8 text-center">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-200 to-emerald-200 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Mental Health Community
              </h3>
              <p className="text-sm text-slate-600 max-w-sm">
                [Image: Diverse group of people in a supportive circle,
                representing anonymous community connection and mental wellness]
              </p>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
              <Smile className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-teal-400 flex items-center justify-center shadow-lg">
              <Leaf className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 p-6 sm:p-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center min-h-[340px]">
          <div className="relative z-10 flex flex-col justify-center items-center text-center h-full">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Ready to talk—or just listen?
            </h3>
            <p className="text-blue-100 text-base sm:text-lg mb-6">
              Join our community and take the first step at your own pace. Every
              journey starts with a single conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-slate-900 hover:bg-white/90"
              >
                <Link to="/register">Create account</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 hover:text-white/90 bg-transparent"
              >
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </div>

          <div className="relative lg:block">
            {/* Illustration placeholder */}
            <div className="relative rounded-xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center border border-white/20">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Safe Space Awaits
                </h4>
                <p className="text-sm text-blue-100 max-w-sm">
                  [Image: Welcoming hands forming a protective circle,
                  representing the safe and supportive community environment]
                </p>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                <Smile className="w-3 h-3 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                <Leaf className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute -top-8 -right-6 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-6 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      title: "Create an anonymous account",
      desc: "Pick a username—no email or personal info required.",
      icon: UserPlus,
      color: "from-blue-400 to-cyan-500",
    },
    {
      title: "Join a topic",
      desc: "Browse categories and follow what matters to you.",
      icon: Search,
      color: "from-purple-400 to-pink-500",
    },
    {
      title: "Share or listen",
      desc: "Start a thread, reply, or read quietly at your pace.",
      icon: MessageSquare,
      color: "from-green-400 to-emerald-500",
    },
    {
      title: "Stay safe",
      desc: "Report harmful content and our moderators will step in.",
      icon: Shield,
      color: "from-orange-400 to-red-500",
    },
  ] as const

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          How it works
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Getting started with our mental health community is simple and
          anonymous. Here's your journey in four easy steps.
        </p>
      </div>

      <div className="relative">
        {/* Connection line for larger screens */}
        <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 to-orange-200" />

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, i) => {
            const IconComponent = s.icon
            return (
              <li key={s.title} className="relative">
                <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    {/* Step icon */}
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${s.color} flex items-center justify-center mb-4 shadow-md`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Step number */}
                    <div className="text-xs font-medium text-muted-foreground mb-2">
                      Step {i + 1}
                    </div>

                    {/* Step content */}
                    <div className="font-semibold text-slate-900 mb-2">
                      {s.title}
                    </div>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>

                {/* Arrow for larger screens */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      {/* Call to action */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border">
          <Heart className="w-4 h-4 text-pink-500" />
          <span className="text-sm text-slate-700">
            Join thousands finding support and connection
          </span>
        </div>
      </div>
    </section>
  )
}

function Guidelines() {
  const rules = [
    {
      title: "Be respectful",
      desc: "No harassment, hate, or shaming—ever.",
    },
    {
      title: "Protect privacy",
      desc: "Do not share personal info; keep things anonymous.",
    },
    {
      title: "Support, not advice",
      desc: "Share experiences and resources, not diagnoses.",
    },
    {
      title: "Report concerns",
      desc: "Use the report feature to flag harmful content.",
    },
  ] as const

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <div className="rounded-2xl border bg-card/70 backdrop-blur shadow-xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Community guidelines
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Sejiwa is a supportive place. These basics help keep everyone safe.
        </p>
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rules.map((r) => (
            <li key={r.title} className="rounded-xl border bg-white/60 p-5">
              <div className="font-medium text-slate-900">{r.title}</div>
              <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ExploreCategories() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  })

  // Fallback static data for demo/offline scenarios
  const fallbackCategories = [
    {
      id: "1",
      name: "Anxiety",
      description: "Coping tools, daily management, support.",
      thread_count: 24,
      slug: "anxiety",
    },
    {
      id: "2",
      name: "Depression",
      description: "You're not alone—share and learn.",
      thread_count: 18,
      slug: "depression",
    },
    {
      id: "3",
      name: "Relationships",
      description: "Communication, boundaries, healing.",
      thread_count: 31,
      slug: "relationships",
    },
    {
      id: "4",
      name: "Work & Burnout",
      description: "Stress, balance, and recovery.",
      thread_count: 12,
      slug: "work-burnout",
    },
    {
      id: "5",
      name: "Self-esteem",
      description: "Growth, self-talk, self-care.",
      thread_count: 15,
      slug: "self-esteem",
    },
    {
      id: "6",
      name: "Grief",
      description: "Space to process and remember.",
      thread_count: 8,
      slug: "grief",
    },
  ]

  // Ensure displayCategories is always an array
  const displayCategories = Array.isArray(categories)
    ? categories
    : fallbackCategories

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            Explore categories
          </h2>
          <p className="text-sm text-muted-foreground">
            Pick a topic to start reading or sharing.
          </p>
        </div>
        <Button asChild variant="link" className="hidden sm:inline-flex">
          <Link to="/register">Create an account</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow animate-pulse"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-5 bg-slate-200 rounded w-20"></div>
                <div className="h-4 bg-slate-200 rounded-full w-12"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-5 text-center py-8">
          <p className="text-muted-foreground">
            Unable to load categories. Using demo data.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCategories.slice(0, 6).map((c: Partial<CategoryType>) => (
            <div
              key={c.id || c.name}
              className="group rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  {c.name}
                  {c.is_private && (
                    <Badge variant="warning" className="gap-1">
                      <Lock className="w-3 h-3" /> Private
                    </Badge>
                  )}
                </div>
                <span className="text-xs rounded-full px-2 py-1 bg-secondary text-secondary-foreground">
                  {c.thread_count || 0} threads
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {c.description}
              </p>
              <div className="mt-4 flex gap-2">
                {c.is_private ? (
                  c.id && c.name ? (
                    <SubscriptionButton
                      categoryId={c.id}
                      categoryName={c.name}
                      isPrivate
                      variant="compact"
                    />
                  ) : (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/login">Join</Link>
                    </Button>
                  )
                ) : (
                  <Button asChild size="sm" variant="outline">
                    <Link to={c.id ? `/categories/${c.id}` : "/login"}>
                      View threads
                    </Link>
                  </Button>
                )}
                <Button asChild size="sm" variant="ghost">
                  <Link
                    to={`/preview/${
                      c.slug || c.name?.toLowerCase() || "category"
                    }`}
                  >
                    Preview
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function ReadWithoutAccount() {
  const sampleThreads = [
    {
      id: "1",
      title: "Starting my anxiety recovery journey",
      excerpt:
        "After years of struggling, I'm finally ready to take the first step...",
      category: "Anxiety",
      replies: 12,
      timeAgo: "2h ago",
    },
    {
      id: "2",
      title: "Finding hope after a difficult breakup",
      excerpt: "It's been 3 months and I'm slowly learning to trust again...",
      category: "Relationships",
      replies: 8,
      timeAgo: "4h ago",
    },
    {
      id: "3",
      title: "Burnout recovery: my 6-month progress",
      excerpt: "Sharing what's helped me rebuild my energy and motivation...",
      category: "Work & Burnout",
      replies: 15,
      timeAgo: "1d ago",
    },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <div className="rounded-2xl border bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Get a feel for our community
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Read some recent threads to see how people support each other here.
          </p>
        </div>

        <div className="space-y-4">
          {sampleThreads.map((thread) => (
            <div
              key={thread.id}
              className="rounded-xl border bg-white/80 backdrop-blur-sm p-4 sm:p-5 shadow hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs rounded-full px-2 py-1 bg-blue-100 text-blue-700 font-medium">
                      {thread.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {thread.timeAgo}
                    </span>
                  </div>
                  <h3 className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                    {thread.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {thread.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>{thread.replies} supportive replies</span>
                    <span>•</span>
                    <span>Anonymous community</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Want to join the conversation? Create your anonymous account to
            participate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/register">Join the community</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login">Already have an account?</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
