import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import mermaid from "mermaid";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Sector,
  type PieSectorShapeProps,
  XAxis,
  YAxis,
} from "recharts";
import { Alert as UiAlert, AlertDescription, AlertTitle } from "./ui/alert.js";
import { Badge as UiBadge } from "./ui/badge.js";
import {
  Card as UiCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.js";
import {
  Carousel as UiCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel.js";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart.js";
import {
  Accordion as UiAccordion,
  AccordionContent,
  AccordionItem as UiAccordionItem,
  AccordionTrigger,
} from "./ui/accordion.js";
import {
  HoverCard as UiHoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card.js";
import { Progress as UiProgress } from "./ui/progress.js";
import { Separator as UiSeparator } from "./ui/separator.js";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable.js";
import { Slider as UiSlider } from "./ui/slider.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table.js";
import {
  Tabs as UiTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs.js";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip.js";
import { DarkThemeIcon, LightThemeIcon, SystemThemeIcon } from "./icons.js";
import { cn } from "./ui/utils.js";

export type ArtifactComponentName = keyof typeof artifactComponents;

export type TocItem = { id: string; text: string; level: 2 | 3 };

const emptyToc: TocItem[] = [];

export function ArtifactShell({
  children,
  toc = emptyToc,
}: {
  children: React.ReactNode;
  toc?: TocItem[];
}) {
  const contentRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () =>
      root.classList.toggle(
        "dark",
        theme === "dark" || (theme === "system" && media.matches),
      );
    apply();
    if (theme !== "system") return;
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    const article = contentRef.current;
    if (!article) return;
    const headings = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h2, h3"),
    );
    for (const [index, item] of toc.entries()) {
      const heading = headings[index];
      if (heading) heading.id = item.id;
    }
    const trackedHeadings = headings.slice(0, toc.length);

    let frame = 0;
    const updateActive = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const threshold = 96;
        let current = toc[0]?.id ?? "";
        for (const heading of trackedHeadings) {
          if (heading.getBoundingClientRect().top <= threshold)
            current = heading.id;
          else break;
        }
        setActiveId(current);
      });
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [children, toc]);

  const toggleTheme = () =>
    setTheme((current) =>
      current === "system" ? "dark" : current === "dark" ? "light" : "system",
    );
  const themeIcon =
    theme === "system" ? (
      <SystemThemeIcon />
    ) : theme === "dark" ? (
      <DarkThemeIcon />
    ) : (
      <LightThemeIcon />
    );

  return (
    <>
      <div className="aa-topbar">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Theme: ${theme}`}
          title={`Theme: ${theme}`}
        >
          {themeIcon}
        </button>
        <button type="button">Share</button>
      </div>
      <div className="aa-page-shell">
        <main ref={contentRef} className="aa-content">
          {children}
        </main>
        {toc.length > 0 && (
          <aside id="aa-toc" className="aa-toc" aria-label="Table of contents">
            <div className="aa-toc-title">Contents</div>
            <nav>
              {toc.map((item) => (
                <a
                  key={item.id}
                  className={cn(
                    item.level === 3 && "aa-toc-nested",
                    activeId === item.id && "active",
                  )}
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    const target = document.getElementById(item.id);
                    if (target) {
                      setActiveId(item.id);
                      window.scrollTo({
                        top:
                          target.getBoundingClientRect().top +
                          window.scrollY -
                          80,
                        behavior: "smooth",
                      });
                      history.replaceState(null, "", `#${item.id}`);
                    }
                  }}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>
    </>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="aa-section">
      {title && <h2>{title}</h2>}
      {description && <p className="aa-section-description">{description}</p>}
      <div>{children}</div>
    </section>
  );
}

export function Stack({
  gap = "md",
  children,
}: {
  gap?: "sm" | "md" | "lg";
  children: React.ReactNode;
}) {
  return <div className={cn("aa-stack", `aa-gap-${gap}`)}>{children}</div>;
}

export function Grid({
  columns = 2,
  children,
}: {
  columns?: 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("aa-grid", columns === 3 ? "aa-grid-3" : "aa-grid-2")}>
      {children}
    </div>
  );
}

export function Card({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <UiCard>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </UiCard>
  );
}

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "warning";
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <UiAlert className={cn("aa-callout", `aa-callout-${variant}`)}>
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </UiAlert>
  );
}

export function Stat({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description?: string;
}) {
  return (
    <UiCard className="aa-stat">
      <div className="aa-stat-value">{value}</div>
      <div className="aa-stat-label">{label}</div>
      {description && <div className="aa-stat-description">{description}</div>}
    </UiCard>
  );
}

export type TimelineItem = {
  title: string;
  description?: string;
  date?: string;
};
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="aa-timeline">
      {items.map((item, i) => (
        <li key={i}>
          <div>
            {item.date && <span className="aa-timeline-date">{item.date}</span>}
            <strong>{item.title}</strong>
            {item.description && <p>{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export type TabItem = { label: string; content: string };
export function Tabs({ items }: { items: TabItem[] }) {
  return (
    <UiTabs defaultValue={items[0]?.label} className="aa-tabs">
      <TabsList>
        {items.map((item) => (
          <TabsTrigger key={item.label} value={item.label}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.label} value={item.label}>
          {item.content}
        </TabsContent>
      ))}
    </UiTabs>
  );
}

export type AccordionDataItem = { title: string; content: string };
export function Accordion({ items }: { items: AccordionDataItem[] }) {
  return (
    <UiAccordion className="aa-accordion">
      {items.map((item, i) => (
        <UiAccordionItem key={i} value={String(i)}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </UiAccordionItem>
      ))}
    </UiAccordion>
  );
}

export type ChartDatum = Record<string, string | number>;
export function Chart({
  title,
  type = "bar",
  data,
  xKey = "name",
  yKey = "value",
}: {
  title?: string;
  type?: "bar" | "line" | "pie";
  data: ChartDatum[];
  xKey?: string;
  yKey?: string;
}) {
  const config = { [yKey]: { label: yKey, color: "var(--aa-chart-2)" } };
  const renderPieSector = (props: PieSectorShapeProps) => {
    const { index, isActive, ...sectorProps } = props;
    return (
      <Sector {...sectorProps} className={`aa-chart-fill-${(index % 5) + 1}`} />
    );
  };
  return (
    <figure className="aa-chart-card">
      {title && <figcaption>{title}</figcaption>}
      <ChartContainer className="aa-chart" config={config}>
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid stroke="var(--border)" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="var(--aa-chart-2)"
              strokeWidth={2}
              dot
            />
          </LineChart>
        ) : type === "pie" ? (
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={105}
              label
              shape={renderPieSector}
            />
          </PieChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid stroke="var(--border)" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey={yKey}
              fill="var(--aa-chart-2)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        )}
      </ChartContainer>
    </figure>
  );
}

export type MermaidDiagramType =
  | "flowchart"
  | "sequence"
  | "class"
  | "state"
  | "er"
  | "journey"
  | "gantt"
  | "pie"
  | "git"
  | "mindmap"
  | "timeline";

const mermaidTypeDirectives: Record<MermaidDiagramType, string> = {
  flowchart: "flowchart TD",
  sequence: "sequenceDiagram",
  class: "classDiagram",
  state: "stateDiagram-v2",
  er: "erDiagram",
  journey: "journey",
  gantt: "gantt",
  pie: "pie",
  git: "gitGraph",
  mindmap: "mindmap",
  timeline: "timeline",
};

const mermaidDirectivePattern =
  /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|gitGraph|mindmap|timeline)\b/;

function normalizeMermaidChart(chart: string, type?: MermaidDiagramType) {
  let trimmed = chart.trim();
  if (type && !mermaidDirectivePattern.test(trimmed)) {
    trimmed = `${mermaidTypeDirectives[type]}\n${trimmed}`;
  }
  if (/^sequenceDiagram\b/.test(trimmed)) {
    // Common LLM mistake: ==>> is not valid Mermaid sequence syntax.
    // Preserve intent by converting it to the nearest valid form
    return trimmed.replace(/==>>/g, "->>").replace(/==>/g, "->");
  }
  return trimmed;
}

export function MermaidDiagram({
  title,
  type,
  chart,
}: {
  title?: string;
  type?: MermaidDiagramType;
  chart: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const wrapperRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState<{ x: number; y: number } | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [mermaidTheme, setMermaidTheme] = useState<"default" | "dark">(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "default",
  );
  const normalizedChart = normalizeMermaidChart(chart, type);
  const transform = useMemo(
    () => `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
    [scale, translate],
  );

  useEffect(() => {
    let cancelled = false;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: mermaidTheme,
    });
    mermaid
      .render(`aa-mermaid-${id}`, normalizedChart)
      .then(({ svg }) => {
        if (!cancelled && stageRef.current) stageRef.current.innerHTML = svg;
      })
      .catch((error) => {
        if (!cancelled && stageRef.current) {
          stageRef.current.textContent =
            error instanceof Error ? error.message : String(error);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [normalizedChart, id, mermaidTheme]);

  useEffect(() => {
    const updateTheme = () =>
      setMermaidTheme(
        document.documentElement.classList.contains("dark")
          ? "dark"
          : "default",
      );
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    updateTheme();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onFullscreen = () =>
      setFullscreen(document.fullscreenElement === wrapperRef.current);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  const zoom = (factor: number) =>
    setScale((current) => Math.max(0.2, Math.min(10, current * factor)));
  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrapperRef.current?.requestFullscreen();
  };

  return (
    <figure
      ref={wrapperRef}
      className={cn(
        "aa-diagram aa-mermaid-card",
        fullscreen && "aa-mermaid-fullscreen",
      )}
    >
      <div className="aa-mermaid-header">
        {title && <figcaption>{title}</figcaption>}
        <div className="aa-mermaid-controls" aria-label="Diagram controls">
          <button type="button" onClick={() => zoom(1.2)}>
            +
          </button>
          <button type="button" onClick={() => zoom(1 / 1.2)}>
            −
          </button>
          <button type="button" onClick={reset}>
            Reset
          </button>
          <button type="button" onClick={toggleFullscreen}>
            {fullscreen ? "Exit" : "Full"}
          </button>
        </div>
      </div>
      <div
        className="aa-mermaid-viewport"
        onMouseDown={(event) => {
          event.preventDefault();
          setPanning({ x: event.clientX, y: event.clientY });
        }}
        onMouseMove={(event) => {
          if (!panning) return;
          const dx = event.clientX - panning.x;
          const dy = event.clientY - panning.y;
          const acceleration = Math.max(1, scale);
          setTranslate((current) => ({
            x: current.x + dx * acceleration,
            y: current.y + dy * acceleration,
          }));
          setPanning({ x: event.clientX, y: event.clientY });
        }}
        onMouseUp={() => setPanning(null)}
        onMouseLeave={() => setPanning(null)}
        onWheel={(event) => {
          event.preventDefault();
          event.stopPropagation();
          zoom(event.deltaY < 0 ? 1.1 : 1 / 1.1);
        }}
      >
        <div className="aa-mermaid" ref={stageRef} style={{ transform }} />
      </div>
    </figure>
  );
}

export function Badge({
  variant = "default",
  children,
}: {
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  return <UiBadge className={`aa-badge-${variant}`}>{children}</UiBadge>;
}

export function Separator() {
  return <UiSeparator />;
}

export type KeyValueItem = { key: string; value: string };
export function KeyValueList({ items }: { items: KeyValueItem[] }) {
  return (
    <dl className="aa-key-values">
      {items.map((item, i) => (
        <div key={i}>
          <dt>{item.key}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export type ChecklistItem = {
  label: string;
  checked?: boolean;
  description?: string;
};
export function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <ul className="aa-checklist">
      {items.map((item, i) => (
        <li key={i}>
          <span>{item.checked === false ? "○" : "✓"}</span>
          <div>
            <strong>{item.label}</strong>
            {item.description && <p>{item.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Progress({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <UiCard className="aa-progress">
      <div className="aa-progress-header">
        <strong>{label}</strong>
        <span>{clamped}%</span>
      </div>
      <UiProgress value={clamped} />
      {description && <p>{description}</p>}
    </UiCard>
  );
}

export function Quote({
  by,
  children,
}: {
  by?: string;
  children: React.ReactNode;
}) {
  return (
    <blockquote className="aa-quote">
      <div>{children}</div>
      {by && <cite>— {by}</cite>}
    </blockquote>
  );
}

export type ProsConsItem = { title: string; description?: string };
export function ProsCons({
  pros,
  cons,
}: {
  pros: ProsConsItem[];
  cons: ProsConsItem[];
}) {
  return (
    <div className="aa-pros-cons">
      <Card title="Pros">
        <ul>
          {pros.map((item, i) => (
            <li key={i}>
              <strong>{item.title}</strong>
              {item.description && <p>{item.description}</p>}
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Cons">
        <ul>
          {cons.map((item, i) => (
            <li key={i}>
              <strong>{item.title}</strong>
              {item.description && <p>{item.description}</p>}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export type ComparisonColumn = { key: string; label: string };
export type ComparisonRow = { label: string; values: Record<string, string> };
export function ComparisonTable({
  columns,
  rows,
}: {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
}) {
  return (
    <div className="aa-table-wrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Criteria</TableHead>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableHead>{row.label}</TableHead>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {row.values[column.key] ?? ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export type DataTableColumn = { key: string; label: string };
export type DataTableRow = Record<
  string,
  string | number | boolean | null | undefined
>;
export function DataTable({
  title,
  columns,
  rows,
  searchable = true,
  searchPlaceholder = "Search...",
}: {
  title?: string;
  columns: DataTableColumn[];
  rows: DataTableRow[];
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const filteredRows = normalized
    ? rows.filter((row) =>
        columns
          .map((column) => String(row[column.key] ?? ""))
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
    : rows;

  return (
    <div className="aa-data-table">
      {title && <h3>{title}</h3>}
      {searchable && (
        <input
          className="aa-data-search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      )}
      <div className="aa-table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {String(row[column.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export type CarouselSlide = { title?: string; content: string };
export function Carousel({
  title,
  slides,
}: {
  title?: string;
  slides: CarouselSlide[];
}) {
  return (
    <figure className="aa-carousel-card">
      {title && <figcaption>{title}</figcaption>}
      <UiCarousel>
        <CarouselContent>
          {slides.map((slide, i) => (
            <CarouselItem key={i}>
              <UiCard>
                <CardHeader>
                  {slide.title && <CardTitle>{slide.title}</CardTitle>}
                </CardHeader>
                <CardContent>{slide.content}</CardContent>
              </UiCard>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </UiCarousel>
    </figure>
  );
}

export function Tooltip({ term, content }: { term: string; content: string }) {
  return (
    <TooltipProvider>
      <UiTooltip>
        <TooltipTrigger
          render={<span className="aa-tooltip-term" title={content} />}
        >
          {term}
        </TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </UiTooltip>
    </TooltipProvider>
  );
}

export function HoverCard({
  trigger,
  title,
  content,
}: {
  trigger: string;
  title?: string;
  content: string;
}) {
  return (
    <UiHoverCard>
      <HoverCardTrigger render={<span className="aa-tooltip-term" />}>
        {trigger}
      </HoverCardTrigger>
      <HoverCardContent>
        {title && <strong>{title}</strong>}
        <p>{content}</p>
      </HoverCardContent>
    </UiHoverCard>
  );
}

export type ResizablePanelItem = {
  title?: string;
  content: string;
  defaultSize?: number;
};
export function Resizable({
  title,
  panels,
}: {
  title?: string;
  panels: ResizablePanelItem[];
}) {
  return (
    <figure className="aa-resizable-card">
      {title && <figcaption>{title}</figcaption>}
      <ResizablePanelGroup
        orientation="horizontal"
        className="aa-resizable-layout"
      >
        {panels.map((panel, i) => (
          <React.Fragment key={i}>
            <ResizablePanel defaultSize={panel.defaultSize}>
              <div className="aa-resizable-panel-content">
                {panel.title && <h3>{panel.title}</h3>}
                <p>{panel.content}</p>
              </div>
            </ResizablePanel>
            {i < panels.length - 1 && <ResizableHandle withHandle />}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    </figure>
  );
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  description,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  description?: string;
}) {
  return (
    <UiCard>
      <div className="aa-progress-header">
        <strong>{label}</strong>
        <span>{value}</span>
      </div>
      <UiSlider value={[value]} min={min} max={max} />
      {description && <p className="aa-section-description">{description}</p>}
    </UiCard>
  );
}

export const artifactComponents = {
  Section,
  Stack,
  Grid,
  Card,
  Callout,
  Stat,
  Timeline,
  Tabs,
  Accordion,
  Badge,
  Separator,
  KeyValueList,
  Checklist,
  Progress,
  Quote,
  ProsCons,
  ComparisonTable,
  DataTable,
  Carousel,
  Tooltip,
  HoverCard,
  Resizable,
  Slider,
  Chart,
  MermaidDiagram,
};

export const allowedComponentNames = Object.keys(artifactComponents);
