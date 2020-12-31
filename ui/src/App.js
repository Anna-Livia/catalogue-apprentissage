import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import LoginPage from "./pagesOld/LoginPage";
import Layout from "./pagesOld/Layout";
import "tabler-react/dist/Tabler.css";
import DashboardPage from "./pagesOld/DashboardPage";
import useAuth from "./common/hooks/useAuth";
import HomePage from "./pagesOld/HomePage";
import ResetPasswordPage from "./pagesOld/password/ResetPasswordPage";
import ForgottenPasswordPage from "./pagesOld/password/ForgottenPasswordPage";
import Users from "./pagesOld/admin/Users";
import PageReconciliation from "./pagesOld/ReconciliationPage";
import Report from "./pages/report";
import NotFoundPage from "./pagesOld/404";

import { QueryClient, QueryClientProvider } from "react-query";

function PrivateRoute({ children, ...rest }) {
  let [auth] = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        return auth.sub !== "anonymous" ? children : <Redirect to="/login" />;
      }}
    />
  );
}

const queryClient = new QueryClient();

export default () => {
  let [auth] = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router>
          <Switch>
            <PrivateRoute exact path="/">
              <Layout>{auth && auth.permissions.isAdmin ? <DashboardPage /> : <HomePage />}</Layout>
            </PrivateRoute>
            {auth && auth.permissions.isAdmin && (
              <PrivateRoute exact path="/admin/users">
                <Layout>
                  <Users />
                </Layout>
              </PrivateRoute>
            )}
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/reset-password" component={ResetPasswordPage} />
            <Route exact path="/forgotten-password" component={ForgottenPasswordPage} />
            <Route exact path="/report" component={Report} />
            <Route exact path="/coverage" component={PageReconciliation} />

            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </div>
    </QueryClientProvider>
  );
};
