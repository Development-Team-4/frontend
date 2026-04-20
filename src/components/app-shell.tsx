'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  Plus,
  Bell,
  Menu,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Users,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { LoadingOverlay } from '@/components/loading-overlay';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/ui/site-logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { useStore } from '@/shared/store/store';
import { useUser } from '@/entities/user/model/use-user';
import { useNotifications } from '@/entities/notification/model';
import { useLogout } from '@/features/logout/model';

const getNavigation = (role: string) => {
  const baseNav = [
    { name: 'Мои тикеты', href: '/tickets', icon: Ticket },
    { name: 'Создать тикет', href: '/tickets/new', icon: Plus },
    {
      name: 'Темы и категории',
      href: '/categories',
      icon: FolderTree,
    },
    { name: 'Уведомления', href: '/notifications', icon: Bell },
    { name: 'Настройки', href: '/settings', icon: Settings },
  ];

  if (role === 'SUPPORT') {
    return [
      { name: 'Тикеты категории', href: '/support/tickets', icon: Ticket },
      { name: 'Мои назначенные', href: '/support/assigned', icon: Ticket },
      { name: 'Настройки', href: '/settings', icon: Settings },
    ];
  }

  if (role === 'ADMIN') {
    return [
      { name: 'Дашборд', href: '/', icon: LayoutDashboard },
      { name: 'Все тикеты', href: '/tickets', icon: Ticket },
      {
        name: 'Темы и категории',
        href: '/admin/categories',
        icon: FolderTree,
      },
      { name: 'Сотрудники', href: '/admin/staff', icon: Users },
      { name: 'Уведомления', href: '/notifications', icon: Bell },
      { name: 'Настройки', href: '/settings', icon: Settings },
    ];
  }

  return baseNav;
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'Администратор';
    case 'SUPPORT':
      return 'Поддержка';
    case 'USER':
      return 'Пользователь';
    default:
      return role;
  }
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const { isLoading, isError, refetch } = useUser({ enabled: !isAuthPage });
  useNotifications();

  const userData = useStore((state) => state.userData);
  const notifications = useStore((state) => state.notifications);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hasMountedRef = useRef(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const navigation = getNavigation(userData?.userRole || 'USER');
  const activeNavigationItem = navigation.find((item) =>
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href),
  );
  const { logout } = useLogout();

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (isAuthPage) return;
    refetch();
  }, [isAuthPage, pathname, refetch]);

  useEffect(() => {
    if (isAuthPage || isLoading || !isError) return;
    router.replace('/login');
  }, [isAuthPage, isError, isLoading, router]);

  useEffect(() => {
    if (!userData) return;

    if (pathname === '/' && userData.userRole !== 'ADMIN') {
      if (userData.userRole === 'SUPPORT') {
        router.replace('/support/tickets');
        return;
      }

      router.replace('/tickets');
      return;
    }

    if (pathname.startsWith('/admin') && userData.userRole !== 'ADMIN') {
      if (userData.userRole === 'SUPPORT') {
        router.replace('/support/tickets');
        return;
      }

      router.replace('/tickets');
      return;
    }

    if (pathname === '/notifications' && userData.userRole === 'SUPPORT') {
      router.replace('/support/tickets');
    }
  }, [pathname, router, userData]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isAuthPage) {
    const authAltHref = pathname === '/login' ? '/register' : '/login';
    const authAltLabel = pathname === '/login' ? 'Регистрация' : 'Вход';

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-4">
          <Link href="/" className="flex items-center gap-2">
            <SiteLogo className="h-10 w-10 rounded-md" />
            <span className="text-sm font-semibold text-foreground">
              TicketFlow
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={authAltHref}>{authAltLabel}</Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </div>
    );
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isError) return null;

  if (!userData) {
    return <LoadingOverlay />;
  }

  if (pathname === '/' && userData?.userRole !== 'ADMIN') {
    return <LoadingOverlay />;
  }

  if (pathname === '/notifications' && userData?.userRole === 'SUPPORT') {
    return <LoadingOverlay />;
  }

  if (pathname.startsWith('/admin') && userData?.userRole !== 'ADMIN') {
    return <LoadingOverlay />;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen overflow-hidden bg-background">
        <aside
          className={cn(
            'hidden border-r border-sidebar-border bg-sidebar transition-all duration-200 md:flex md:flex-col',
            collapsed ? 'w-16' : 'w-60',
          )}
        >
          <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
            <SiteLogo />
            {!collapsed && (
              <span className="tracking-tight text-sm font-semibold text-sidebar-foreground">
                TicketFlow
              </span>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3">
            <ul className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                const linkContent = (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-primary'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                    {!collapsed &&
                      item.href === '/notifications' &&
                      unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-auto h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    {collapsed &&
                      item.href === '/notifications' &&
                      unreadCount > 0 && (
                        <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-destructive" />
                      )}
                  </Link>
                );

                if (collapsed) {
                  return (
                    <li key={item.name} className="relative">
                      <Tooltip>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          {item.name}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                }

                return <li key={item.name}>{linkContent}</li>;
              })}
            </ul>
          </nav>

          <div className="border-t border-sidebar-border px-2 py-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex w-full items-center justify-center rounded-md p-2 text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            <div className="mt-2 flex items-center gap-3 rounded-md px-3 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                {userData?.userName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-sidebar-foreground">
                    {userData?.userName}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {userData ? getRoleLabel(userData.userRole) : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Открыть меню"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <SiteLogo className="h-10 w-10 rounded-md" />
              <span className="text-sm font-semibold text-foreground">
                TicketFlow
              </span>
            </div>

            <div className="flex min-w-10 items-center justify-end gap-2">
              <ThemeToggle />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </header>

          <header className="sticky top-0 z-20 hidden h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:flex">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {activeNavigationItem?.name || 'Раздел'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {userData?.userName} • {getRoleLabel(userData?.userRole || '')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
              <ThemeToggle />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 cursor-pointer gap-1.5"
                onClick={() => logout()}
              >
                <LogOut className="h-3.5 w-3.5" />
                Выйти
              </Button>
            </div>
          </header>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="w-[88vw] max-w-xs p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle>Меню</SheetTitle>
                <SheetDescription>
                  Навигация и быстрые действия
                </SheetDescription>
              </SheetHeader>

              <nav className="flex-1 overflow-y-auto p-2">
                <ul className="flex flex-col gap-1">
                  {navigation.map((item) => {
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);

                    return (
                      <li key={`mobile-${item.name}`}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-sidebar-accent text-sidebar-primary'
                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.name}</span>
                            {item.href === '/notifications' &&
                              unreadCount > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="ml-auto h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]"
                                >
                                  {unreadCount}
                                </Badge>
                              )}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-border p-3">
                <div className="mb-3 flex items-center gap-3 rounded-md bg-muted/50 px-3 py-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                    {userData?.userName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">
                      {userData?.userName}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {userData ? getRoleLabel(userData.userRole) : ''}
                    </p>
                  </div>
                </div>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4" />
                    Выйти
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
