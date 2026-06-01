import TrendCard from "../components/trend-card";
import TrendChart from "../components/trend-chart";

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

export default function Dashboard() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="grid grid-cols-3 mt-10 gap-5 w-full">
        <TrendCard
          title={"Total Vistiors"}
          value={"123,123,123"}
          trendValue={"200%"}
          trendMessage={"Trending up"}
          periodMessage={"last 6 months"}
        />
        <TrendCard
          title={"Live Surveys"}
          value={"123"}
          trendValue={"200%"}
          trendMessage={"Trending up"}
          periodMessage={"last 6 months"}
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
          chartData={data}
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
