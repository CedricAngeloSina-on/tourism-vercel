import {
    createRoutesFromElements,
    createBrowserRouter,
    Route,
    Navigate,
} from "react-router-dom";
import HomeUI from "./HomeUI/home";
import NavbarParent from "./HomeUI/navbar";
import LoginUI from "./HomeUI/login";
import AdminUI from "./AdminPanel/adminpanel";
import AEform from "./AdminPanel/AEform";
import WorkforceForm from "./AdminPanel/workforceForm";
import Logout from "./AdminPanel/logout";
import CreateAccount from "./AdminPanel/createaccount";
import ErrorHandle from "./assets/components/errorHandle";
import NotFound from "./assets/components/notFound";
import Dashboard from "./AdminPanel/dashboard";
import ListUser from "./AdminPanel/listUser";
import ListEntry from "./AdminPanel/listEntry";
import CreateMunicipality from "./AdminPanel/createMunicipality";
import CreateEstablishment from "./AdminPanel/createEstablishment";
import ArrivalsMenu from "./AdminPanel/arrivalsMenu";
import OvernightsMenu from "./AdminPanel/overnightsMenu";
import RevenueExpenditureMenu from "./AdminPanel/revenue&expenditureMenu";
import OccupancyRateMenu from "./AdminPanel/occupancyrateMenu";
import AverageLengthofStayMenu from "./AdminPanel/averageLengthofstayMenu";
import ForcastLengthOfStayMenu from "./AdminPanel/forcastingAverageLengthofstayMenu";
import ForcastWorkforceMenu from "./AdminPanel/forcastingWorkforce";
import ForcastMarketSegmentsMenu from "./AdminPanel/forcastingMarketSegments";
import Locations from "./AdminPanel/guimarasMapLocations";
import Heatmap from "./AdminPanel/guimarasMap";
import ScatterPlot from "./AdminPanel/guimarasMapScatter";
import MarketSegmentsMenu from "./AdminPanel/marketsegmentsMenu";
import EmploymentAndWorkForceMenu from "./AdminPanel/employmentAndWorkforceMenu";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route errorElement={<ErrorHandle />}>
            {/* Home */}
            <Route
                exact
                path="/"
                element={<NavbarParent />}
                errorElement={<ErrorHandle />}
            >
                <Route index="true" element={<HomeUI />} />
                <Route exact path="/home" element={<HomeUI />} />
                <Route exact path="/home/login" element={<LoginUI />} />
            </Route>

            <Route
                exact
                path="/manage"
                element={<AdminUI />}
                errorElement={<ErrorHandle />}
            >
                <Route index="true" element={<Dashboard />} />
                <Route
                    index="true"
                    path="/manage/dashboard"
                    element={
                        <Navigate to="/manage/dashboard/summary" replace />
                    }
                />
                <Route
                    // exact
                    path="/manage/dashboard/summary"
                    element={<Dashboard />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/dashboard/checkedin"
                    element={<ArrivalsMenu />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/dashboard/guestnights"
                    element={<OvernightsMenu />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/dashboard/occupancy_rate"
                    element={<OccupancyRateMenu />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/dashboard/average_length_of_stay"
                    element={<AverageLengthofStayMenu />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/dashboard/market_segments"
                    element={<MarketSegmentsMenu />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/dashboard/employment_workforce"
                    element={<EmploymentAndWorkForceMenu />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/dashboard/revenue_expenditure"
                    element={<RevenueExpenditureMenu />}
                    errorElement={<ErrorHandle />}
                />

                <Route
                    index="true"
                    path="/manage/forecasting/"
                    element={
                        <Navigate
                            to="/manage/forecasting/average_length_of_stay"
                            replace
                        />
                    }
                />
                <Route
                    // exact
                    path="/manage/forecasting/average_length_of_stay"
                    element={<ForcastLengthOfStayMenu />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/forecasting/workforce"
                    element={<ForcastWorkforceMenu />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/forecasting/market_segments"
                    element={<ForcastMarketSegmentsMenu />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/guest-report"
                    element={<AEform />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/workforce-report"
                    element={<WorkforceForm />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    index="true"
                    path="/manage/maps"
                    element={
                        <Navigate to="/manage/maps/accomodation" replace />
                    }
                />
                <Route
                    // exact
                    path="/manage/maps/locations"
                    element={<Locations />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/maps/accomodation"
                    element={<Heatmap />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/maps/origin"
                    element={<ScatterPlot />}
                    errorElement={<ErrorHandle />}
                />

                <Route
                    // exact
                    path="/manage/logout"
                    element={<Logout />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/create-municipality"
                    element={<CreateMunicipality />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/create-establishments"
                    element={<CreateEstablishment />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/create-account"
                    element={<CreateAccount />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/users"
                    element={<ListUser />}
                    errorElement={<ErrorHandle />}
                />
                <Route
                    // exact
                    path="/manage/entries"
                    element={<ListEntry />}
                    errorElement={<ErrorHandle />}
                />
            </Route>
            <Route exact path="*" element={<NotFound />} />
        </Route>
    )
);

export default router;
