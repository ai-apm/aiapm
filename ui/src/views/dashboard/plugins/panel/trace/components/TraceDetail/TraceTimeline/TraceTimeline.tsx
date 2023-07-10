import { Trace } from "types/plugins/trace"
import { TNil } from "../../../types/misc";
import { IViewRange, TUpdateViewRangeTimeFunction, ViewRangeTimeUpdate } from "../../../types/types";
import { useCallback, useState } from "react";
import { Box } from "@chakra-ui/react";
import TimelineHeader from "./Header/TimelineHeader";
import SpanRows from './SpanRows'

interface Props {
    registerAccessors: any
    findMatchesIDs: Set<string> | TNil;
    scrollToFirstVisibleSpan: () => void;
    trace: Trace;
    updateNextViewRangeTime: (update: ViewRangeTimeUpdate) => void;
    updateViewRangeTime: TUpdateViewRangeTimeFunction;
    viewRange: IViewRange;
}

const TraceTimeline = ({ trace, updateNextViewRangeTime, updateViewRangeTime, viewRange,registerAccessors,scrollToFirstVisibleSpan,findMatchesIDs } : Props) => {
    const [spanNameWidth, setSpanNameWidth] = useState(0.2)
    const [childrenHiddenIDs, setChildrenHiddenIDs] = useState<Set<string>>(new Set())
    const collapseAll = () => {
        
    }
    const collapseOne = () => {

    }
    const expandAll = () => {
    }
    const expandOne = () => {
    }

    const onChildrenToggle = useCallback(ids => {
        setChildrenHiddenIDs(ids)
    },[])


    return (<Box>
        <TimelineHeader
          duration={trace.duration}
          nameColumnWidth={spanNameWidth}
          onCollapseAll={collapseAll}
          onCollapseOne={collapseOne}
          onColummWidthChange={setSpanNameWidth}
          onExpandAll={expandAll}
          onExpandOne={expandOne}
          viewRangeTime={viewRange.time}
          updateNextViewRangeTime={updateNextViewRangeTime}
          updateViewRangeTime={updateViewRangeTime}
        />
        <SpanRows 
            trace={trace} 
            registerAccessors={registerAccessors}  
            scrollToFirstVisibleSpan={scrollToFirstVisibleSpan}  
            findMatchesIDs={findMatchesIDs}  
            currentViewRangeTime={viewRange.time.current} 
            spanNameWidth={spanNameWidth} 
            search=""
            childrenHiddenIDs={childrenHiddenIDs}
            onChildrenToggle={onChildrenToggle}
            />
    </Box>)
}

export default TraceTimeline