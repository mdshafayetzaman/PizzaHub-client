'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type CSSProperties, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ChevronRight,
  ClipboardList,
  Flame,
  Home,
  LayoutDashboard,
  Pizza,
  PlusCircle,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserCog,
  Users,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import SignOutButton from '@/components/shared/sign-out-button'
import { ROLE_HOME, ROLE_META, type DashboardRole, type DashboardUser } from '@/lib/roles'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const SITE_GROUP: NavGroup = {
  label: 'Site',
  items: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Browse menu', href: '/menu', icon: Pizza },
  ],
}

/**
 * Role-aware navigation: each of the three PizzaHub roles gets the pages that
 * belong to its workspace. Admins manage the whole platform.
 */
function buildNav(role: DashboardRole): NavGroup[] {
  if (role === 'admin') {
    return [
      {
        label: 'Dashboard',
        items: [
          {
            label: 'Overview',
            href: '/dashboard/admin',
            icon: LayoutDashboard,
          },
          {
            label: 'Manage users',
            href: '/dashboard/admin/users',
            icon: Users,
          },
          {
            label: 'Manage menu items',
            href: '/dashboard/admin/menu',
            icon: Pizza,
          },
          {
            label: 'Transactions',
            href: '/dashboard/admin/transactions',
            icon: Receipt,
          },
          {
            label: 'Profile settings',
            href: '/dashboard/admin/profile',
            icon: UserCog,
          },
        ],
      },
      SITE_GROUP,
    ]
  }

  if (role === 'vendor') {
    return [
      {
        label: 'Dashboard',
        items: [
          {
            label: 'Overview',
            href: '/dashboard/vendor',
            icon: LayoutDashboard,
          },
          {
            label: 'My menu items',
            href: '/dashboard/vendor/menu',
            icon: Pizza,
          },
          {
            label: 'Add menu item',
            href: '/dashboard/vendor/menu/new',
            icon: PlusCircle,
          },
          {
            label: 'Customer orders',
            href: '/dashboard/vendor/orders',
            icon: ClipboardList,
          },
          {
            label: 'Subscription',
            href: '/dashboard/vendor/subscription',
            icon: Sparkles,
          },
          {
            label: 'Profile settings',
            href: '/dashboard/vendor/profile',
            icon: UserCog,
          },
        ],
      },
      SITE_GROUP,
    ]
  }

  return [
    {
      label: 'Dashboard',
      items: [
        {
          label: 'Overview',
          href: '/dashboard/customers',
          icon: LayoutDashboard,
        },
        {
          label: 'My orders',
          href: '/dashboard/customers/orders',
          icon: ShoppingBag,
        },
        {
          label: 'Profile settings',
          href: '/dashboard/customers/profile',
          icon: UserCog,
        },
      ],
    },
    SITE_GROUP,
  ]
}

function isCurrent(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Dark, PizzaHub-flavoured sidebar tokens (overrides the light defaults). */
const SIDEBAR_THEME = {
  '--sidebar': '#14110F',
  '--sidebar-foreground': '#D6D3D1',
  '--sidebar-accent': 'rgb(63 63 70 / 65%)',
  '--sidebar-accent-foreground': '#FFFFFF',
  '--sidebar-border': 'rgb(255 255 255 / 8%)',
  '--sidebar-primary': '#F97316',
  '--sidebar-primary-foreground': '#FFFFFF',
  '--sidebar-ring': '#F97316',
} as CSSProperties

function UserAvatar({ user }: { user: DashboardUser }) {
  return user.image ? (
    <img
      src={user.image}
      alt={user.name}
      className="size-9 shrink-0 rounded-full object-cover ring-1 ring-white/10"
    />
  ) : (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-xs font-black uppercase text-orange-400 ring-1 ring-orange-500/30">
      {user.name.slice(0, 1)}
    </span>
  )
}

type DashboardShellProps = {
  user: DashboardUser
  children: ReactNode
}

export default function DashboardShell({
  user,
  children,
}: DashboardShellProps) {
  return (
    <SidebarProvider style={SIDEBAR_THEME}>
      <DashboardChrome user={user}>{children}</DashboardChrome>
    </SidebarProvider>
  )
}

function DashboardChrome({ user, children }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()

  const isForeignWorkspace = (Object.keys(ROLE_HOME) as DashboardRole[]).some(
    (role) =>
      role !== user.role &&
      (pathname === ROLE_HOME[role] ||
        pathname.startsWith(`${ROLE_HOME[role]}/`))
  )

  useEffect(() => {
    if (isForeignWorkspace) {
      router.replace(ROLE_HOME[user.role])
    }
  }, [isForeignWorkspace, router, user.role])

  if (isForeignWorkspace) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#11100F] text-sm font-medium text-neutral-400">
        Opening your {ROLE_META[user.role].label.toLowerCase()} workspace…
      </div>
    )
  }

  const groups = buildNav(user.role)
  const roleMeta = ROLE_META[user.role]
  const activeItem = groups
    .flatMap((group) => group.items)
    .filter((item) => isCurrent(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]
  const title = activeItem?.label ?? 'Dashboard'
  const collapsed = state === 'collapsed'

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-white/10 bg-[#14110F]"
      >
        <SidebarHeader className="gap-3 border-b border-white/5 p-4 group-data-[collapsible=icon]:p-1">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/25">
              <Pizza className="size-5 text-white" strokeWidth={2.4} />
            </span>

            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-base font-black tracking-tight text-white">
                Pizza<span className="text-orange-500">Hub.</span>
              </p>
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Operations
              </p>
            </div>
          </div>

          <span
            className={cn(
              'w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset group-data-[collapsible=icon]:hidden',
              'inline-flex',
              roleMeta.badgeClass
            )}
          >
            <ShieldCheck className="size-3" aria-hidden />
            {roleMeta.label} · {roleMeta.hint}
          </span>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4 group-data-[collapsible=icon]:px-0">
          {groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500 group-data-[collapsible=icon]:hidden">
                {group.label}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isHere = isCurrent(pathname, item.href)

                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                          render={<Link href={item.href} />}
                          isActive={isHere}
                          tooltip={item.label}
                          className={cn(
                            'relative text-neutral-400',
                            isHere &&
                              'bg-orange-500/15! font-semibold text-white!'
                          )}
                        >
                          <item.icon className="size-4 shrink-0" aria-hidden />
                          <span className="truncate">{item.label}</span>

                          {isHere && (
                            <span
                              aria-hidden
                              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-orange-500 group-data-[collapsible=icon]:hidden"
                            />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          <div className="mt-2 hidden rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-transparent p-3 group-data-[collapsible=icon]:hidden">
            <Flame className="size-4 text-orange-400" aria-hidden />
            <p className="mt-2 text-xs font-bold text-white">Fresh deals</p>
            <p className="mt-1 text-[11px] leading-4 text-neutral-400">
              20% off your first pie this week only.
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 transition hover:text-orange-300"
            >
              Order now
              <ChevronRight className="size-3" aria-hidden />
            </Link>
          </div>
        </SidebarContent>

        <SidebarFooter className="gap-2 border-t border-white/5 p-3 group-data-[collapsible=icon]:p-1">
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2 py-2 ring-1 ring-white/5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:ring-0">
            <UserAvatar user={user} />

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-xs font-bold text-white">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-neutral-500">
                {user.email}
              </p>
              <span
                className={cn(
                  'mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1 ring-inset',
                  roleMeta.badgeClass
                )}
              >
                {roleMeta.label}
              </span>
            </div>
          </div>

          <SignOutButton
            iconOnly={collapsed}
            variant="ghost"
            className={cn(
              'h-9 w-full rounded-lg px-2 text-neutral-400 hover:bg-orange-500/15 hover:text-orange-400',
              collapsed ? 'justify-center' : 'justify-start gap-2'
            )}
          />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="bg-[#11100F]! text-neutral-100">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-[#11100F]/90 px-4 backdrop-blur-xl md:px-6">
          <SidebarTrigger className="size-9 rounded-lg text-neutral-300 hover:bg-white/5 hover:text-white" />
          <SidebarSeparator orientation="vertical" className="h-6" />

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-white">{title}</h1>
            <p className="truncate text-[11px] text-neutral-500">
              {roleMeta.label} dashboard · PizzaHub
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span
              className={cn(
                'hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset sm:inline-flex',
                roleMeta.badgeClass
              )}
            >
              <Sparkles className="size-3" aria-hidden />
              {roleMeta.label}
            </span>

            <Link
              href="/"
              className="hidden h-9 items-center rounded-lg border border-white/10 px-3 text-xs font-semibold text-neutral-300 transition hover:border-orange-500/40 hover:text-orange-400 sm:inline-flex"
            >
              View site
            </Link>
          </div>
        </header>

        <div className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</div>
      </SidebarInset>
    </>
  )
}
