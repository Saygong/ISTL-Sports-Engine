import { PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { RoutesEnum } from "../AppRoutes.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";
import UniversalSkeletonPage from "./ui/UniversalSkeleton.tsx";

// Component to redirect authenticated users away from auth pages
export const PublicRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <UniversalSkeletonPage />;
  }

  if (isAuthenticated) {
    switch (user?.__typename) {
      case "Player":
        return <Navigate to={RoutesEnum.PlayerHomePage} replace />;
        break;
      case "Organizer":
        return <Navigate to={RoutesEnum.OrganizerHomePage} replace />;
        break;
      case "Referee":
        return <Navigate to={RoutesEnum.RefereeHomePage} replace />;
        break;
      default:
        break;
    }
  }

  return <>{children}</>;
};
