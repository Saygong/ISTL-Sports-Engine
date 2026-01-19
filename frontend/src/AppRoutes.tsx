import { Route, Routes } from "react-router";

import OrganizerCreateTournament from "./pages/organizer/NewTournament.tsx";
import RefereeMatchResult from "./pages/referee/NewMatchResult.tsx";

import PlayerTournamentRegistrations from "./pages/player/TournamentRegistrations.tsx";
import PlayerTournamentDetail from "./pages/player/TournamentDetail.tsx";
import PlayerBookedMatches from "./pages/player/BookedMatches.tsx";

import SignUp from "./pages/user/SignUp.tsx";
import ForgotPassword from "./pages/user/ForgotPassword.tsx";
import ChangePassword from "./pages/user/ChangePassword.tsx";
import { PublicRoute } from "./components/PublicRoute.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Profile from "./pages/user/Profile.tsx";
import Login from "./pages/user/Login.tsx";
import OrganizerHomePage from "./pages/organizer/HomePage.tsx";
import RefereeHomePage from "./pages/referee/HomePage.tsx";
import PlayerHomePage from "./pages/player/HomePage.tsx";

export enum RoutesEnum {
  Login = "/",
  SignUp = "/users/sign_up",
  ForgotPassword = "/users/password/new",
  ChangePassword = "/users/password/edit",
  Profile = "/user/profile",
  OrganizerHomePage = "/organizer",
  OrganizerCreateTournament = "/organizer/tournaments/new",
  RefereeHomePage = "/referee",
  RefereeMatchResult = "/referee/matches/:id/results/new",
  PlayerHomePage = "/player",
  PlayerTournamentDetail = "/player/tournaments/:id",
  PlayerTournamentRegistrations = "/player/registrations",
  PlayerBookedMatches = "/player/matches",
}

export const AppRoutes = () => {
  return (
    <Routes>
      {/* SHARED */}
      {/* Public routes - redirect to dashboard if already authenticated */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/users/sign_up"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="/users/password/new"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/users/password/edit"
        element={
          <PublicRoute>
            <ChangePassword />
          </PublicRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedUserRoles={["Organizer", "Player", "Referee"]}>
            <Profile />
          </ProtectedRoute>
        }
      />
      {/* ORGANIZER */}
      <Route
        path="/organizer"
        element={
          <ProtectedRoute allowedUserRoles={["Organizer"]}>
            <OrganizerHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/tournaments/new"
        element={
          <ProtectedRoute allowedUserRoles={["Organizer"]}>
            <OrganizerCreateTournament />
          </ProtectedRoute>
        }
      />
      {/* REFEREE */}
      <Route
        path="/referee"
        element={
          <ProtectedRoute allowedUserRoles={["Referee"]}>
            <RefereeHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referee/matches/:id/results/new"
        element={
          <ProtectedRoute allowedUserRoles={["Referee"]}>
            <RefereeMatchResult />
          </ProtectedRoute>
        }
      />
      {/* PLAYER */}
      <Route
        path="/player"
        element={
          <ProtectedRoute allowedUserRoles={["Player"]}>
            <PlayerHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/player/tournaments/:id"
        element={
          <ProtectedRoute allowedUserRoles={["Player"]}>
            <PlayerTournamentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/player/registrations"
        element={
          <ProtectedRoute allowedUserRoles={["Player"]}>
            <PlayerTournamentRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/player/matches"
        element={
          <ProtectedRoute allowedUserRoles={["Player"]}>
            <PlayerBookedMatches />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
