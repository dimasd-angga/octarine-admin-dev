"use client";

import { DevtoolsProvider } from "@providers/devtools";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import React, { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Global, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import {
  RefineThemes,
  ThemedLayoutV2,
  ThemedSiderV2,
} from "@refinedev/mantine";
import {
  IconPhoto,
  IconBriefcase,
  IconFileText,
  IconShoppingCart,
  IconDatabase,
  IconCategory,
  IconTicket,
  IconDashboard,
  IconFile,
  IconUser,
  IconDiscount,
  IconDiscount2,
  IconStar,
  IconAffiliate,
  IconMenuOrder,
  IconLogs,
  IconReportAnalytics,
  IconChartBar,
  IconUsers,
  IconFlagQuestion,
  IconUserCheck,
  IconHeadset,
  IconArticle,
  IconMessage,
  IconListCheck,
  IconFileLike,
} from "@tabler/icons-react";
import "@styles/global.css";

import { authProvider } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider";
import { axiosInstance } from "@service/axiosInstance";
import { CustomTitle } from "@components/layout/CustomSidebarTitle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isLoginPage, setIsLoginPage] = useState(false);
  const resources = [
    {
      name: "dashboard",
      list: "/dashboard",
      meta: {
        label: "Dashboard",
        canDelete: true,
        icon: <IconDashboard />,
      },
    },
    {
      name: "banner",
      list: "/banner",
      edit: "/banner/edit/:id",
      create: "/banner/create",
      meta: {
        label: "Banner Management",
        canDelete: true,
        icon: <IconPhoto />,
      },
    },
    {
      name: "career",
      list: "/career",
      create: "/career/create",
      edit: "/career/edit/:id",
      meta: {
        label: "Career Management",
        canDelete: true,
        icon: <IconBriefcase />,
      },
    },
    {
      name: "article-management",
      list: "/article-management",
      meta: {
        label: "Article Management",
        icon: <IconFileText />,
      },
    },
    {
      name: "article",
      list: "/article",
      create: "/article/create",
      edit: "/article/edit/:id",
      parentName: "article-management",
      meta: {
        label: "Article",
        canDelete: true,
        icon: <IconArticle />,
      },
    },
    // {
    //   name: "comment",
    //   list: "/comment",
    //   parentName: "article-management",
    //   meta: {
    //     label: "Comment",
    //     canDelete: true,
    //     icon: <IconMessage />,
    //   },
    // },
    {
      name: "product",
      list: "/product",
      create: "/product/create",
      edit: "/product/edit/:id",
      meta: {
        label: "Product",
        canDelete: true,
        icon: <IconShoppingCart />,
      },
    },
    {
      name: "voucher",
      list: "/voucher",
      create: "/voucher/create",
      edit: "/voucher/edit/:id",
      meta: {
        label: "Voucher",
        canDelete: true,
        icon: <IconTicket />,
      },
    },
    {
      name: "order",
      list: "/order",
      show: "/order/show/:id",
      meta: {
        label: "Order",
        canDelete: true,
        icon: <IconListCheck />,
      },
    },
    {
      name: "promo",
      list: "/promo",
      create: "/promo/create",
      edit: "/promo/edit/:id",
      meta: {
        label: "Promo",
        canDelete: true,
        icon: <IconTicket />,
      },
    },
    // {
    //   name: "product/type",
    //   list: "/type",
    //   create: "/type/create",
    //   edit: "/type/edit/:id",
    //   parentName: "master-data",
    //   meta: {
    //     label: "Type",
    //     canDelete: true,
    //     icon: <IconCategory />,
    //   },
    // },
    {
      name: "discovery",
      list: "/discovery",
      create: "/discovery/create",
      edit: "/discovery/edit/:id",
      delete: "/discovery/delete/:id",
      meta: {
        label: "Discovery",
        canDelete: true,
        icon: <IconDiscount />,
      },
    },
    {
      name: "audiance-review",
      list: "/audiance-review",
      create: "/audiance-review/create",
      edit: "/audiance-review/edit/:id",
      delete: "/audiance-review/delete/:id",
      meta: {
        label: "Audiance Review",
        canDelete: true,
        icon: <IconStar />,
      },
    },
    {
      name: "payment-gateway-integration",
      list: "/payment-gateway-integration",
      meta: {
        label: "Payment Gateway Integration",
        canDelete: true,
        icon: <IconLogs />,
      },
    },
    {
      name: "live-chat-support",
      list: "/live-chat-support",
      meta: {
        label: "Live Chat Support",
        icon: <IconHeadset />,
      },
    },
    {
      name: "user-management",
      list: "/user-management",
      meta: {
        label: "User Management",
        icon: <IconUser />,
      },
    },
    {
      name: "registered-user",
      list: "/registered-user",
      show: "/registered-user/show/:id",
      edit: "/registered-user/edit/:id",
      parentName: "user-management",
      meta: {
        label: "Registered Users",
        canDelete: true,
        icon: <IconUserCheck />,
      },
    },
    {
      name: "user-faq",
      list: "/user-faq",
      create: "/user-faq/create",
      edit: "/user-faq/edit/:id",
      parentName: "user-management",
      meta: {
        label: "User FAQ",
        canDelete: true,
        icon: <IconFlagQuestion />,
      },
    },
    {
      name: "affiliate-management",
      meta: {
        label: "Affiliate Management",
        icon: <IconAffiliate />,
      },
    },
    {
      name: "affiliates",
      list: "/affiliates",
      show: "/affiliates/show/:id",
      create: "/affiliates/create",
      edit: "/affiliates/edit/:id",
      parentName: "affiliate-management",
      meta: {
        label: "Affiliates",
      },
    },
    {
      name: "affiliate-performance",
      show: "/affiliates/performance/:id",
      parentName: "affiliates",
      meta: {
        label: "Performance",
      },
    },
    {
      name: "affiliate-commissions",
      list: "/commissions",
      parentName: "affiliate-management",
      meta: {
        label: "Commissions",
      },
    },
    {
      name: "product/type",
      list: "/type",
      create: "/type/create",
      edit: "/type/edit/:id",
      parentName: "master-data",
      meta: {
        label: "Type",
        canDelete: true,
        icon: <IconCategory />,
      },
    },
    {
      name: "user-wishlist",
      list: "/user-wishlist",
      meta: {
        label: "User Wishlist",
        canDelete: true,
        icon: <IconFileLike />,
      },
    },
    {
      name: "admin-user-management",
      list: "/admin-user-management",
      create: "/admin-user-management/create",
      edit: "/admin-user-management/edit/:id",
      meta: {
        label: "Admin User Management",
        canDelete: true,
        icon: <IconUsers />,
      },
    },
    {
      name: "master-data",
      list: "/master-data",
      meta: {
        label: "Master Data",
        icon: <IconDatabase />,
      },
    },
    {
      name: "product/type",
      list: "/type",
      create: "/type/create",
      edit: "/type/edit/:id",
      parentName: "master-data",
      meta: {
        label: "Type",
        canDelete: true,
        icon: <IconCategory />,
      },
    },
    {
      name: "loyalty-tiers",
      list: "/loyalty-tiers",
      create: "/loyalty-tiers/create",
      edit: "/loyalty-tiers/edit/:id",
      parentName: "master-data",
      meta: {
        label: "Loyalty Tiers",
        canDelete: true,
        icon: <IconCategory />,
      },
    },
    {
      name: "reports",
      list: "/reports",
      meta: {
        label: "Reports",
        icon: <IconReportAnalytics />,
      },
    },
    {
      name: "sales-reports",
      list: "/reports/sales",
      meta: {
        parent: "reports",
        label: "Sales Report",
        icon: <IconChartBar />,
      },
    },
    {
      name: "user-reports",
      list: "/reports/user",
      meta: {
        parent: "reports",
        label: "User Report",
        icon: <IconUsers />,
      },
    },
    {
      name: "voucher-reports",
      list: "/reports/voucher",
      meta: {
        parent: "reports",
        label: "Promo/Voucher Report",
        icon: <IconTicket />,
      },
    },
    {
      name: "affiliate-reports",
      list: "/reports/affiliate",
      meta: {
        parent: "reports",
        label: "Affiliate Report",
        icon: <IconAffiliate />,
      },
    },
    {
      name: "static-pages",
      list: "/static-pages",
      meta: {
        label: "Static Pages",
        icon: <IconFile />,
      },
    },
    {
      name: "about-us-edit",
      list: "/about-us",
      edit: "/about-us/edit",
      parentName: "static-pages",
      meta: {
        label: "Edit About Us",
        canDelete: true,
      },
    },
    {
      name: "contact-us-edit",
      list: "/contact-us",
      edit: "/contact-us/edit",
      parentName: "static-pages",
      meta: {
        label: "Edit Contact Us",
        canDelete: true,
      },
    },
    {
      name: "privacy-policy-edit",
      list: "/privacy-policy",
      edit: "/privacy-policy/edit",
      parentName: "static-pages",
      meta: {
        label: "Edit Privacy Policy",
        canDelete: true,
      },
    },
    {
      name: "terms-conditions-edit",
      list: "/terms-conditions",
      edit: "/terms-conditions/edit",
      parentName: "static-pages",
      meta: {
        label: "Edit Terms & Conditions",
        canDelete: true,
      },
    },
  ];

  useEffect(() => {
    setIsLoginPage(pathname === "/login");
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <Suspense>
          <MantineProvider
            theme={RefineThemes.Blue}
            withNormalizeCSS
            withGlobalStyles
          >
            <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />

            <NotificationsProvider position="top-right">
              <RefineKbarProvider>
                <DevtoolsProvider>
                  <Refine
                    routerProvider={routerProvider}
                    dataProvider={dataProvider(axiosInstance)}
                    authProvider={authProvider}
                    resources={resources}
                  >
                    {isLoginPage ? (
                      children
                    ) : (
                      <ThemedLayoutV2
                        Sider={() => <ThemedSiderV2 Title={CustomTitle} />}
                      >
                        {children}
                      </ThemedLayoutV2>
                    )}
                    <RefineKbar />
                  </Refine>
                </DevtoolsProvider>
              </RefineKbarProvider>
            </NotificationsProvider>
          </MantineProvider>
        </Suspense>
      </body>
    </html>
  );
}
