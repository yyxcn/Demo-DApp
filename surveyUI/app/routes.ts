import { type RouteConfig, index, route } from "@react-router/dev/routes";
// index: 기본 URL
// route: 기본 URL + 라우팅

export default [
  index("features/dashboard/pages/dashboard.tsx"),
  route("/survey/all", "features/survey/pages/all-surveys.tsx"),
  route("/survey/create", "features/survey/pages/create-surveys.tsx"),
  route("/archieve/finish", "features/archieve/pages/finished-survey.tsx"),
  route("/profile/survey", "features/profile/pages/my-survey.tsx"),
  route("/profile/response", "features/profile/pages/my-response.tsx"),
] satisfies RouteConfig;
