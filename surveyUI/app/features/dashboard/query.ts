import type { DateTime } from "luxon";
import { supabase } from "~/postgres/supaclient";

export const getNumberData = async (
  lastStart: string,
  thisStart: string,
  End: String,
) => {
  const { data: lastWeek } = await supabase
    .from("daily_visitor")
    .select("count")
    .lt("day_start", thisStart)
    .gte("day_start", lastStart);
  const { data: thisWeek } = await supabase
    .from("daily_visitor")
    .select("count")
    .lt("day_start", End)
    .gte("day_start", thisStart);

  if (lastWeek && thisWeek) {
    const lastWeekCount = lastWeek.reduce((sum, value) => sum + value.count, 0);
    const thisWeekCount = thisWeek.reduce((sum, value) => sum + value.count, 0);
    return {
      value: thisWeekCount.toString(),
      trendValue: ((thisWeekCount / (lastWeekCount || 1)) * 100).toString(),
      upAndDown: thisWeekCount > lastWeekCount,
    };
  } else {
    return { value: "0", trendValue: "0", upAndDown: false };
  }
};

export const getLiveNumberData = async (
  lastStart: string,
  thisStart: string,
  End: String,
) => {
  // 현재 열려있는(finish=false) survey 전체 개수 -> 헤드라인 값
  const { count: openCount } = await supabase
    .from("survey")
    .select("*", { count: "exact", head: true })
    .eq("finish", false);

  // 트렌드용: 이번 주 / 지난 주에 새로 열린 survey 개수 비교
  const { count: thisWeekCount } = await supabase
    .from("survey")
    .select("*", { count: "exact", head: true })
    .eq("finish", false)
    .lt("created_at", End)
    .gte("created_at", thisStart);
  const { count: lastWeekCount } = await supabase
    .from("survey")
    .select("*", { count: "exact", head: true })
    .eq("finish", false)
    .lt("created_at", thisStart)
    .gte("created_at", lastStart);

  const open = openCount ?? 0;
  const thisWeek = thisWeekCount ?? 0;
  const lastWeek = lastWeekCount ?? 0;
  return {
    value: open.toString(),
    trendValue: ((thisWeek / (lastWeek || 1)) * 100).toString(),
    upAndDown: thisWeek > lastWeek,
  };
};
