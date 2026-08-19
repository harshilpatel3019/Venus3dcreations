import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../analytics";

// Fires a GA4 page_view event whenever the route changes.
const RouteTracker = () => {
  const location = useLocation();
  useEffect(() => {
    // Wait a tick so document.title reflects the new page
    const t = setTimeout(() => {
      trackPageView(location.pathname + location.search, document.title);
    }, 50);
    return () => clearTimeout(t);
  }, [location.pathname, location.search]);
  return null;
};

export default RouteTracker;
