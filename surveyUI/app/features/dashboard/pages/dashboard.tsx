import { supabase } from "~/postgres/supaclient";
import TrendCard from "../components/trend-card";
import TrendChart from "../components/trend-chart";
import type { Route } from "./+types/dashboard";
import { DateTime } from "luxon";
import { getNumberData, getLiveNumberData } from "../query";

const data = [
  { date: "2025-10-01", data: 186 },
  { date: "2025-10-02", data: 205 },
  { date: "2025-10-03", data: 173 },
  { date: "2025-10-04", data: 221 },
  { date: "2025-10-05", data: 198 },
  { date: "2025-10-06", data: 134 },
  { date: "2025-10-07", data: 147 },
  { date: "2025-10-08", data: 263 },
  { date: "2025-10-09", data: 241 },
  { date: "2025-10-10", data: 189 },
  { date: "2025-10-11", data: 312 },
  { date: "2025-10-12", data: 278 },
  { date: "2025-10-13", data: 155 },
  { date: "2025-10-14", data: 167 },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  await supabase.rpc("increment_daily_visitor", {
    day: DateTime.now().startOf("day").toISO({ includeOffset: false }),
  });

  const thisWeekStart = DateTime.now()
    .startOf("week")
    .toISO({ includeOffset: false });
  const thisWeekEnd = DateTime.now().toISO({ includeOffset: false });
  const lastWeekStart = DateTime.now()
    .startOf("week")
    .minus({ week: 1 })
    .toISO({ includeOffset: false });

  const { data: liveSurveyCount } = await supabase
    .from("daily_live_survey")
    .select("count, created_at")
    .order("created_at");
  let formedLivedSurveyCount = [
    {
      date: "",
      data: 0,
    },
  ];
  if (liveSurveyCount) {
    formedLivedSurveyCount = liveSurveyCount.map((c) => {
      return {
        date: c.created_at,
        data: c.count,
      };
    });
  }

  const [visitors, liveSurveys] = await Promise.all([
    getNumberData(lastWeekStart, thisWeekStart, thisWeekEnd),
    getLiveNumberData(lastWeekStart, thisWeekStart, thisWeekEnd),
  ]);

  return { visitors, liveSurveys, formedLivedSurveyCount };
};

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="grid grid-cols-3 mt-10 gap-5 w-full">
        <TrendCard
          title={"Total Vistiors"}
          value={loaderData.visitors.value}
          trendValue={loaderData.visitors.trendValue + "%"}
          trendMessage={
            loaderData.visitors.upAndDown ? "Trending Up" : "Trending Down"
          }
          periodMessage={"last 7 days"}
        />
        <TrendCard
          title={"Live Surveys"}
          value={loaderData.liveSurveys.value}
          trendValue={loaderData.liveSurveys.trendValue + "%"}
          trendMessage={
            loaderData.liveSurveys.upAndDown ? "Trending Up" : "Trending Down"
          }
          periodMessage={"last 7 days"}
        />
        <TrendCard
          title={"Archived Surveys"}
          value={"123,123"}
          trendValue={"200%"}
          trendMessage={"Trending up"}
          periodMessage={"last 6 months"}
        />
      </div>
      <div className="grid grid-cols-2 mt-5 gap-5 w-full ">
        <TrendChart
          title={"Live Surveys"}
          description={"Daily live surveys count"}
          trendMessage={""}
          periodMessage={""}
          chartData={loaderData.formedLivedSurveyCount}
        />
        <TrendChart
          title={"Archived Surveys"}
          description={"Daily archived surveys count"}
          trendMessage={""}
          periodMessage={""}
          chartData={data}
        />
      </div>
    </div>
  );
}
