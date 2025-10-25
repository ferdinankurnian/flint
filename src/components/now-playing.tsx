import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { PauseIcon, RewindIcon, FastForwardIcon, PlaylistIcon, SpeakerLowIcon, QuotesIcon } from "@phosphor-icons/react"

export const NowPlaying = () => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="flex flex-col gap-4 items-center justify-center p-6">
                <div className="size-72 bg-neutral-800 rounded-md mx-auto"></div>
                <div className="w-full space-y-2">
                    <Slider defaultValue={[0]} max={100} step={1} />
                    <div className="flex flex-row justify-between items-center">
                        <span className="text-xs text-white/50">0:00</span>
                        <span className="text-xs text-white/50">3:00</span>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-1">
                    <span className="text-lg font-semibold">Nothing</span>
                    <span className="text-sm text-white/50">Is Playing</span>
                </div>
                <div className="flex flex-row gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full size-18">
                        <RewindIcon className="size-10" weight="fill" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full size-18">
                        <PauseIcon className="size-10" weight="fill" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full size-18">
                        <FastForwardIcon className="size-10" weight="fill" />
                    </Button>
                </div>
                <div className="flex flex-row gap-4">
                    <Button variant="ghost" size="icon-lg">
                        <PlaylistIcon className="size-6" />
                    </Button>
                    <Button variant="ghost" size="icon-lg">
                        <SpeakerLowIcon className="size-6" />
                    </Button>
                    <Button variant="ghost" size="icon-lg">
                        <QuotesIcon className="size-6" />
                    </Button>
                </div>
            </div>
        </div>
    )
}