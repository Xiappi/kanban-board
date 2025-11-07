import type { ItemModel } from "../models/ItemModel";
import type { SwimlaneModel } from "../models/Swimlane";
import { getPaletteClasses } from "../providers/colorPaletteProvider";
import Item from "./Item";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@mdi/react";
import {
  mdiChevronLeft,
  mdiChevronDoubleLeft,
  mdiChevronRight,
  mdiChevronDoubleRight,
} from "@mdi/js";

export default function Swimlane({
  model,
  items,
  onDrop,
}: {
  model: SwimlaneModel;
  items: ItemModel[];
  onDrop: (itemId: string, swimlaneId: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const { bg, border, text } = getPaletteClasses(model.colorPaletteKey);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  // Refs for measuring
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const probeRef = useRef<HTMLDivElement | null>(null);

  // DROP LOGIC

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default to allow drop
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData("text/plain", id);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetSwimlaneId: string
  ) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer) {
      const draggedId = event.dataTransfer.getData("text/plain");

      if (draggedId) {
        onDrop(draggedId, targetSwimlaneId);
      }
    }
  };

  // RESIZE LOGIC
  // tune these to your markup
  const gapPx = 12; // vertical gap between items (e.g., Item has `mb-3` => 12px)
  const bodyPaddingPx = 32; // p-4 => 16 top + 16 bottom

  // --- auto page size based on viewport space ---
  useEffect(() => {
    if (!bodyRef.current) return;

    const measure = () => {
      const bodyTop = bodyRef.current!.getBoundingClientRect().top;
      const footerH = footerRef.current?.getBoundingClientRect().height ?? 0;
      const itemH = probeRef.current?.getBoundingClientRect().height || 72; // fallback if probe not measured yet

      // Space from the top of the list to the bottom of the viewport,
      // minus the lane’s footer and the body padding.
      const available = window.innerHeight - bodyTop - footerH - bodyPaddingPx;

      if (available <= 0 || itemH <= 0) return;

      // +gapPx so the last item’s bottom gap can still fit without clipping
      const raw = Math.floor((available + gapPx) / (itemH + gapPx));
      const next = Math.max(1, Math.min(200, raw));

      setPageSize((prev) => (prev === next ? prev : next));
    };

    // initial measure
    measure();

    // re-measure on window resize/zoom, and when any observed element’s box changes
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => onResize());
    ro.observe(document.body); // catch font-size/layout shifts
    if (bodyRef.current) ro.observe(bodyRef.current);
    if (footerRef.current) ro.observe(footerRef.current);
    if (probeRef.current) ro.observe(probeRef.current);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  // clamp page when items/pageSize change
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => {
    if (page > totalPages - 1) setPage(totalPages - 1);
  }, [totalPages, page]);

  // reset page when lane changes
  useEffect(() => setPage(0), [model.id]);

  const pagedItems = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return (
    <>
      <div
        className={`flex flex-col relative transition delay-75 ease-in-out  ${
          isDragging ? "-translate-y-1 scale-102" : ""
        } `}
      >
        {/* Header stays fixed height */}
        <div
          className={`flex items-center justify-center h-16 rounded-t-lg border ${bg} ${border} ${text}`}
        >
          <h3 className="text-2xl font-semibold">
            {model.name} ({items.length})
          </h3>
        </div>

        {/* Body grows until max-h is reached, then scrolls */}
        <div
          className={`bg-slate-50 border-r-1 border-b-1 border-l-1 border-gray-300 shadow-xl p-4 min-h-[17vh] ${
            isDragging ? "opacity-50" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, model.id)}
          ref={bodyRef}
        >
          {isDragging && (
            <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
              <div className="rounded-md border-2 border-dashed text-black px-4 py-2">
                Move Here
              </div>
            </div>
          )}

          <div
            className="invisible absolute -z-10 pointer-events-none"
            aria-hidden
            ref={probeRef}
          >
            {/* Hidden probe item to measure a single card height accurately */}

            <div
              className="w-full flex flex-col px-4 py-3 mb-3"
              draggable
              onDragStart={(e) => handleDragStart(e, model.id)}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold truncate">
                  Sample Header
                </h4>
              </div>
              <p className="text-sm text-gray-400">Sample Description</p>
            </div>
          </div>

          {pagedItems.map((item) => (
            <Item
              key={item.id}
              model={item}
              colorPaletteKey={model.colorPaletteKey}
              handleDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>
      {/* Footer (fixed height area below body) */}
      <div
        ref={footerRef}
        className={`flex flex-col items-center justify-between px-3 py-2 rounded-b-lg ${bg} ${border} `}
      >
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 border rounded disabled:opacity-50 ${text}`}
              disabled={page === 0}
              onClick={() => setPage(0)}
              aria-label="First page"
            >
              <Icon path={mdiChevronDoubleLeft} size={0.75}></Icon>
            </button>
            <button
              className={`px-3 py-1 border rounded disabled:opacity-50 ${text}`}
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <Icon path={mdiChevronLeft} size={0.75}></Icon>
            </button>
            <button
              className={`px-3 py-1 border rounded disabled:opacity-50 ${text}`}
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <Icon path={mdiChevronRight} size={0.75}></Icon>
            </button>
            <button
              className={`px-3 py-1 border rounded disabled:opacity-50 ${text}`}
              disabled={page >= totalPages - 1}
              onClick={() => setPage(totalPages - 1)}
              aria-label="Last page"
            >
              <Icon path={mdiChevronDoubleRight} size={0.75}></Icon>
            </button>
          </div>
        )}

        <div className={`text-xs my-2 ${text}`}>
          Page {page + 1} of {totalPages} - Showing{" "}
          {items.length === 0
            ? 0
            : `${page * pageSize + 1}-${Math.min(
                (page + 1) * pageSize,
                items.length
              )}`}{" "}
          of {items.length}
        </div>
      </div>
    </>
  );
}
