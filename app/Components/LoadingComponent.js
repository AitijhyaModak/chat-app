export default function LoadingComponent({ isLoading }) {
  return (
    <>
      {isLoading ? (
        <div className="mt-2 h-7 w-7 rounded-full border-t-4 border-t-white mx-auto animate-spin-fast "></div>
      ) : null}
    </>
  );
}
