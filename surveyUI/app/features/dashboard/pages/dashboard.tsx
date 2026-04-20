import { supabase } from "~/postgres/supaclient";

export async function loader() {
  const { data } = await supabase().from("test").select("*");
  console.log(data);
}

export default function Dashboard() {
  return <div>Hello destat world</div>;
}
