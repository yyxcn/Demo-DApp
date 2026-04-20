import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { rabbykit } from "~/root";

export default function Navigation() {
  return (
    <nav className="fixed top-0 right-0 left-0">
      <div className="flex w-screen items-center justify-between py-5 px-5">
        <Link to="/" className="text-lg font-bold ">
          DESTAT
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            {/* Dashboard */}
            <NavigationMenuItem>
              <NavigationMenuLink>Dashboard</NavigationMenuLink>
            </NavigationMenuItem>

            {/* Survey */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Survey</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-2">
                    <NavigationMenuLink asChild>
                      <a
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-center rounded-md bg-linear-to-b no-underline outline-hidden select-none"
                        href="/"
                      >
                        <div className="text-lg font-medium">Survey</div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          Create and check surveys.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/survey/all">
                        <div className="text-sm leading-none font-medium">
                          All surveys
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug font-medium">
                          List all surveys
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/survey/create">
                        <div className="text-sm leading-none font-medium">
                          Create survey
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug font-medium">
                          Create survey
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Archieve */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Archieve</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-2">
                    <NavigationMenuLink asChild>
                      <a
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-center rounded-md bg-linear-to-b no-underline outline-hidden select-none"
                        href="/"
                      >
                        <div className="text-lg font-medium">Archieve</div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          Browse completed surveys.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/archieve/finish">
                        <div className="text-sm leading-none font-medium">
                          Finished surveys
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug font-medium">
                          Finished surveys
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Profile */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-2">
                    <NavigationMenuLink asChild>
                      <a
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-center rounded-md bg-linear-to-b no-underline outline-hidden select-none"
                        href="/"
                      >
                        <div className="text-lg font-medium">Profile</div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          Manage your surveys and responses.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/profile/survey">
                        <div className="text-sm leading-none font-medium">
                          My surveys
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug font-medium">
                          My surveys
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/profile/response">
                        <div className="text-sm leading-none font-medium">
                          My responses
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug font-medium">
                          My responses
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button
          onClick={() => {
            rabbykit.open();
          }}
        >
          Connect
        </Button>
      </div>
    </nav>
  );
}
