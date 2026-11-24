'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth-client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'

import {
  LayoutDashboard,
  Pizza,
  PlusCircle,
  LogOut,
  ChefHat,
  UserRound,
  ShieldCheck,
  Store,
  Home,
} from 'lucide-react'

type Role = 'admin' | 'vendor' | 'customer'

type MenuItem = {
  name: string
  url: string
  icon: typeof LayoutDashboard
}

type MenuGroup = {
  title: string
  items: MenuItem[]
}

const menuItems: Record<Role, MenuGroup[]> = {
  admin: [
    {
      title: 'NAVIGATION',
      items: [
        {
          name: 'Home',
          url: '/',
          icon: Home,
        },
      ],
    },
    {
      title: 'OVERVIEW',
      items: [
        {
          name: 'Dashboard',
          url: '/dashboard/admin',
          icon: LayoutDashboard,
        },
      ],
    },
  ],

  vendor: [
    {
      title: 'NAVIGATION',
      items: [
        {
          name: 'Home',
          url: '/',
          icon: Home,
        },
      ],
    },
    {
      title: 'MENU MANAGEMENT',
      items: [
        {
          name: 'Menu Items',
          url: '/dashboard/vendor/menu',
          icon: Pizza,
        },
        {
          name: 'Add Menu Item',
          url: '/dashboard/vendor/menu/add',
          icon: PlusCircle,
        },
      ],
    },
  ],

  customer: [
    {
      title: 'NAVIGATION',
      items: [
        {
          name: 'Home',
          url: '/',
          icon: Home,
        },
      ],
    },
    {
      title: 'OVERVIEW',
      items: [
        {
          name: 'Dashboard',
          url: '/dashboard/customers',
          icon: LayoutDashboard,
        },
      ],
    },
  ],
}

const roleConfig: Record<
  Role,
  {
    label: string
    icon: typeof ShieldCheck
  }
> = {
  admin: {
    label: 'Administrator',
    icon: ShieldCheck,
  },
  vendor: {
    label: 'Restaurant Partner',
    icon: Store,
  },
  customer: {
    label: 'Customer',
    icon: UserRound,
  },
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: session, isPending } = useSession()

  const roleValue = session?.user?.role

  const role: Role | null =
    roleValue === 'admin' || roleValue === 'vendor' || roleValue === 'customer'
      ? roleValue
      : null

  const user = session?.user

  const handleLogout = async () => {
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  if (isPending || !session || !role) {
    return null
  }

  const config = roleConfig[role]
  const RoleIcon = config.icon

  return (
    <Sidebar
      collapsible="icon"
      className="!border-r !border-zinc-800 !bg-[#18181B] !text-white"
    >
      <SidebarHeader className="!bg-[#18181B] p-5">
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-red-500 to-orange-500 text-white shadow-lg shadow-red-950/40 transition-all duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:shadow-orange-500/20">
            <ChefHat className="size-7" />
          </div>

          <div className="grid group-data-[collapsible=icon]:hidden">
            <span className="text-2xl font-black tracking-tight text-white">
              Pizza<span className="text-orange-500">Hub.</span>
            </span>

            <span className="mt-1 text-[10px] font-bold tracking-[0.22em] text-zinc-400">
              THE ART OF GREAT PIZZA
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="!bg-zinc-700" />

      <SidebarContent className="!bg-[#18181B] px-3 py-5">
        <div className="group mb-7 rounded-2xl border border-zinc-700/80 bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 transition-all duration-300 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-950/20 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 text-orange-400 transition-transform duration-300 group-hover:scale-110">
              <RoleIcon className="size-6" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-white">{config.label}</p>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-xs font-medium text-zinc-300">
                  Workspace Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {menuItems[role].map((group) => (
          <SidebarGroup key={group.title} className="mb-5 !bg-transparent">
            <SidebarGroupLabel className="mb-3 px-3 text-[11px] font-extrabold tracking-[0.18em] !text-zinc-400">
              {group.title}
            </SidebarGroupLabel>

            <SidebarMenu>
              {group.items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (pathname.startsWith(`${item.url}/`) &&
                    !group.items.some(
                      (other) =>
                        other.url !== item.url &&
                        (pathname === other.url ||
                          pathname.startsWith(`${other.url}/`)),
                    ))

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      tooltip={item.name}
                      className={`group/menu mb-1.5 h-12 rounded-xl px-3 transition-all duration-300 ease-out active:scale-[0.97] ${
                        isActive
                          ? '!bg-gradient-to-r !from-red-500 !to-orange-500 !text-white shadow-lg shadow-red-950/40 hover:!from-red-600 hover:!to-orange-600'
                          : '!bg-transparent !text-zinc-300 hover:translate-x-1 hover:!bg-zinc-800 hover:!text-orange-400'
                      }`}
                    >
                      <item.icon
                        className={`size-5 shrink-0 transition-all duration-300 group-hover/menu:scale-110 ${
                          isActive
                            ? 'text-white'
                            : 'text-orange-400 group-hover/menu:text-orange-300'
                        }`}
                      />

                      <span className="font-semibold tracking-wide">
                        {item.name}
                      </span>

                      {isActive && (
                        <span className="ml-auto size-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] group-data-[collapsible=icon]:hidden" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="!border-t !border-zinc-700 !bg-[#18181B] p-3">
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-transparent p-2 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800 group-data-[collapsible=icon]:justify-center">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-base font-black text-white shadow-md shadow-red-950/30 transition-transform duration-300 hover:scale-110">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-bold text-white">
              {user?.name || 'User'}
            </p>

            <p className="truncate text-xs text-zinc-400">{user?.email}</p>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Sign Out"
              className="h-11 rounded-xl !bg-transparent !text-zinc-300 transition-all duration-300 hover:translate-x-1 hover:!bg-red-500/15 hover:!text-red-400 active:scale-[0.97]"
            >
              <LogOut className="size-5 transition-transform duration-300 group-hover:rotate-[-8deg]" />
              <span className="font-semibold">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <p className="pt-4 text-center text-[9px] font-semibold tracking-wider text-zinc-500 group-data-[collapsible=icon]:hidden">
          © 2026 PIZZAHUB. ALL RIGHTS RESERVED.
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
