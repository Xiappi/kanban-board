export default function Button({
  children,
  onClick,
  type,
  variant,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  variant?: "primary" | "secondary" | "danger";
}) {
  let style = "";

  switch (variant) {
    case "secondary":
      style = "border border-[#d1d5db] rounded-lg bg-gray-50 hover:bg-gray-200";
      break;

    case "danger":
      style = "text-white bg-red-700 hover:bg-red-800";
      break;

    case undefined:
    case "primary":
    default:
      style = "text-white bg-blue-700 hover:bg-blue-800";
      break;
  }

  return (
    <button
      type={type === undefined ? "button" : type}
      onClick={onClick && (() => onClick())}
      className={`${style} font-medium rounded-lg text-sm px-5 py-2.5 me-2`}
    >
      <div className="flex items-center">{children}</div>
    </button>
  );
}
