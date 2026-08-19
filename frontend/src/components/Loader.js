export default function Loader({
  message = "Loading your notes...",
}) {
  return (
    <div
      className="loading-text"
      role="status"
    >
      {message}
    </div>
  );
}
