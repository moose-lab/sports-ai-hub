import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import HyroxZone from "./pages/HyroxZone";
import MatchCenter from "./pages/MatchCenter";
import SportScene from "./pages/SportScene";

// Resolve the deploy base path (Cloudflare Pages: "/", GitHub Pages:
// "/sports-ai-hub/") into a wouter base with no trailing slash.
const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function Router() {
  return (
    <WouterRouter base={ROUTER_BASE}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/match-center"} component={MatchCenter} />
        <Route path={"/hyrox"} component={HyroxZone} />
        {/* HYROX has a bespoke zone page; the upstream catalog's scene.route
            (/sports/hyrox) and every link built from it land there too. Other
            slugs keep the generic data-driven scene page. */}
        <Route path={"/sports/:slug"}>
          {(params) => (params.slug === "hyrox" ? <Redirect to="/hyrox" /> : <SportScene params={params} />)}
        </Route>
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
