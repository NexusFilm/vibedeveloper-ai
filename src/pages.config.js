import AdminDashboard from './pages/AdminDashboard';
import CanvasView from './pages/CanvasView';
import Dashboard from './pages/Dashboard';
import Examples from './pages/Examples';
import Home from './pages/Home';
import NewProject from './pages/NewProject';
import Pricing from './pages/Pricing';
import ProjectResult from './pages/ProjectResult';
import PromptEditor from './pages/PromptEditor';
import Templates from './pages/Templates';
import VisualPreview from './pages/VisualPreview';
import Help from './pages/Help';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminDashboard": AdminDashboard,
    "CanvasView": CanvasView,
    "Dashboard": Dashboard,
    "Examples": Examples,
    "Home": Home,
    "NewProject": NewProject,
    "Pricing": Pricing,
    "ProjectResult": ProjectResult,
    "PromptEditor": PromptEditor,
    "Templates": Templates,
    "VisualPreview": VisualPreview,
    "Help": Help,
}

export const pagesConfig = {
    mainPage: "NewProject",
    Pages: PAGES,
    Layout: __Layout,
};