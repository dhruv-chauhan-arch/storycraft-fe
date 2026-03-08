import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import LazyLoader from "../components/LazyLoader";
import "../scss/main.scss";
import { AppWrapper } from "../components/AppWrapper";
import { LIST_PROJECTS, STORIES, SYNC_JIRA } from "./pages/constants";

const Home = lazy(() => import("./pages/Home"));
const ListProjects = lazy(() => import("./pages/ListProjects"));
const Stories = lazy(() => import("./pages/Stories"));
const SyncJira = lazy(() => import("./pages/SyncJira"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LazyLoader />}>
        <AppWrapper>
          <Routes>
            <Route index element={<Home />} />
            <Route exact path={LIST_PROJECTS} element={<ListProjects />} />
            <Route exact path={STORIES} element={<Stories />} />
            <Route exact path={SYNC_JIRA} element={<SyncJira />} />
            <Route exact path="*" element={<NotFound />} />
          </Routes>
        </AppWrapper>
      </Suspense>
    </BrowserRouter>
  );
}
