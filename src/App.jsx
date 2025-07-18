import { useEffect, useRef, useState } from "react";
import { themes, fonts } from "./options";
import useStore from "./store";
import { cn } from "./lib/utils";
import CodeEditor from "./components/CodeEditor";
import { Card, CardContent } from "./components/ui/card";
import ExportOptions from "./components/controls/ExportOptions";
import ThemeSelect from "./components/controls/ThemeSelect";
import LanguageSelect from "./components/controls/LanguageSelect";
import FontSelect from "./components/controls/FontSelect";
import FontSizeInput from "./components/controls/FontSizeInput";
import PaddingSlider from "./components/controls/PaddingSlider";
import BackgroundSwitch from "./components/controls/BackgroundSwitch";
import DarkModeSwitch from "./components/controls/DarkModeSwitch";
import { Resizable } from "re-resizable";
import { Button } from "./components/ui/button";
import { ResetIcon } from "@radix-ui/react-icons";
import WidthMeasurement from "./components/WidthMeasurement";

function App() {
  const [width, setWidth] = useState("auto");
  const [showWidth, setShowWidth] = useState(false);

  const theme = useStore((state) => state.theme);
  const padding = useStore((state) => state.padding);
  const fontStyle = useStore((state) => state.fontStyle);
  const showBackground = useStore((state) => state.showBackground);

  const editorRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.size === 0) return;
    const state = Object.fromEntries(queryParams);

    useStore.setState({
      ...state,
      code: state.code ? atob(state.code) : "",
      autoDetectLanguage: state.autoDetectLanguage === "true",
      darkMode: state.darkMode === "true",
      fontSize: Number(state.fontSize || 18),
      padding: Number(state.padding || 64),
    });
  }, []);

  return (
    <main className="dark h-screen flex flex-col gap-4 justify-center items-center bg-gray-950 text-white p-4">
      <link
        rel="stylesheet"
        href={themes[theme].theme}
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href={fonts[fontStyle].src}
        crossOrigin="anonymous"
      />

      <div className="w-full overflow-auto flex grow items-center justify-center p-4 border rounded-xl border-b-gray-900">
        <Resizable
          enable={{ left: true, right: true }}
          minWidth={padding * 2 + 300}
          maxWidth="100%"
          size={{ width }}
          onResize={(e, dir, ref) => setWidth(ref.offsetWidth)}
          onResizeStart={() => setShowWidth(true)}
          onResizeStop={() => setShowWidth(false)}
        >
          <div
            className={cn(
              "overflow-hidden mb-2 transition-all ease-out",
              showBackground
                ? themes[theme].background
                : "ring ring-neutral-900"
            )}
            style={{ padding }}
            ref={editorRef}
          >
            <CodeEditor />
          </div>
          <WidthMeasurement showWidth={showWidth} width={width} />
          <div
            className={cn(
              "transition-opacity w-fit mx-auto -mt-4",
              showWidth || width === "auto"
                ? "invisible opacity-0"
                : "visible opacity-100"
            )}
          >
            <Button size="sm" onClick={() => setWidth("auto")} variant="ghost">
              <ResetIcon className="mr-2" />
              Reset width
            </Button>
          </div>
        </Resizable>
      </div>

      <Card className="p-6 w-fit bg-gray-900/90 backdrop-blur">
        <CardContent className="flex flex-wrap gap-4 sm:gap-6 p-0">
          <ThemeSelect />
          <LanguageSelect />
          <FontSelect />
          <FontSizeInput />
          <PaddingSlider />
          <BackgroundSwitch />
          <DarkModeSwitch />
          <div className="w-px bg-gray-800" />
          <div className="place-self-center">
            <ExportOptions targetRef={editorRef} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
