import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Movies from "@/pages/Movies";
import MovieDetail from "@/pages/MovieDetail";
import Player from "./pages/Player";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import Genres from "@/pages/Genres";
import Countries from "@/pages/Countries";

function Router() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    window.location.href = `/movies?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <Header onSearch={handleSearch} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/movies" component={Movies} />
        <Route path="/tv-series">{() => <Movies />}</Route>
        <Route path="/movie/:id" component={MovieDetail} />
        <Route path="/player/:id" component={Player} />
        <Route path="/admin" component={Admin} />
        <Route path="/genres" component={Genres} />
        <Route path="/countries" component={Countries} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
