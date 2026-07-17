// lib/actions/analytics.actions.ts
"use server";

import { requireOwner } from "@/lib/guards";
import { rangeToSince, type AnalyticsRange } from "@/lib/analytics/range";
import { getRevenueSummary, getRevenueTrend, type RevenueRange } from "@/lib/analytics/revenue";
import { getOrderAnalytics, getOrdersTrend } from "@/lib/analytics/orders";
import { getCustomerAnalytics, getTopSpendingCustomers } from "@/lib/analytics/customers";
import { getReservationAnalytics, getPeakReservationHours } from "@/lib/analytics/reservations";
import { getKitchenAnalytics } from "@/lib/analytics/kitchen";
import {
  getBestSellingItems,
  getHighestRevenueItems,
  getLeastPopularItems,
  getCategoryPerformance,
} from "@/lib/analytics/menu";
import { getPaymentMethodBreakdown, getCouponAnalytics } from "@/lib/analytics/payments";
import { getMostRedeemedReward } from "@/lib/analytics/loyalty";
import { getLoyaltyStats, getTopLoyaltyCustomers } from "@/lib/actions/loyalty.actions";
import { toCsv } from "@/lib/analytics/csv";
import { prisma } from "@/lib/prisma";

/**
 * The full analytics report for /dashboard/analytics. One owner check,
 * one date range, every section fetched in parallel.
 */
export async function getFullAnalyticsReport(range: AnalyticsRange = "month") {
  await requireOwner();
  const since = rangeToSince(range);

  const [
    revenueToday,
    revenueWeek,
    revenueMonth,
    revenueYear,
    revenueTrend,
    orderStats,
    ordersTrend,
    customerStats,
    topCustomers,
    reservationStats,
    peakHours,
    kitchenStats,
    bestSellers,
    highestRevenueItems,
    leastPopular,
    categoryPerformance,
    paymentBreakdown,
    couponStats,
    loyaltyStats,
    topLoyaltyCustomers,
    mostRedeemedReward,
  ] = await Promise.all([
    getRevenueSummary("today"),
    getRevenueSummary("week"),
    getRevenueSummary("month"),
    getRevenueSummary("year"),
    getRevenueTrend(14),
    getOrderAnalytics(since),
    getOrdersTrend(14),
    getCustomerAnalytics(since),
    getTopSpendingCustomers(10),
    getReservationAnalytics(since),
    getPeakReservationHours(since),
    getKitchenAnalytics(since),
    getBestSellingItems(since, 8),
    getHighestRevenueItems(since, 8),
    getLeastPopularItems(since, 8),
    getCategoryPerformance(since),
    getPaymentMethodBreakdown(since),
    getCouponAnalytics(since),
    getLoyaltyStats(),
    getTopLoyaltyCustomers(5),
    getMostRedeemedReward(since),
  ]);

  return {
    range,
    revenue: { today: revenueToday, week: revenueWeek, month: revenueMonth, year: revenueYear },
    revenueTrend,
    orders: orderStats,
    ordersTrend,
    customers: customerStats,
    topCustomers,
    reservations: reservationStats,
    peakHours,
    kitchen: kitchenStats,
    menu: { bestSellers, highestRevenueItems, leastPopular, categoryPerformance },
    payments: paymentBreakdown,
    coupons: couponStats,
    loyalty: loyaltyStats,
    topLoyaltyCustomers,
    mostRedeemedReward,
  };
}

/**
 * Lightweight KPIs for the /dashboard Overview — today's numbers plus
 * whatever's currently in-flight (pending orders, kitchen queue, etc.),
 * not a full historical report.
 */
export async function getOverviewSnapshot() {
  await requireOwner();

  const [revenueToday, orderStats, ordersTrend, bestSellers, paymentBreakdown, activeReservations, kitchenQueue] =
    await Promise.all([
      getRevenueSummary("today"),
      getOrderAnalytics(rangeToSince("today")),
      getOrdersTrend(7),
      getBestSellingItems(rangeToSince("month"), 5),
      getPaymentMethodBreakdown(rangeToSince("today")),
      prisma.reservation.count({
        where: { deletedAt: null, status: { in: ["PENDING", "CONFIRMED"] } },
      }),
      prisma.kitchenTicket.count({
        where: { deletedAt: null, status: { in: ["QUEUED", "PREPARING"] } },
      }),
    ]);

  const recentOrders = await prisma.order.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      orderType: true,
      totalAmount: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  });

  return {
    revenueToday,
    orderStats,
    ordersTrend,
    bestSellers,
    paymentBreakdown,
    activeReservations,
    kitchenQueue,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      orderType: o.orderType,
      totalAmount: Number(o.totalAmount),
      createdAt: o.createdAt,
      customerName: o.user?.name ?? "—",
    })),
  };
}

// ============ CSV EXPORTS ============

export async function exportOrdersCsvAction(range: AnalyticsRange = "month"): Promise<string> {
  await requireOwner();
  const since = rangeToSince(range);

  const orders = await prisma.order.findMany({
    where: { deletedAt: null, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    select: {
      orderNumber: true,
      orderType: true,
      status: true,
      subtotal: true,
      discountAmount: true,
      totalAmount: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
    },
  });

  return toCsv(
    orders.map((o) => ({
      orderNumber: o.orderNumber,
      date: o.createdAt.toISOString(),
      customer: o.user?.name ?? "Guest",
      email: o.user?.email ?? "",
      type: o.orderType,
      status: o.status,
      subtotal: Number(o.subtotal).toFixed(2),
      discount: Number(o.discountAmount).toFixed(2),
      total: Number(o.totalAmount).toFixed(2),
    })),
    [
      { key: "orderNumber", header: "Order Number" },
      { key: "date", header: "Date" },
      { key: "customer", header: "Customer" },
      { key: "email", header: "Email" },
      { key: "type", header: "Type" },
      { key: "status", header: "Status" },
      { key: "subtotal", header: "Subtotal" },
      { key: "discount", header: "Discount" },
      { key: "total", header: "Total" },
    ]
  );
}

export async function exportRevenueCsvAction(): Promise<string> {
  await requireOwner();
  const trend = await getRevenueTrend(30);

  return toCsv(trend, [
    { key: "date", header: "Date" },
    { key: "orders", header: "Paid Orders" },
    { key: "revenue", header: "Revenue" },
  ]);
}

export async function exportReservationsCsvAction(range: AnalyticsRange = "month"): Promise<string> {
  await requireOwner();
  const since = rangeToSince(range);

  const reservations = await prisma.reservation.findMany({
    where: { deletedAt: null, createdAt: { gte: since } },
    orderBy: { reservationAt: "desc" },
    select: {
      customerName: true,
      phone: true,
      guestCount: true,
      reservationAt: true,
      status: true,
      table: { select: { tableNumber: true } },
    },
  });

  return toCsv(
    reservations.map((r) => ({
      customerName: r.customerName,
      phone: r.phone,
      guests: r.guestCount,
      date: r.reservationAt.toISOString(),
      status: r.status,
      table: r.table ? String(r.table.tableNumber) : "",
    })),
    [
      { key: "customerName", header: "Customer" },
      { key: "phone", header: "Phone" },
      { key: "guests", header: "Guests" },
      { key: "date", header: "Date" },
      { key: "status", header: "Status" },
      { key: "table", header: "Table" },
    ]
  );
}
