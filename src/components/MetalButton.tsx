import { LiquidMetalButton } from "@designcodeio/threeui/components/LiquidMetalButton";

/** ThreeUI's liquid-metal pill fills its parent, so it needs an explicit box to render in. */
export function MetalButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <div className="relative h-[84px] w-[236px] shrink-0 overflow-hidden rounded-[2rem]">
      <LiquidMetalButton variant="pill" text={text} onClick={onClick} />
    </div>
  );
}
