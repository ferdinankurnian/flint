import { createFileRoute } from '@tanstack/react-router'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { NowPlaying } from "@/components/now-playing"
import { Playlist } from "@/components/playlist"

export const Route = createFileRoute('/')({ component: App })

function App() {


  return (
    <div className="min-h-screen bg-background flex flex-row">
      <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen"
    >
      <ResizablePanel defaultSize={25} minSize={25} maxSize={50}>
        <Playlist />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel minSize={25}>
        <NowPlaying />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={25} maxSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
    </div>
  )
}
