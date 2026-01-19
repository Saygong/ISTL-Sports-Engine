import { Navigate } from "react-router";
import { RoutesEnum } from "../AppRoutes.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";
import UniversalSkeletonPage from "./ui/UniversalSkeleton.tsx";

export type UserRole = "Player" | "Organizer" | "Referee";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedUserRoles,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <UniversalSkeletonPage />;
  }

  if (!user) {
    return <Navigate to={RoutesEnum.Login} replace />;
  } else if (allowedUserRoles && !allowedUserRoles.includes(user.__typename!)) {
    switch (user.__typename) {
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
        return <Navigate to={RoutesEnum.Login} replace />;
        break;
    }
  }

  return <>{children}</>;
};
