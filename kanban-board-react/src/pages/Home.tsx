import CardBoard from "../components/CardBoard";

export default function HomePage() {
  return (
    <div className="content-center">
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-12 lg:gap-x-10 gap-y-6">
        <CardBoard></CardBoard>
        <CardBoard></CardBoard>
        <CardBoard></CardBoard>
        <CardBoard></CardBoard>
        <CardBoard></CardBoard>
      </div>

      {/* <div className="w-full flex space-x-3 ml-3">
        <CardBoard></CardBoard>
        <CardBoard></CardBoard>
      </div> */}
    </div>
  );
}
