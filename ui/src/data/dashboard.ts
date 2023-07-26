import { Dashboard, DashboardLayout } from "types/dashboard";
import { PanelBorderType, PanelDecorationType } from "types/panel/styles";
import { globalTeamId } from "types/teams";

export const initDashboard = (): Dashboard => {
    return {
        id: "",
        title: "New dashboard",
        tags: [],
        data: {
            panels: [],
            variables: [],
            sharedTooltip: false,
            editable: true,
            hidingVars: "",
            description: "",
            styles: {
                bg: "url(http://datav-react.jiaminghi.com/demo/manage-desk/static/media/bg.110420cf.png)",
                bgEnabled: false,
                border: PanelBorderType.None,
                // decoration: {
                //     type: PanelDecorationType.None,
                //     width: '100%',
                //     height: "20px",
                //     top: '-30px',
                //     left: '',
                //     justifyContent: "center",
                //     reverse: false
                // },
            },
            layout: DashboardLayout.Vertical,
            allowPanelsOverlap: false,
            enableUnsavePrompt: true,
            enableAutoSave: false,
            autoSaveInterval: 120,
            lazyLoading: true
        },
        ownedBy: globalTeamId,
    }
}

