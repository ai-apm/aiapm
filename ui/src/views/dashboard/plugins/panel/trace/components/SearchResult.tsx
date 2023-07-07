import { Panel } from "types/dashboard"
import { Trace } from "types/plugins/trace"
import SearchResultPlot from "./SearchResultPlot"
import { TimeRange } from "types/time"
import { Box, Button, Flex, HStack, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Select, StackDivider, Text, VStack, chakra } from "@chakra-ui/react"
import TraceCard from "./TraceCard"
import { useEffect, useMemo, useState } from "react"
import { clone, cloneDeep, remove } from "lodash"
import TraceCompare from "./TraceCompare/TraceCompare"
import { FaTimes } from "react-icons/fa"

interface Props {
    panel: Panel
    traces: Trace[]
    timeRange: TimeRange
}
const TraceSearchResult = ({ panel, traces, timeRange }: Props) => {
    const [selectedTraces, setSelectedTraces] = useState<Trace[]>([])
    const [sort, setSort] = useState(traceSortTypes[0].value)
    const [comparison, setComparison] = useState<string[]>([])

    useEffect(() => {
        setSelectedTraces(clone(traces))
    }, [traces])

    const maxDuration = useMemo(() => Math.max(...traces.map(trace => trace.duration)), [traces])

    const onSelect = (traceIds: string[]) => {
        const selected = traces.filter(trace => traceIds.includes(trace.traceID))
        setSelectedTraces(selected)
    }

    const sortedTraces = useMemo(() => {
        switch (sort) {
            case "recent":
                return selectedTraces.sort((a, b) => b.startTime - a.startTime)
            case "mostErrors":
                return selectedTraces.sort((a, b) => b.errorsCount - a.errorsCount)
            case "longest":
                return selectedTraces.sort((a, b) => b.duration - a.duration)
            case "shortest":
                return selectedTraces.sort((a, b) => a.duration - b.duration)
            case "mostSpans":
                return selectedTraces.sort((a, b) => b.spans.length - a.spans.length)
            case "leastSpans":
                return selectedTraces.sort((a, b) => a.spans.length - b.spans.length)
            default:
                return traces
        }
    }, [selectedTraces, sort])

    const onTraceChecked = traceId => {

        if (comparison.includes(traceId)) {
            remove(comparison, i => i == traceId)
        } else {
            comparison.push(traceId)
        }

        setComparison([...comparison])
    }

    const comparedTraces = comparison.map(traceId => {
        return traces.find(t => t.traceID == traceId)
    })

    const removeFromCompare = traceId => {
        remove(comparison, i => i == traceId)
        setComparison([...comparison])
    }


    return (<Box pl="2">
        <SearchResultPlot traces={traces} timeRange={timeRange} onSelect={onSelect} />
        <Box pl="2" pr="20px">
            <Flex alignItems="center" justifyContent="space-between" mb="1">
                <HStack height="40px" textStyle="title">
                    {selectedTraces.length != traces.length ? <Text>{selectedTraces.length} Traces Selected</Text> : <Text>{selectedTraces.length} Traces Total</Text>}
                    {selectedTraces.length != traces.length && <Button size="sm" variant="outline" onClick={() => setSelectedTraces(clone(traces))}>Clear selection</Button>}
                </HStack>
                {
                    comparison.length > 0 && <HStack textStyle="title">
                        <Text><ComparisonTraces removeFromCompare={removeFromCompare} comparedTraces={comparedTraces} maxDuration={maxDuration}/>  selected for comparison</Text>
                        <TraceCompare traces={comparedTraces}/>
                    </HStack>
                }
                <HStack alignItems="center">
                    <Text minWidth="fit-content">Sort</Text>
                    <Select size="sm" value={sort} onChange={e => setSort(e.currentTarget.value)}>
                        {traceSortTypes.map(sortType => <option key={sortType.value} value={sortType.value}>{sortType.label}</option>)}
                    </Select>
                </HStack>
            </Flex>
            <VStack alignItems="left" maxH="500px" overflowY="scroll">
                {sortedTraces.map(trace => <TraceCard key={trace.traceID} trace={trace} maxDuration={maxDuration} checked={comparison.includes(trace.traceID)} checkDisabled={comparison.length >= 2 && !comparison.includes(trace.traceID)} onChecked={onTraceChecked} />)}
            </VStack>
        </Box>
    </Box>)
}

export default TraceSearchResult


const ComparisonTraces = ({ comparedTraces,maxDuration,removeFromCompare }: { comparedTraces: Trace[],maxDuration: number,removeFromCompare:any }) => {
    return (<>
        <Popover trigger="hover" placement="left">
            <PopoverTrigger>
                <chakra.span color="brand.500" cursor="pointer">{comparedTraces.length}</chakra.span>
            </PopoverTrigger>
            <PopoverContent minWidth="500px">
                <PopoverArrow />
                <PopoverBody>
                    <VStack alignItems="left" divider={<StackDivider />}>
                        {comparedTraces.map(trace => {return trace && <HStack spacing={2}>
                        <TraceCard  trace={trace} maxDuration={maxDuration} simple/>
                        <FaTimes cursor="pointer" onClick={() => removeFromCompare(trace.traceID)}/>
                        </HStack>})}
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    </>)
}
const traceSortTypes = [
    {
        label: "Most Recent",
        value: "recent"
    },
    {
        label: "Most Errors",
        value: "mostErrors"
    },
    {
        label: "Longest Duruation",
        value: "longest"
    },
    {
        label: "Shortest Duruation",
        value: "shortest"
    },
    {
        label: "Most Spans",
        value: "mostSpans"
    },
    {
        label: "Least Spans",
        value: "leastSpans"
    }
]