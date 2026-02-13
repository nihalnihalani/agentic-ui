import { NextRequest, NextResponse } from "next/server";

interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  sparklineData: number[];
}

function randomize(base: number, variance: number): number {
  return base + (Math.random() - 0.5) * 2 * variance;
}

function generateSparkline(base: number, trend: number, points: number): number[] {
  const data: number[] = [];
  let current = base * 0.7;
  for (let i = 0; i < points; i++) {
    current += trend + (Math.random() - 0.5) * base * 0.05;
    data.push(Math.round(current * 100) / 100);
  }
  return data;
}

function getMetrics(range: string): DashboardMetric[] {
  const points = range === "7d" ? 7 : range === "90d" ? 12 : 8;

  const mrr = randomize(48500, 3000);
  const churn = randomize(2.1, 0.4);
  const nps = Math.round(randomize(72, 5));
  const users = Math.round(randomize(1234, 150));
  const revenue = randomize(142000, 10000);
  const avgTicket = randomize(38, 4);

  return [
    {
      id: "mrr",
      title: "MRR",
      value: `$${(mrr / 1000).toFixed(1)}k`,
      change: `+${randomize(12, 3).toFixed(1)}%`,
      changeType: "positive",
      sparklineData: generateSparkline(mrr / 1000, 1.5, points),
    },
    {
      id: "churn-rate",
      title: "Churn Rate",
      value: `${churn.toFixed(1)}%`,
      change: `-${randomize(0.3, 0.1).toFixed(1)}%`,
      changeType: "positive",
      sparklineData: generateSparkline(churn, -0.1, points),
    },
    {
      id: "nps-score",
      title: "NPS Score",
      value: `${nps}`,
      change: `+${Math.round(randomize(5, 2))}`,
      changeType: "positive",
      sparklineData: generateSparkline(nps, 1, points),
    },
    {
      id: "active-users",
      title: "Active Users",
      value: users.toLocaleString(),
      change: `+${randomize(8, 2).toFixed(1)}%`,
      changeType: "positive",
      sparklineData: generateSparkline(users, 20, points),
    },
    {
      id: "revenue",
      title: "Revenue",
      value: `$${Math.round(revenue / 1000)}k`,
      change: `+${randomize(15, 3).toFixed(1)}%`,
      changeType: "positive",
      sparklineData: generateSparkline(revenue / 1000, 5, points),
    },
    {
      id: "avg-ticket",
      title: "Avg Ticket",
      value: `$${Math.round(avgTicket)}`,
      change: `+${randomize(2, 1).toFixed(1)}%`,
      changeType: "positive",
      sparklineData: generateSparkline(avgTicket, 0.5, points),
    },
  ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";

  const validRanges = ["7d", "30d", "90d"];
  const selectedRange = validRanges.includes(range) ? range : "30d";

  const metrics = getMetrics(selectedRange);

  return NextResponse.json(metrics);
}
